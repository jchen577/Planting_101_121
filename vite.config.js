import { defineConfig } from "vite";

export default defineConfig({
  base: "/seedy_place_in_outer_space",
  build: {
    outDir: "dist/seedy_place_in_outer_space",
    rollupOptions: {
      input: {
        main: "./index.html", // Ensure this points to your main HTML file
      },
    },
  },
});
