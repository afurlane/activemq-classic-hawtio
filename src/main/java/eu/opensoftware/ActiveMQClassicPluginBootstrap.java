package eu.opensoftware;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;

import java.lang.management.ManagementFactory;

import javax.management.MBeanServer;
import javax.management.ObjectName;

public class ActiveMQClassicPluginBootstrap implements ServletContextListener {

    private static final String OBJECT_NAME = "hawtio:type=plugin,name=ActiveMQClassic";

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ActiveMQClassicPluginBootstrap.register();
        sce.getServletContext()
            .addServlet("activemq-classic-plugin", 
                new ActiveMQClassicPluginServlet())
                .addMapping("/activemq-classic/*");

    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // opzionale
    }
    
    public static void register() {
        try {
            MBeanServer server = ManagementFactory.getPlatformMBeanServer();
            ObjectName name = new ObjectName(OBJECT_NAME);

            if (server.isRegistered(name)) {
                return; // idempotente
            }

        ActiveMQClassicPlugin  plugin = new ActiveMQClassicPlugin("/activemq-classic/remoteEntry.js", "activemqClassic", "./ActiveMQClassic", 
            "remoteEntry.js", false, null);

        server.registerMBean(plugin, name);

        } catch (Exception e) {
            throw new RuntimeException("Failed to register Hawtio plugin MBean", e);
        }
    }
}

