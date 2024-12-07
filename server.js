import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.203.0/path/mod.ts";

const rootPath = Deno.cwd();

serve(
  async (request) => {
    const url = new URL(request.url);
    let filePath = join(rootPath, "dist", url.pathname);

    try {
      // Serve index.html for root `/` or `/seedy_place_in_outer_space/`
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

      // Check the file exists and read it
      const file = await Deno.readFile(filePath);
      const ext = extname(filePath);

      // Serve correct MIME types
      const mimeTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".ico": "image/x-icon",
        ".css": "text/css",
        ".jpg": "image/jpeg",
      };

      return new Response(file, {
        status: 200,
        headers: {
          "content-type": mimeTypes[ext] || "application/octet-stream",
        },
      });
    } catch (error) {
      console.error(`404 Not Found: ${filePath}`, error.message);
      return new Response("404: File Not Found", { status: 404 });
    }
  },
  { port: 8080 },
);

console.log("Server running at http://localhost:8080/");
