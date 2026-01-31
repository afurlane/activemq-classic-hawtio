# Installing Hawtio 4 and the ActiveMQ Classic Plugin (ActiveMQ 6 Classic)

This guide explains how to install Hawtio 4 inside **ActiveMQ 6 Classic** and how to integrate the **ActiveMQ Classic Hawtio Plugin**.

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

(or download it from the GitHub Releases page)

into:

```sh
$ACTIVEMQ_HOME/webapps/hawtio/WEB-INF/lib/
```

**Important** You must also add hawtio-local-jvm-mbean-4.6.2.jar to the same WEB-INF/lib directory.
It can be downloaded from a Maven repository such as: [maven repository](https://mvnrepository.com/artifact/io.hawt/hawtio-local-jvm-mbean).

Hawtio will automatically detect and load the plugin at startup.

---

## 4. Configure Jetty to expose Hawtio

Edit:

$ACTIVEMQ_HOME/conf/jetty.xml

and add the following changes.

---

### Enable authentication and map the Hawtio application

Add this configuration inside the HttpConfiguration bean

```xml
<property name="customizers">
    <list>
        <bean class="org.eclipse.jetty.server.ForwardedRequestCustomizer"/>
    </list>
</property>
```

Comment out the default ConstraintMapping

```xml
    <bean id="securityConstraintMapping" class="org.eclipse.jetty.security.ConstraintMapping">
        <property name="constraint" ref="securityConstraint" />
        <property name="pathSpec" value="/" />
    </bean>
```

Then add the following mappings:

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

Inside the secHandlerCollection bean (org.eclipse.jetty.server.handler.HandlerCollection), add:

```xml
<bean class="org.eclipse.jetty.webapp.WebAppContext">
    <property name="contextPath" value="/hawtio" />
    <property name="resourceBase" value="${activemq.home}/webapps/hawtio" />
    <property name="logUrlOnStart" value="true" />
</bean>
```

Inside the securityHandler bean (ConstraintSecurityHandler), update the constraintMappings list:

Comment out:
```xml
<!-- <ref bean="securityConstraintMapping" /> -->
```

Add:

```xml
<ref bean="securityConstraintMappingAdmin" />
<ref bean="securityConstraintMappingApi" />
```

Hawtio will then be available at:

http://localhost:<port>/hawtio


## 5. Keycloak Integration (Optional)

If you want to use Keycloak for both Hawtio authentication and ActiveMQ broker authentication, follow the steps below.

### 5.1  Prerequisites
- A running Keycloak instance
- A Keycloak realm configured with roles for ActiveMQ (admins, amq, users)
- A client with Direct Access Grants for broker authentication
- A client with Standard Flow for Hawtio
- The Keycloak Jetty adapter or the following libraries placed in: "<broker path>/lib"

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

### 5.2 JAAS configuration
Edit login.config and add:

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

Example keycloak-bearer.json:

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
Example keycloak-jaas-directaccess.json:

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

### 5.3 Broker Startup Configuration
Edit your custom broker startup script ('brokerdir'/bin/'brokerbatch') and add:

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

### 5.4 Broker Authorization Configuration
Edit conf/activemq.xml and under <broker> → <plugins> add:

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

### 5.5 Remove Jolokia Conflicts

If you extracted hawtio-default or hawtio-war, remove the Jolokia libraries bundled inside the WAR, as they conflict with the version shipped by ActiveMQ.

### 6. Ensure Hawtio Is Mounted Correctly

Jetty will automatically mount Hawtio when:
- The hawtio/ directory exists under webapps/
- The plugin JAR is present in WEB-INF/lib/ of the Hawtio webapp

That’s all. Hawtio should now be fully integrated with ActiveMQ Classic 6 and ready to load the plugin.

Note:
  <brokerdir> refers to the root directory of your ActiveMQ Classic broker
  <brokerbatch> is the startup script generated during broker creation