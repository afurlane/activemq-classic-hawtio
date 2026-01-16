package eu.opensoftware;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.ServletRegistration;
import io.hawt.web.plugin.HawtioPlugin;

public class ActiveMQClassicPluginBootstrap implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        registerMBean(sce);
        registerServlet(sce);
    }

    private void registerMBean(ServletContextEvent sce) {
        String contextPath = sce.getServletContext().getContextPath();
        HawtioPlugin plugin = new HawtioPlugin();
        plugin.url(contextPath + "/activemq-classic")
            .scope("activemqClassic")
            .module("./ActiveMQClassic")
            .remoteEntryFileName("remoteEntry.js")
            .bustRemoteEntryCache(false)
            .pluginEntry(null)
            .init();
    }

    private void registerServlet(ServletContextEvent sce) {
        ServletRegistration.Dynamic servlet = sce.getServletContext()
            .addServlet("activemq-classic-plugin", new ActiveMQClassicPluginServlet());

        servlet.addMapping("/activemq-classic/*");
        servlet.setLoadOnStartup(1);
    }
}
