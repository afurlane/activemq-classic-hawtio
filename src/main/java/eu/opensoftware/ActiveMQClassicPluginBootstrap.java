package eu.opensoftware;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.ServletRegistration;

import java.io.IOException;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.hawt.web.plugin.HawtioPlugin;

public class ActiveMQClassicPluginBootstrap implements ServletContextListener {

    private static final Logger LOG = LoggerFactory.getLogger(ActiveMQClassicPluginBootstrap.class);
    private String pluginId;
    private String pluginScope;
    private String pluginModule;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        Properties props = new Properties(); 
        try {
            props.load(getClass().getResourceAsStream("/plugin.properties"));
        } catch (IOException e) {
            LOG.error("Error getting properties", e);
        } 
        if (props.isEmpty()) {
            LOG.error("No properties found, cannot register plugin MBean");
            return;
        }
        pluginId = props.getProperty("plugin.id"); 
        pluginScope = props.getProperty("plugin.scope"); 
        pluginModule = props.getProperty("plugin.module"); 
        registerMBean(sce);
        registerServlet(sce);
    }

    private void registerMBean(ServletContextEvent sce) {

        String contextPath = sce.getServletContext().getContextPath();
        HawtioPlugin plugin = new HawtioPlugin();
        plugin.url(contextPath + "/" + pluginId)
            .scope(pluginScope)
            .module("./"+pluginModule)
            .remoteEntryFileName("remoteEntry.js")
            .bustRemoteEntryCache(false)
            .pluginEntry(null)
            .init();
    }

    private void registerServlet(ServletContextEvent sce) {
        ServletRegistration.Dynamic servlet = sce.getServletContext()
            .addServlet(pluginId + "-plugin", new ActiveMQClassicPluginServlet());

        servlet.addMapping("/" + pluginId + "/*");
        servlet.setLoadOnStartup(1);
    }
}
