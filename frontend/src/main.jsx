import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import posthog from 'posthog-js'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import * as Sentry from '@sentry/react'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.MODE === 'production',
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  capture_pageview: false,
  capture_pageleave: true,
  loaded: (ph) => {
    window.posthog = ph
  }
})

window.posthog = posthog

function PostHogPageView() {
  const location = useLocation()
  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href })
  }, [location])
  return null
}

const queryClient = new QueryClient()
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Огортаємо все тут */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PostHogPageView />
          <App />
          <Toaster position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
)

// Ховаємо нативний splash-екран, коли застосунок готовий (лише в застосунку)
if (Capacitor.isNativePlatform()) {
  SplashScreen.hide()
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
