import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: "package/src/opti.ts",
            formats: ["es"],
            fileName: "opti.js"
        },
        outDir: "package/dist",
        emptyOutDir: true
    } 
});