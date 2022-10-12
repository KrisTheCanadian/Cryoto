/* eslint-disable @typescript-eslint/naming-convention */
import path from 'path';

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/pages/shared'),
    },
  },
});
