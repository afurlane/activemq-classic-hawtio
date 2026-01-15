package eu.opensoftware;

import javax.management.MBeanServer;

public interface HawtioPluginProvider {
    void register(MBeanServer server) throws Exception;
}
