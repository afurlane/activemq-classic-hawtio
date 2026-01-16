package eu.opensoftware;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.InputStream;

public class ActiveMQClassicPluginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        String path = req.getPathInfo();

        if (path == null || path.equals("/")) {
            path = "/remoteEntry.js";
        }

        String resourcePath = "/activemq-classic" + path;

        try (InputStream in = getClass().getResourceAsStream(resourcePath)) {
            if (in == null) {
                resp.sendError(404, "Not found: " + resourcePath);
                return;
            }

            if (path.endsWith(".js")) resp.setContentType("application/javascript");
            else if (path.endsWith(".css")) resp.setContentType("text/css");
            else if (path.endsWith(".txt")) resp.setContentType("text/plain");
            else if (path.endsWith(".ttf")) resp.setContentType("font/ttf");

            in.transferTo(resp.getOutputStream());
        }
    }
}
