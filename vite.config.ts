import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: './src/index.ts',    
      output: {
        entryFileNames: `activemq-classic.js`,
        chunkFileNames: `activemq-classic.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'activemq-classic.css';
          }
          return 'activemq-classic.[ext]';
        },
        format: 'esm'
      }
    }
  }
});
