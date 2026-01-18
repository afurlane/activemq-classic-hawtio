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

into:

```sh
$ACTIVEMQ_HOME/webapps/hawtio/WEB-INF/lib/
```

Hawtio will automatically load the plugin at startup.

---

## 4. Configure Jetty to expose Hawtio

Edit:

$ACTIVEMQ_HOME/conf/jetty.xml


and add the following snippets.

---

### A) Enable BASIC authentication for Hawtio

Add this inside the security section:

```xml
<bean id="securityConstraint" class="org.eclipse.jetty.util.security.Constraint">
  <property name="name" value="BASIC" />
  <property name="roles" value="users,admins" />
  <property name="authenticate" value="true" />
</bean>

<bean id="securityConstraintMapping" class="org.eclipse.jetty.security.ConstraintMapping">
  <property name="constraint" ref="securityConstraint" />
  <property name="pathSpec" value="/hawtio/*" />
</bean>
```
Note: pathSpec="/hawtio/*" is required to protect Hawtio.

### B) Mount the Hawtio web application

Inside the list of Jetty handlers (where /admin and /api are defined), add:

```xml
<bean class="org.eclipse.jetty.webapp.WebAppContext">
  <property name="contextPath" value="/hawtio" />
  <property name="resourceBase" value="${activemq.home}/webapps/hawtio" />
  <property name="logUrlOnStart" value="true" />
</bean>
```

Hawtio will be available at:

http://localhost:8164/hawtio


### C) Ensure Hawtio is included in the SecurityHandler

Inside:

```xml
<bean id="secHandlerCollection" class="org.eclipse.jetty.server.handler.HandlerCollection">
```
verify that the Hawtio block is present:
```xml
<bean class="org.eclipse.jetty.webapp.WebAppContext">
  <property name="contextPath" value="/hawtio" />
  <property name="resourceBase" value="${activemq.home}/webapps/hawtio" />
  <property name="logUrlOnStart" value="true" />
</bean>
```

### D) No changes required to Jetty connectors

The final part of jetty.xml (invokeConnectors, configureJetty, invokeStart) does not require modifications.

Jetty will automatically mount Hawtio once:

    the hawtio/ directory exists in webapps/

    the plugin JAR is in WEB-INF/lib/
