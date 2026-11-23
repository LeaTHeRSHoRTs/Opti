import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            formats: ['es'],
            fileName: "opti.js"
        },
        outDir: "dist",
        emptyOutDir: true
    } 
});