// Градієнтні SVG-іконки навігації. Колір — через CSS-змінні (--ic-1/2/3), адаптується до теми.
const ICONS = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" fill="var(--ic-3)" />
      <rect x="14" y="3" width="7" height="11" rx="2" fill="var(--ic-2)" />
      <rect x="3" y="14" width="7" height="7" rx="2" fill="var(--ic-1)" />
      <rect x="14" y="18" width="7" height="3" rx="1.5" fill="var(--ic-3)" />
    </>
  ),
  transactions: (
    <>
      <rect x="2" y="6" width="16" height="10" rx="3" transform="rotate(-10 2 6)" fill="var(--ic-3)" />
      <rect x="6" y="10" width="16" height="10" rx="3" fill="var(--ic-2)" />
      <circle cx="18" cy="15" r="2" fill="var(--ic-accent)" />
    </>
  ),
  charts: (
    <>
      <rect x="3" y="12" width="4" height="9" rx="1.5" fill="var(--ic-1)" />
      <rect x="10" y="7" width="4" height="14" rx="1.5" fill="var(--ic-2)" />
      <rect x="17" y="3" width="4" height="18" rx="1.5" fill="var(--ic-3)" />
    </>
  ),
  ai: (
    <>
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="var(--ic-2)" />
      <circle cx="18.5" cy="5.5" r="1.8" fill="var(--ic-accent)" />
      <circle cx="5" cy="17" r="1.4" fill="var(--ic-3)" />
    </>
  ),
  messages: (
    <>
      <path d="M12 3C8 3 5 5.8 5 9.2c0 1.8.8 3.4 2.1 4.6V18l3-1.6c.6.1 1.2.2 1.9.2 4 0 7-2.8 7-6.2S16 3 12 3Z" fill="var(--ic-2)" />
      <circle cx="9" cy="9" r="1" fill="#fff" />
      <circle cx="12" cy="9" r="1" fill="#fff" />
      <circle cx="15" cy="9" r="1" fill="#fff" />
    </>
  ),
  admin: (
    <>
      <path d="M12 2L4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z" fill="var(--ic-2)" />
      <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  import: (
    <>
      <path d="M12 3v10" stroke="var(--ic-2)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 9l4 4 4-4" stroke="var(--ic-3)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="16" width="16" height="5" rx="2" fill="var(--ic-1)" />
    </>
  ),
  feedback: (
    <>
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" fill="var(--ic-2)" />
      <circle cx="9" cy="10.5" r="1.1" fill="#fff" />
      <circle cx="12" cy="10.5" r="1.1" fill="#fff" />
      <circle cx="15" cy="10.5" r="1.1" fill="#fff" />
    </>
  ),
  game: (
    <>
      <path d="M14.5 4l5 5-9.5 9.5-2.5.8.8-2.5L17.8 4.3a1.2 1.2 0 0 1 1.7 0Z" fill="var(--ic-3)" />
      <path d="M4 14l6 6-2 2-6-6 2-2Z" fill="var(--ic-2)" />
      <circle cx="17" cy="7" r="1.4" fill="var(--ic-accent)" />
    </>
  ),
}

export default function NavIcon({ name, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      {ICONS[name] || null}
    </svg>
  )
}