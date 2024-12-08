import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.203.0/path/mod.ts";

const rootPath = Deno.cwd(); // Set the base path for your project

serve(
  async (request) => {
    const url = new URL(request.url);
    let filePath; // Will hold the full resolved path

    try {
      console.log("Request URL:", url.pathname); // Log incoming request path

      // Serve index.html for root or main entry requests
      if (
        url.pathname === "/" ||
        url.pathname === "/seedy_place_in_outer_space/"
      ) {
        filePath = join(
          rootPath,
          "dist",
          "seedy_place_in_outer_space",
          "index.html",
        );
      }
      // Serve the Service Worker
      else if (
        url.pathname === "/seedy_place_in_outer_space/serviceWorker.js"
      ) {
        filePath = join(
          rootPath,
          "dist",
          "seedy_place_in_outer_space",
          "serviceWorker.js",
        );
      }
      // Serve manifest.json
      else if (url.pathname === "/seedy_place_in_outer_space/manifest.json") {
        filePath = join(
          rootPath,
          "dist",
          "seedy_place_in_outer_space",
          "manifest.json",
        );
      }
      // Serve static assets from the assets directory
      else if (url.pathname.startsWith("/seedy_place_in_outer_space/assets/")) {
        filePath = join(rootPath, "dist", url.pathname);
      } else {
        // Log and return 404 for unmatched paths
        console.error(`404 Not Found: ${url.pathname}`);
        return new Response("404: File Not Found", { status: 404 });
      }

      // Read the requested file
      const file = await Deno.readFile(filePath);
      const ext = extname(filePath); // Get file extension

      // Match MIME types with corresponding extensions
      const mimeTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".ico": "image/x-icon",
        ".jpg": "image/jpeg",
        ".css": "text/css",
      };

      return new Response(file, {
        status: 200,
        headers: {
          "content-type": mimeTypes[ext] || "application/octet-stream",
        },
      });
    } catch (error) {
      console.error(`Error while serving file: ${filePath} - ${error.message}`);
      return new Response("404: File Not Found", { status: 404 });
    }
  },
  { port: 8080 },
);

console.log("Server is running at http://localhost:8080/");
