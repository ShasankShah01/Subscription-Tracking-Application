import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // ── PWA: Aggressive caching of critical assets only ──────────────────────
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],

      manifest: {
        name: 'STArt — Subscription Tracker',
        short_name: 'STArt',
        description: 'Premium subscription tracking — manage, analyze, and control all your recurring expenses in one beautiful workspace.',
        theme_color: '#7c3aed',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        // Cache critical JS, CSS, HTML, SVG assets
        globPatterns: ['**/*.{js,css,html,svg}'],

        // Exclude large assets that don't need precaching
        globIgnores: ['**/node_modules/**', '**/*.map'],

        // Runtime caching for API calls with NetworkFirst strategy
        runtimeCaching: [
          {
            // Backend API — NetworkFirst: try live, fall back to cache
            urlPattern: /^http:\/\/localhost:5000\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'start-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Google Fonts — CacheFirst (fonts rarely change)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],

        // Skip service worker waiting — activate immediately on update
        skipWaiting: true,
        clientsClaim: true,
      },

      // Dev mode: keep SW disabled during development
      devOptions: {
        enabled: false,
      },
    }),
  ],

  build: {
    // Raise warning limit — large bundles expected for this React MERN app
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      output: {
        // Manually split vendor bundles — Vite 8 (Rolldown) requires function form
        manualChunks: (id) => {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/recharts') || id.includes('node_modules/react-is')) {
            return 'vendor-recharts';
          }
        },
      },
    },
  },
});
