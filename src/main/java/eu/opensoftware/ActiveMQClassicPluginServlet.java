package eu.opensoftware;

import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ActiveMQClassicPluginServlet extends HttpServlet {

    private static final Logger LOG = LoggerFactory.getLogger(ActiveMQClassicPluginServlet.class);
    private static final String PATH_DELIMITER = "/";
    private static final String DEFAULT_ENTRY_POINT_PARAM = "defaultEntryPoint";
    private static final String DEFAULT_ENTRY_POINT_FALLBACK = "/remoteEntry.js";
    private final String pluginId;
    private String defaultEntryPoint = DEFAULT_ENTRY_POINT_FALLBACK;

    public ActiveMQClassicPluginServlet() {
        super();
        LOG.info("Initializing plugin servlet");
        Properties props = new Properties();
        try {
            props.load(getClass().getResourceAsStream("/plugin.properties"));
        } catch (IOException e) {
            LOG.error("ERROR retrieving plugin properties", e);
        }
        if (props.isEmpty()) {
            LOG.error("No properties found, cannot retrieve plugin ID");
            throw new IllegalStateException("No properties found, cannot retrieve plugin ID");
        }
        pluginId = props.getProperty("plugin.id");
        LOG.debug("Plugin ID: {}", pluginId);
    }

    @Override
    public void init() {
        ServletContext ctx = getServletContext();
        String configuredEntryPoint = getServletConfig().getInitParameter(DEFAULT_ENTRY_POINT_PARAM);
        if (configuredEntryPoint != null && !configuredEntryPoint.isBlank()) {
            defaultEntryPoint = configuredEntryPoint.startsWith(PATH_DELIMITER)
                    ? configuredEntryPoint
                    : PATH_DELIMITER + configuredEntryPoint;
        }

        LOG.debug("=== Servlet INIT ===");
        LOG.debug("Context path: {}", ctx.getContextPath());
        LOG.debug("Servlet context name: {}", ctx.getServletContextName());
        LOG.debug("Default entry point: {}", defaultEntryPoint);
        LOG.debug("Classloader: {}", this.getClass().getClassLoader());
        LOG.debug("Servlet mappings: {}", ctx.getServletRegistrations());
        LOG.debug("====================");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        String path = req.getPathInfo();
        String contextPath = req.getContextPath();
        
        LOG.debug("ContextPath {}", contextPath);
        LOG.debug("Request {}", req);
        LOG.debug("Path {}", path);
        if (path == null || path.equals("/")) {
            path = defaultEntryPoint;
            LOG.debug("Path is null or /, using remoteEntry path");
        }

        String normalizedPath = path.startsWith(PATH_DELIMITER)
                ? path
                : PATH_DELIMITER + path;
        String resourcePath = PATH_DELIMITER + pluginId + normalizedPath;
        LOG.debug("Resource path in JAR: {}", resourcePath);
        try (InputStream in = getClass().getResourceAsStream(resourcePath)) {
            LOG.debug("Writing to output stream....");
            if (in == null) {
                LOG.debug("Output stream is NULL!!!");
                try {
                    sendNotFound(resp, resourcePath);
                } catch (IOException e) {
                    LOG.error("Failed to send 404 for resource {}", resourcePath, e);
                }
                return;
            }

            if (path.endsWith(".map")) {
                resp.setContentType("application/json");
            } else if (path.endsWith(".js")) {
                resp.setContentType("application/javascript");
            } else if (path.endsWith(".css")) {
                resp.setContentType("text/css");
            } else if (path.endsWith(".txt")) {
                resp.setContentType("text/plain");
            } else if (path.endsWith(".ttf")) {
                resp.setContentType("font/ttf");
            }

            LOG.debug("Writing streamed resource");
            try {
                writeResourceToResponse(in, resp);
            } catch (IOException e) {
                LOG.error("Failed to stream plugin resource {} to HTTP response", resourcePath, e);
                return;
            }
        }
        LOG.debug("End processing servlet request");
    }

    private void sendNotFound(HttpServletResponse resp, String resourcePath) throws IOException {
        resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Not found: " + resourcePath);
    }

    private void writeResourceToResponse(InputStream in, HttpServletResponse resp) throws IOException {
        in.transferTo(resp.getOutputStream());
    }
}
