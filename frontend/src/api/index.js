import axios from 'axios'
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const isCapacitor = Capacitor.isNativePlatform()
// Tauri (desktop) інжектить __TAURI_INTERNALS__ у window — так розпізнаємо desktop-застосунок
const isTauri = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__
// Будь-який нативний застосунок (телефон або desktop) — на відміну від веб-браузера
export const isNative = isCapacitor || isTauri

// Зберігання токена різне: Capacitor → Preferences (нативне сховище),
// Tauri/desktop → localStorage (ізольований per-app у webview)
async function getToken() {
  if (isCapacitor) { const { value } = await Preferences.get({ key: 'auth_token' }); return value }
  if (isTauri) return localStorage.getItem('auth_token')
  return null
}
async function setToken(value) {
  if (isCapacitor) return Preferences.set({ key: 'auth_token', value })
  if (isTauri) localStorage.setItem('auth_token', value)
}
async function removeToken() {
  if (isCapacitor) return Preferences.remove({ key: 'auth_token' })
  if (isTauri) localStorage.removeItem('auth_token')
}

// Адреса бекенду:
// - застосунок (Capacitor) → завжди прямий бойовий/staging API
// - веб → бере VITE_API_URL (як було), фолбек на localhost для локалки
const NATIVE_API_URL = 'https://aperio-staging.onrender.com/api'
const baseURL = isNative
  ? NATIVE_API_URL
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api')

const api = axios.create({
  baseURL,
  withCredentials: true,
})

// На КОЖЕН запит у застосунку додаємо Bearer-токен і позначку клієнта.
// На вебі цей блок не робить нічого (isNative === false).
api.interceptors.request.use(async (config) => {
 if (isNative) {
    config.headers['X-Client'] = 'capacitor'
    if (import.meta.env.VITE_APP_CLIENT_SECRET) config.headers['X-Client-Secret'] = import.meta.env.VITE_APP_CLIENT_SECRET
    const value = await getToken()
    if (value) config.headers['Authorization'] = `Bearer ${value}`
  }
  return config
})

api.interceptors.response.use(
  async (response) => {
    // Застосунок: якщо бекенд повернув токен (логін/реєстрація) — зберігаємо його.
   if (isNative && response.data?.token) {
      await setToken(response.data.token)
    }
    // Застосунок: на логауті — стираємо токен.
    if (isNative && response.config?.url?.includes('/auth/logout')) {
      await removeToken()
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      // Публічні сторінки — не виганяємо неавторизованих на login.
      const PUBLIC_PATHS = ['/login', '/register', '/download', '/privacy', '/terms', '/about']
      if (error.config?.url?.includes('/auth/me') &&
          !PUBLIC_PATHS.includes(currentPath)) {
        localStorage.removeItem('user')
        if (isNative) removeToken()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api