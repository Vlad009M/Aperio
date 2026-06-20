import { useState, useEffect } from 'react'

// Автовизначення платформи за userAgent
function detectPlatform() {
  if (typeof navigator === 'undefined') return 'web'
  const ua = navigator.userAgent || ''
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/macintosh|mac os x/i.test(ua)) return 'macos'
  if (/windows/i.test(ua)) return 'windows'
  if (/linux/i.test(ua)) return 'linux'
  return 'web'
}

export default function Download() {
  const [platform, setPlatform] = useState('web')

  useEffect(() => {
    setPlatform(detectPlatform())
  }, [])

  // Коли збірки зʼявляться — підставити реальні посилання сюди (null = заглушка «Незабаром»).
  const LINKS = {
    android: null, // 'https://play.google.com/store/apps/details?id=ua.pp.aperio.app'
    ios: null,     // 'https://apps.apple.com/app/aperio/idXXXXXXXX'
    windows: null, // '/downloads/Aperio-Setup.exe'
    macos: null,   // '/downloads/Aperio.dmg'
    linux: null,   // '/downloads/Aperio.AppImage'
    web: '/login',
  }

  const platforms = [
    { key: 'android', icon: '🤖', title: 'Android', desc: 'Для телефонів і планшетів на Android.', ctaReady: 'Завантажити з Google Play', ctaSoon: 'Незабаром у Google Play' },
    { key: 'ios',     icon: '🍎', title: 'iOS',     desc: 'Для iPhone та iPad.',                    ctaReady: 'Завантажити з App Store',   ctaSoon: 'Незабаром в App Store' },
    { key: 'windows', icon: '🪟', title: 'Windows', desc: 'Десктопний застосунок для Windows 10/11.', ctaReady: 'Завантажити для Windows', ctaSoon: 'Незабаром для Windows' },
    { key: 'macos',   icon: '🖥️', title: 'macOS',   desc: 'Десктопний застосунок для Mac.',          ctaReady: 'Завантажити для macOS',   ctaSoon: 'Незабаром для macOS' },
    { key: 'linux',   icon: '🐧', title: 'Linux',   desc: 'AppImage для більшості дистрибутивів.',   ctaReady: 'Завантажити для Linux',   ctaSoon: 'Незабаром для Linux' },
    { key: 'web',     icon: '🌐', title: 'Веб-версія', desc: 'Доступ із будь-го браузера. Можна встановити як PWA.', ctaReady: 'Відкрити у браузері', ctaSoon: null },
  ]

  // Платформа користувача — нагору
  const recommended = platform
  const ordered = [...platforms].sort((a, b) => {
    if (a.key === recommended) return -1
    if (b.key === recommended) return 1
    return 0
  })

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
            const url = LINKS[p.key]
            const available = !!url
            return (
              <div key={p.key} style={{ ...s.card, ...(isRecommended ? s.cardActive : {}) }}>
                {isRecommended && <div style={s.badge}>Для вашого пристрою</div>}
                <div style={s.cardIcon}>{p.icon}</div>
                <div style={s.cardTitle}>{p.title}</div>
                <div style={s.cardDesc}>{p.desc}</div>
                {available ? (
                  <a href={url} style={{ ...s.btn, ...(isRecommended ? s.btnPrimary : s.btnSecondary) }}>
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
          Застосунки для Android, iOS та десктопу зараз готуються до публікації. Поки що
          користуйтеся веб-версією — вона має всі ті самі можливості й працює офлайн як PWA.
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
  page: { boxSizing: 'border-box', background: 'var(--color-background-tertiary)', minHeight: '100vh', padding: '40px 20px', overflowX: 'hidden' },
  container: { boxSizing: 'border-box', maxWidth: 980, margin: '0 auto', width: '100%' },
  hero: { boxSizing: 'border-box', textAlign: 'center', marginBottom: 32, padding: '40px 20px', background: 'var(--color-background-primary)', borderRadius: 16, border: '0.5px solid var(--color-border-tertiary)' },
  logo: { width: 72, height: 72, borderRadius: 16, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'var(--color-text-secondary)', margin: 0 },
  
  // Оновлена сітка на Flexbox
  grid: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: 16, 
    marginBottom: 24,
    justifyContent: 'center',
    width: '100%'
  },
  
  // Оновлена картка з правильним вираховуванням ширини
  card: { 
    boxSizing: 'border-box', 
    flex: '1 1 280px', // Дозволяє картці рости, але базова ширина 280px
    maxWidth: '100%',  // Запобігає виходу за межі екрана на мобільних
    position: 'relative', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center', 
    background: 'var(--color-background-primary)', 
    borderRadius: 16, 
    padding: '28px 20px', 
    border: '0.5px solid var(--color-border-tertiary)' 
  },
  
  cardActive: { border: '1.5px solid #7F77DD', boxShadow: '0 4px 24px rgba(127,119,221,0.15)' },
  badge: { position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #534AB7, #7F77DD)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap', zIndex: 2 },
  cardIcon: { fontSize: 40, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: 'var(--color-text-tertiary)', lineHeight: 1.6, marginBottom: 20, flexGrow: 1 },
  
  btn: { boxSizing: 'border-box', display: 'inline-block', width: '100%', padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center' },
  btnPrimary: { background: 'linear-gradient(135deg, #7F77DD, #534AB7)', color: '#fff' },
  btnSecondary: { background: 'var(--color-background-tertiary)', color: 'var(--color-text-primary)', border: '0.5px solid var(--color-border-tertiary)' },
  btnDisabled: { boxSizing: 'border-box', width: '100%', padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, textAlign: 'center', background: 'var(--color-background-tertiary)', color: 'var(--color-text-tertiary)', cursor: 'not-allowed' },
  
  note: { boxSizing: 'border-box', background: 'var(--color-background-primary)', borderRadius: 12, padding: '16px 20px', border: '0.5px solid var(--color-border-tertiary)', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, textAlign: 'center', marginBottom: 24, width: '100%' },
  backRow: { textAlign: 'center', paddingBottom: 20 },
  backLink: { fontSize: 14, color: 'var(--color-text-tertiary)', textDecoration: 'none' },
}