package eu.opensoftware;

import java.io.IOException;
import java.io.InputStream;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ActiveMQClassicPluginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        String path = req.getPathInfo(); // es: /static/js/2745.chunk.js

        if (path == null || path.equals("/")) {
            path = "/remoteEntry.js";
        }

        String resourcePath = "/activemq-classic" + path;

        InputStream in = getClass().getResourceAsStream(resourcePath);

        if (in == null) {
            resp.sendError(404, "Not found: " + resourcePath);
            return;
        }

        // content type dinamico
        if (path.endsWith(".js")) resp.setContentType("application/javascript");
        else if (path.endsWith(".txt")) resp.setContentType("text/plain");
        else if (path.endsWith(".ttf")) resp.setContentType("font/ttf");

        in.transferTo(resp.getOutputStream());
    }
}
