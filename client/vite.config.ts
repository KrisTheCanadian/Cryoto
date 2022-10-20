/* eslint-disable @typescript-eslint/naming-convention */
import path from 'path';
import dns from 'dns';

import EnvironmentPlugin from 'vite-plugin-environment';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

dns.setDefaultResultOrder('verbatim');
// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: './',
  plugins: [react(), EnvironmentPlugin('all')],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/pages/shared'),
    },
  },
});
