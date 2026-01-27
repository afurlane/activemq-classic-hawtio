# Installing Hawtio 4 and the ActiveMQ Classic Plugin (ActiveMQ 6 Classic)

This guide explains how to install Hawtio 4 inside ActiveMQ 6 Classic and how to integrate the ActiveMQ Classic Hawtio plugin.

---

## 1. Prerequisites

- ActiveMQ **6 Classic**
- Java 11+
- Maven 3.8+
- Access to:

```sh
$ACTIVEMQ_HOME/
```


---

## 2. Install Hawtio 4

Download Hawtio 4 (`hawtio-default-4.x.x.war`) from Maven Central.

Rename it:
```sh
hawtio.war
```

Extract it into:

```sh
$ACTIVEMQ_HOME/webapps/hawtio/
```

---

## 3. Install the ActiveMQ Classic Hawtio Plugin

Build the plugin:

```sh
mvn clean package
```
Copy the generated JAR:

```sh
target/activemq-classic-hawtio-plugin.jar
```

or download it from the releases page.

into:

```sh
$ACTIVEMQ_HOME/webapps/hawtio/WEB-INF/lib/
```

**NB** now you need to place hawtio-local-jvm-mbean-4.6.2.jar into WEB-INF/lib of Hawtio webapp. You can download it from a [maven repository](https://mvnrepository.com/artifact/io.hawt/hawtio-local-jvm-mbean).

Hawtio will automatically load the plugin at startup.

---

## 4. Configure Jetty to expose Hawtio

Edit:

$ACTIVEMQ_HOME/conf/jetty.xml


and add the following snippets.

---

### Enable authentication for Hawtio and map the application

Add this configuration in bean HttpConfiguration

```xml
<property name="customizers">
    <list>
        <bean class="org.eclipse.jetty.server.ForwardedRequestCustomizer"/>
    </list>
</property>
```

Comment this ConstraintMapping

```xml
    <bean id="securityConstraintMapping" class="org.eclipse.jetty.security.ConstraintMapping">
        <property name="constraint" ref="securityConstraint" />
        <property name="pathSpec" value="/" />
    </bean>
```

right below the previous, now commented out, bean add the following

```xml
<bean id="securityConstraintMappingAdmin" class="org.eclipse.jetty.security.ConstraintMapping">
    <property name="constraint" ref="adminSecurityConstraint" />
    <property name="pathSpec" value="/admin/*" />
</bean>

<bean id="securityConstraintMappingApi" class="org.eclipse.jetty.security.ConstraintMapping">
    <property name="constraint" ref="securityConstraint" />
    <property name="pathSpec" value="/api/*" />
</bean>
```

in bean id "secHandlerCollection" of type "org.eclipse.jetty.server.handler.HandlerCollection", in the list of property "handlers" add the following

```xml
<bean class="org.eclipse.jetty.webapp.WebAppContext">
    <property name="contextPath" value="/hawtio" />
    <property name="resourceBase" value="${activemq.home}/webapps/hawtio" />
    <property name="logUrlOnStart" value="true" />
</bean>
```

in bean with id "securityHandler" of type "org.eclipse.jetty.security.ConstraintSecurityHandler" in property "constraintMappings" in the list comment out this:

```xml
<ref bean="securityConstraintMapping" />
```

and add:

```xml
<ref bean="securityConstraintMappingAdmin" />
<ref bean="securityConstraintMappingApi" />
```

Hawtio will be available at:

http://localhost:<port>/hawtio


### Configure KeyCloak for hawtio and ActiveMQ broker with Direct Access
If you whish to use KeyCloak for both hawtio login (and admin console) you should read the following instructions.

#### Prerequisites
- A running KeyCloak instance
- A configured KeyCloak realm with realm roles for ActiveMQ (admins, amq and users at least) 
- A client with direct access for authenticating the broker
- A client with standard flow for hawtio access
- KeyCloak jetty adapter or the followin libs to put in "<broker path>/lib"

```sh
bcpkix-jdk18on-1.74.jar
bcprov-jdk18on-1.74.jar
bcutil-jdk18on-1.74.jar
commons-codec-1.16.0.jar
commons-logging-1.2.jar
httpclient-4.5.14.jar
httpcore-4.4.16.jar
jboss-logging-3.5.1.Final.jar
keycloak-adapter-core-22.0.4.jar
keycloak-adapter-spi-22.0.0.jar
keycloak-common-22.0.4.jar
keycloak-core-22.0.4.jar
keycloak-crypto-default-22.0.4.jar
keycloak-jetty94-adapter-22.0.0.jar
keycloak-jetty-adapter-spi-22.0.0.jar
keycloak-jetty-core-22.0.0.jar
keycloak-server-spi-22.0.0.jar
keycloak-server-spi-private-22.0.0.jar
```

#### Configuration
Configure login.config with these entries

```json
activemq-queues {
   org.keycloak.adapters.jaas.DirectAccessGrantsLoginModule sufficient
      debug="true"
      role-principal-class="org.apache.activemq.jaas.GroupPrincipal"
      keycloak-config-file="/<activemq-path>>/conf/keycloak-jaas-directaccess.json"
      scope="openid roles";
};

activemq-admin {
   org.keycloak.adapters.jaas.DirectAccessGrantsLoginModule sufficient
      debug="true"
      role-principal-class="org.apache.activemq.jaas.GroupPrincipal"
      keycloak-config-file="/<activemq-path>/conf/keycloak-jaas-directaccess.json"
      roleClaimPath="realm_access.roles"
      scope="openid roles";
};

hawtio-client {
   org.keycloak.adapters.jaas.BearerTokenLoginModule sufficient
       debug="true"
       role-principal-class="org.apache.activemq.jaas.GroupPrincipal"
       keycloak-config-file="/<activemq-path>/conf/keycloak-bearer.json"
       roleClaimPath="realm_access.roles"
       scope="openid roles groups";
};
```

File keycloak-bearer.json should be like:

```json
{
  "realm": "activemq-keycloak",
  "resource": "hawtio-client",
  "bearer-only": true,
  "auth-server-url": "https://keycloak/",
  "ssl-required": "external",
  "principal-attribute": "preferred_username"
}
```
File keycloak-jaas-directaccess.json should be like:

```json
{
  "realm": "activemq-keycloak",
  "auth-server-url": "https://keycloak/",
  "ssl-required": "external",
  "resource": "activemq-queues",
  "verify-token-audience": true,
  "credentials": {
    "secret": "<client secret>>"
  },
  "confidential-port": 0
}
```

Configure the batch file created for custom broker <brokerdir>/bin/<brokerbatch> (you should read ActiveMQ documentation for initial broker creation).

Add the following lines:

```sh
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Dhawtio.authenticationEnabled=true"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Dhawtio.realm=hawtio-client"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Dhawtio.keycloakEnabled=true"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Dhawtio.roles=admin,amq"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Dhawtio.rolePrincipalClasses=org.apache.activemq.jaas.GroupPrincipal"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Dhawtio.keycloakClientConfig=${ACTIVEMQ_BASE}/conf/keycloak-hawtio.json"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Dhawtio.keycloakServerConfig=${ACTIVEMQ_BASE}/conf/keycloak-bearer.json"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Djaas.keycloakServerConfig=${ACTIVEMQ_BASE}/conf/keycloak-jaas-directaccess.json"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Djava.security.auth.login.config=${ACTIVEMQ_BASE}/conf/login.config"
ACTIVEMQ_OPTS="$ACTIVEMQ_OPTS -Dorg.apache.activemq.audit=true"
```

Now is time to set up the broker changing conf/activemq.xml, in section "<broker>" under "<plugins>" add:

```xml
<jaasAuthenticationPlugin configuration="activemq-queues"/>
<authorizationPlugin>
  <map>
      <authorizationMap groupClass="org.apache.activemq.jaas.GroupPrincipal">
        <authorizationEntries>
              <authorizationEntry queue=">" read="admins,amq" write="admins,amq" admin="admins,amq" />
              <authorizationEntry queue="USERS.>" read="admins,amq" write="admins,amq" admin="admins,amq" />
              <authorizationEntry queue="GUEST.>" read="admins,amq" write="admins,amq,users" admin="admins,amq,users" />
              <authorizationEntry topic=">" read="admins,amq" write="admins,amq" admin="admins,amq"/>
              <authorizationEntry topic="USERS.>" read="admins,amq" write="admins,amq" admin="admins,amq"/>
              <authorizationEntry topic="GUEST.>" read="admins,amq" write="admins,amq,users" admin="admins,amq,users"/>
              <authorizationEntry topic="ActiveMQ.Advisory.>" read="admins,amq,users" write="admins,amq,users" admin="admins,amq,users"/>
        </authorizationEntries>
        <!--
          let's assign roles to temporary destinations. comment this entry if we don't want any roles assigned to temp destinations
        -->
        <tempDestinationAuthorizationEntry>
          <tempDestinationAuthorizationEntry admin="tempDestinationAdmins" read="tempDestinationAdmins" write="tempDestinationAdmins"/>
        </tempDestinationAuthorizationEntry>
      </authorizationMap>
  </map>
</authorizationPlugin>
```xml

If you donwload hawtio-default or hawtio-war remember, after uncompressing it in webapps to delete jolokia libs that are in conflict with ActiveMQ shipped version.

That should be all.

### Ensure Hawtio is included in the SecurityHandler

Jetty will automatically mount Hawtio once:

    the hawtio/ directory exists in webapps/
    the plugin JAR is in WEB-INF/lib/ of hawtio webapps
