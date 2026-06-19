import { useState, useEffect } from 'react'

// Автовизначення платформи за userAgent
function detectPlatform() {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent || ''
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/windows|macintosh|linux/i.test(ua)) return 'desktop'
  return 'other'
}

export default function Download() {
  const [platform, setPlatform] = useState('other')

  useEffect(() => {
    setPlatform(detectPlatform())
  }, [])

  // Коли застосунок зʼявиться в сторах — підставити реальні посилання сюди.
  const ANDROID_URL = null // напр. 'https://play.google.com/store/apps/details?id=ua.pp.aperio.app'
  const IOS_URL = null     // напр. 'https://apps.apple.com/app/aperio/idXXXXXXXX'

  const platforms = [
    {
      key: 'android',
      icon: '🤖',
      title: 'Android',
      desc: 'Нативний застосунок для телефонів і планшетів на Android.',
      url: ANDROID_URL,
      ctaReady: 'Завантажити з Google Play',
      ctaSoon: 'Незабаром у Google Play',
    },
    {
      key: 'ios',
      icon: '🍎',
      title: 'iOS',
      desc: 'Застосунок для iPhone та iPad.',
      url: IOS_URL,
      ctaReady: 'Завантажити з App Store',
      ctaSoon: 'Незабаром в App Store',
    },
    {
      key: 'web',
      icon: '🌐',
      title: 'Веб-версія',
      desc: 'Повноцінний доступ із будь-якого браузера. Можна встановити як PWA.',
      url: '/login',
      ctaReady: 'Відкрити у браузері',
      ctaSoon: null,
    },
  ]

  // Сортуємо так, щоб картка платформи користувача була першою
  const ordered = [...platforms].sort((a, b) => {
    const match = platform === 'desktop' || platform === 'other' ? 'web' : platform
    if (a.key === match) return -1
    if (b.key === match) return 1
    return 0
  })

  const recommended = platform === 'desktop' || platform === 'other' ? 'web' : platform

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Hero */}
        <div style={s.hero}>
          <img src="/Aperio.png" alt="Aperio" style={s.logo} />
          <h1 style={s.title}>Завантажити Aperio</h1>
          <p style={s.subtitle}>Розумний фінансовий трекер — на будь-якому пристрої</p>
        </div>

        {/* Платформи */}
        <div style={s.grid}>
          {ordered.map((p) => {
            const isRecommended = p.key === recommended
            const available = !!p.url
            return (
              <div
                key={p.key}
                style={{
                  ...s.card,
                  ...(isRecommended ? s.cardActive : {}),
                }}
              >
                {isRecommended && <div style={s.badge}>Для вашого пристрою</div>}
                <div style={s.cardIcon}>{p.icon}</div>
                <div style={s.cardTitle}>{p.title}</div>
                <div style={s.cardDesc}>{p.desc}</div>
                {available ? (
                  <a
                    href={p.url}
                    style={{ ...s.btn, ...(isRecommended ? s.btnPrimary : s.btnSecondary) }}
                  >
                    {p.ctaReady}
                  </a>
                ) : (
                  <div style={s.btnDisabled}>{p.ctaSoon}</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Підказка */}
        <div style={s.note}>
          Застосунки для Android та iOS зараз готуються до публікації. Поки що користуйтеся
          веб-версією — вона має всі ті самі можливості й працює офлайн як PWA.
        </div>

        {/* Назад */}
        <div style={s.backRow}>
          <a href="/" style={s.backLink}>← На головну</a>
        </div>

      </div>
    </div>
  )
}

const s = {
  page: { background: 'var(--color-background-tertiary)', minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: 760, margin: '0 auto' },
  hero: { textAlign: 'center', marginBottom: 32, padding: '40px 20px', background: 'var(--color-background-primary)', borderRadius: 16, border: '0.5px solid var(--color-border-tertiary)' },
  logo: { width: 72, height: 72, borderRadius: 16, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'var(--color-text-secondary)', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 },
  card: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--color-background-primary)', borderRadius: 16, padding: '28px 20px', border: '0.5px solid var(--color-border-tertiary)' },
  cardActive: { border: '1.5px solid #7F77DD', boxShadow: '0 4px 24px rgba(127,119,221,0.15)' },
  badge: { position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #534AB7, #7F77DD)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap' },
  cardIcon: { fontSize: 40, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: 'var(--color-text-tertiary)', lineHeight: 1.6, marginBottom: 20, flexGrow: 1 },
  btn: { display: 'inline-block', width: '100%', boxSizing: 'border-box', padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center' },
  btnPrimary: { background: 'linear-gradient(135deg, #7F77DD, #534AB7)', color: '#fff' },
  btnSecondary: { background: 'var(--color-background-tertiary)', color: 'var(--color-text-primary)', border: '0.5px solid var(--color-border-tertiary)' },
  btnDisabled: { width: '100%', boxSizing: 'border-box', padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, textAlign: 'center', background: 'var(--color-background-tertiary)', color: 'var(--color-text-tertiary)', cursor: 'not-allowed' },
  note: { background: 'var(--color-background-primary)', borderRadius: 12, padding: '16px 20px', border: '0.5px solid var(--color-border-tertiary)', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, textAlign: 'center', marginBottom: 24 },
  backRow: { textAlign: 'center', paddingBottom: 20 },
  backLink: { fontSize: 14, color: 'var(--color-text-tertiary)', textDecoration: 'none' },
}