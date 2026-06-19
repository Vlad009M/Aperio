import { useState, useEffect, useRef, useCallback } from 'react'
import { App as CapApp } from '@capacitor/app'
import { isNative, isLockEnabled, authenticate } from '../lib/biometric.js'

// Через скільки секунд у фоні знову вимагати розблокування
const RELOCK_AFTER_MS = 30 * 1000

export default function BiometricGate({ children }) {
  // locked === null  → ще не визначилися (показуємо нейтральний екран)
  // locked === true  → треба розблокувати
  // locked === false → відкрито
  const [locked, setLocked] = useState(null)
  const [authing, setAuthing] = useState(false)
  const backgroundedAt = useRef(null)

  const tryUnlock = useCallback(async () => {
    setAuthing(true)
    const ok = await authenticate()
    setAuthing(false)
    if (ok) setLocked(false)
  }, [])

  // Первинна перевірка при старті
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!isNative()) { setLocked(false); return }
      const enabled = await isLockEnabled()
      if (cancelled) return
      if (!enabled) { setLocked(false); return }
      setLocked(true)
      tryUnlock()
    })()
    return () => { cancelled = true }
  }, [tryUnlock])

  // Реакція на згортання/повернення застосунку
  useEffect(() => {
    if (!isNative()) return
    let sub
    ;(async () => {
      sub = await CapApp.addListener('appStateChange', async ({ isActive }) => {
        if (!isActive) {
          backgroundedAt.current = Date.now()
        } else {
          const enabled = await isLockEnabled()
          if (!enabled) return
          const away = backgroundedAt.current ? Date.now() - backgroundedAt.current : 0
          if (away >= RELOCK_AFTER_MS) {
            setLocked(true)
            tryUnlock()
          }
        }
      })
    })()
    return () => { if (sub) sub.remove() }
  }, [tryUnlock])

  if (locked === null) {
    return <div style={st.screen} />
  }

  if (locked) {
    return (
      <div style={st.screen}>
        <div style={st.card}>
          <img src="/Aperio.png" alt="Aperio" style={st.logo} />
          <div style={st.title}>Aperio заблоковано</div>
          <div style={st.subtitle}>Підтвердіть особу, щоб продовжити</div>
          <button onClick={tryUnlock} disabled={authing} style={st.btn}>
            <i className="ti ti-fingerprint" style={{ fontSize: 18 }} />
            {authing ? 'Очікування...' : 'Розблокувати'}
          </button>
        </div>
      </div>
    )
  }

  return children
}

const st = {
  screen: { position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #7F77DD, #4A3FA0)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 },
  card: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px' },
  logo: { width: 72, height: 72, borderRadius: 18, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 28 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#fff', color: '#534AB7', border: 'none', borderRadius: 24, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
}