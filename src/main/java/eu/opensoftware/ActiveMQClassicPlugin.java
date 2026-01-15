package eu.opensoftware;

import io.hawt.web.plugin.HawtioPluginMBean;

public class ActiveMQClassicPlugin implements HawtioPluginMBean  {

    private final String url;                    // vuoto = plugin locale nel WAR
    private final String scope;                  // nome logico, basta che sia unico
    private final String module;                 // corrisponde all'esportazione (plugin.js → default export)
    private final String remoteEntryFileName;    // RemoteEntryFileName
    private final Boolean bustRemoteEntryCache;  // BustRemoteEntryCache
    private final String pluginEntry;            // percorso relativo sotto /hawtio/

    public ActiveMQClassicPlugin(String url, String scope, String module, String remoteEntryFileName, 
        Boolean bustRemoteEntryCache, String pluginEntry) {
        this.url = url;
        this.scope = scope;  
        this.module = module; 
        this.remoteEntryFileName = remoteEntryFileName; 
        this.bustRemoteEntryCache = bustRemoteEntryCache; 
        this.pluginEntry = pluginEntry; 
    }

    public String getUrl() {
        return url;
    }

    public String getScope() {
        return scope;
    }

    public String getModule() {
        return module;
    }

    public String getRemoteEntryFileName() {
        return remoteEntryFileName;
    }

    public Boolean getBustRemoteEntryCache() {
        return bustRemoteEntryCache;
    }

    public String getPluginEntry() {
        return pluginEntry;
    }
  
    /* 
    public void contextInitialized(ServletContextEvent sce) {
        plugin = new HawtioPlugin();
        plugin.scope("activemqClassic")                     // nome logico, basta che sia unico
            .module("./plugin")                           // corrisponde all'esportazione (plugin.js → default export)
            .pluginEntry("activemq-classic/plugin.js")    // percorso relativo sotto /hawtio/
            .url("")                                      // vuoto = plugin locale nel WAR
            .init();
    }

    public void contextDestroyed(ServletContextEvent sce) {
        if (plugin != null) {
            plugin.destroy();
        }
    }
    */
}
