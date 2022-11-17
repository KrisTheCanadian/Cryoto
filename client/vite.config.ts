import path from 'path';
import dns from 'dns';

import EnvironmentPlugin from 'vite-plugin-environment';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

dns.setDefaultResultOrder('verbatim');
// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: './',
  plugins: [
    istanbul({
      include: 'src/*',
      cypress: true,
    }),
    react(),
    EnvironmentPlugin('all'),
  ],
  resolve: {
    alias: [
      {
        find: '@shared',
        replacement: path.resolve(__dirname, 'src/pages/shared'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
});
