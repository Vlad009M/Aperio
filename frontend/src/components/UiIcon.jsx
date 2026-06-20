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
}

export default function UiIcon({ name, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      {ICONS[name] || null}
    </svg>
  )
}