package eu.opensoftware;

import javax.management.*;
import java.lang.management.ManagementFactory;

public final class ActiveMQClassicPluginRegister {

    private static final String OBJECT_NAME = "hawtio:type=plugin,name=ActiveMQClassic";

    public static void register() {
        try {
            MBeanServer server = ManagementFactory.getPlatformMBeanServer();
            ObjectName name = new ObjectName(OBJECT_NAME);

            if (server.isRegistered(name)) {
                return; // idempotente
            }

        ActiveMQClassicPlugin  plugin = new ActiveMQClassicPlugin("/static/activemq", "activemqClassic", "./ActiveMQClassic", 
            "remoteEntry.js", false, null);

        server.registerMBean(plugin, name);

        } catch (Exception e) {
            throw new RuntimeException("Failed to register Hawtio plugin MBean", e);
        }
    }
}

