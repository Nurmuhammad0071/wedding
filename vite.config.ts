import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { rsvpTelegramPlugin } from './server/vite-plugin.mjs';

export default defineConfig({
  plugins: [react(), rsvpTelegramPlugin()],
  build: {
    target: 'es2019',
    cssMinify: true,
  },
});
