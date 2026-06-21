// Збірка фронту для нативних застосунків (без PWA/Service Worker).
// Ставить прапорець NATIVE_BUILD і запускає vite build.
process.env.NATIVE_BUILD = 'true'
const { execSync } = require('child_process')
execSync('bunx vite build', { stdio: 'inherit', env: process.env })
