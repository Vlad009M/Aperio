import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// PWA вимикаємо для нативних застосунків (Tauri/Capacitor):
// Service Worker кешує старий фронт і перехоплює API-запити, ламаючи застосунок.
// Веб-білд (bun run build) лишається з PWA; нативний (NATIVE_BUILD=true) — без.
const isNativeBuild = process.env.NATIVE_BUILD === 'true'

export default defineConfig({
  plugins: [
    react(),
    ...(isNativeBuild ? [] : [
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: false },
        includeAssets: ['Aperio.png', 'favicon.svg'],
        manifest: {
          name: 'Aperio — Фінансовий трекер',
          short_name: 'Aperio',
          description: 'Розумний фінансовий трекер з AI аналізом',
          theme_color: '#7c6af7',
          background_color: '#f2f2f5',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          lang: 'uk',
          icons: [
            { src: 'Aperio.png', sizes: '192x192', type: 'image/png' },
            { src: 'Aperio.png', sizes: '512x512', type: 'image/png' },
            { src: 'Aperio.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
          globIgnores: ['**/Aperio.png'],
          runtimeCaching: [
            {
              urlPattern: /^\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: { maxEntries: 50, maxAgeSeconds: 300 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ]),
  ],
})
