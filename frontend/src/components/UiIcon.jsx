// Інтерфейсні градієнтні SVG-іконки (не навігація). Колір через --ic-* змінні.
const ICONS = {
  bug: (
    <>
      <ellipse cx="12" cy="13" rx="5" ry="6" fill="var(--ic-2)" />
      <path d="M12 7V4M9 5l-1.5-1.5M15 5l1.5-1.5" stroke="var(--ic-3)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 11H4M7 14H3.5M7 17l-2.5 1.5M17 11h3M17 14h3.5M17 17l2.5 1.5" stroke="var(--ic-1)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="11" r="1" fill="#fff" />
      <circle cx="14" cy="11" r="1" fill="#fff" />
    </>
  ),
  idea: (
    <>
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.4.3.6.7.6 1.1v.5h5.8v-.5c0-.4.2-.8.6-1.1A6 6 0 0 0 12 3Z" fill="var(--ic-2)" />
      <rect x="9.5" y="17" width="5" height="2" rx="1" fill="var(--ic-3)" />
      <rect x="10.5" y="20" width="3" height="1.6" rx="0.8" fill="var(--ic-1)" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" fill="var(--ic-2)" />
      <path d="M9.2 9.3a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 2-2.6 3.4" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.1" fill="#fff" />
    </>
  ),
  ai: (
    <>
      <rect x="5" y="7" width="14" height="11" rx="3.5" fill="var(--ic-2)" />
      <circle cx="9.5" cy="12.5" r="1.4" fill="#fff" />
      <circle cx="14.5" cy="12.5" r="1.4" fill="#fff" />
      <path d="M12 4v3M9 18v2M15 18v2" stroke="var(--ic-3)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="3.5" r="1.3" fill="var(--ic-accent)" />
      <path d="M3.5 11v3M20.5 11v3" stroke="var(--ic-1)" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  chart: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V4M4 20h16" />
      <rect x="7" y="12" width="3" height="5" rx="0.5" />
      <rect x="12" y="8" width="3" height="9" rx="0.5" />
      <rect x="17" y="5" width="3" height="12" rx="0.5" />
    </g>
  ),
  alert: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4L2.5 20h19L12 4Z" />
      <path d="M12 10v4M12 17.5v.01" />
    </g>
  ),
  bulb: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 21h4" />
      <path d="M8.5 14a5.5 5.5 0 1 1 7 0c-.7.6-1 1.2-1 2H9.5c0-.8-.3-1.4-1-2Z" />
    </g>
  ),
  target: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </g>
  ),
  coffee: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Z" />
      <path d="M16 10h2.2a2.3 2.3 0 0 1 0 4.6H16" />
      <path d="M7 5.5c.4-.6.4-1 0-1.6M11 5.5c.4-.6.4-1 0-1.6" />
    </g>
  ),
}

export default function UiIcon({ name, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      {ICONS[name] || null}
    </svg>
  )
}