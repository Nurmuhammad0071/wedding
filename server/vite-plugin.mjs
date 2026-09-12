import { loadEnv } from './env.mjs';
import { handleRsvp } from './rsvp.mjs';

export function rsvpTelegramPlugin() {
  loadEnv();
  return {
    name: 'rsvp-telegram',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/rsvp')) return next();
        handleRsvp(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/rsvp')) return next();
        handleRsvp(req, res);
      });
    },
  };
}
