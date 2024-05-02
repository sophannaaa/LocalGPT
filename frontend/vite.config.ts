import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
          '@api': '/src/api',
          '@assets': '/src/assets',
          '@components': '/src/components',
          '@constants': '/src/constants',
          '@pages': '/src/pages',
          '@state': '/src/state',
        }
    },
    build: {
        outDir: "../static",
        emptyOutDir: true,
        sourcemap: true
    },
    server: {
        proxy: {
            "/ask": "http://localhost:5000",
            "/chat": "http://localhost:5000"
        }
    }
});
