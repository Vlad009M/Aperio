import { useState, useEffect } from 'react'

const THEMES = [
  { key: 'dark',  icon: 'ti-moon',     title: 'Темна тема' },
  { key: 'light', icon: 'ti-sun',      title: 'Світла тема' },
  { key: 'magic', icon: 'ti-sparkles', title: 'Magic тема' },
]

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div style={s.wrap}>
      {THEMES.map(t => {
        const active = theme === t.key
        return (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            style={{ ...s.btn, ...(active ? s.btnActive : {}) }}
            title={t.title}
            aria-label={t.title}
          >
            <i className={`ti ${t.icon}`} style={{ fontSize: 18 }} />
          </button>
        )
      })}
    </div>
  )
}

const s = {
  wrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: 14,
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    backdropFilter: 'blur(var(--glass-blur))',
    WebkitBackdropFilter: 'blur(var(--glass-blur))',
  },
  btn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '7px 11px',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-tertiary)',
    transition: 'background 0.2s ease, color 0.2s ease',
  },
  btnActive: {
    background: 'var(--accent-glow)',
    color: 'var(--color-text-primary)',
    boxShadow: '0 0 12px var(--accent-glow)',
  },
}