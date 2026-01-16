package eu.opensoftware;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;

import io.hawt.web.plugin.HawtioPlugin;

public class ActiveMQClassicPluginBootstrap implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        registerMBean();
        registerServlet(sce);
    }

    private void registerMBean() {
        HawtioPlugin plugin = new HawtioPlugin();
        plugin.url("/activemq-classic/remoteEntry.js")
            .scope("activemqClassic")
            .module("./ActiveMQClassic")
            .remoteEntryFileName("remoteEntry.js")
            .bustRemoteEntryCache(false)
            .pluginEntry(null)
            .init();
    }

    private void registerServlet(ServletContextEvent sce) {
        sce.getServletContext()
            .addServlet("activemq-classic-plugin", new ActiveMQClassicPluginServlet())
            .addMapping("/activemq-classic/*");
    }
}
