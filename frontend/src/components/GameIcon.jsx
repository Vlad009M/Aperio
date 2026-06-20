// Градієнтні SVG-іконки гейміфікації (рівні, ачівки). Колір через --ic-* + власні градієнти.
const ICONS = {
  level1: ( // Новачок — паросток
    <>
      <path d="M12 21v-7" stroke="#40C057" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 14c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z" fill="#69DB7C" />
      <path d="M12 16c0-2.5-2-4.5-5-4.5 0 2.5 2 4.5 5 4.5Z" fill="#40C057" />
    </>
  ),
  level2: ( // Економ — лампочка
    <>
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.4.3.6.7.6 1.1v.5h5.8v-.5c0-.4.2-.8.6-1.1A6 6 0 0 0 12 3Z" fill="#FFD43B" />
      <rect x="9.5" y="17" width="5" height="2" rx="1" fill="#F59F00" />
      <rect x="10.5" y="20" width="3" height="1.6" rx="0.8" fill="#E8A100" />
    </>
  ),
  level3: ( // Розважливий — мозок
    <>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 8 18a2.5 2.5 0 0 0 4 0V5.5A2 2 0 0 0 9 4Z" fill="#DA77F2" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3 3 0 0 1 16 18a2.5 2.5 0 0 1-4 0V5.5A2 2 0 0 1 15 4Z" fill="#BE4BDB" />
    </>
  ),
  level4: ( // Планувальник — список
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" fill="#748FFC" />
      <rect x="8" y="7" width="8" height="1.8" rx="0.9" fill="#fff" />
      <rect x="8" y="11" width="8" height="1.8" rx="0.9" fill="#fff" />
      <rect x="8" y="15" width="5" height="1.8" rx="0.9" fill="#fff" />
    </>
  ),
  level5: ( // Стратег — шахова фігура
    <>
      <path d="M9 21h6l-.5-4h-5L9 21Z" fill="#4DABF7" />
      <path d="M8 17h8l-1-3H9l-1 3Z" fill="#74C0FC" />
      <circle cx="12" cy="8" r="3.5" fill="#1971C2" />
      <rect x="10.5" y="10" width="3" height="4" fill="#1971C2" />
    </>
  ),
  level6: ( // Фінансист — портфель
    <>
      <rect x="3" y="8" width="18" height="12" rx="2.5" fill="#5C7CFA" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#3B5BDB" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="3" y="12" width="18" height="2" fill="#3B5BDB" opacity="0.5" />
    </>
  ),
  level7: ( // Інвестор — графік зростання
    <>
      <path d="M4 17l5-5 3 3 7-7" stroke="#40C057" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 8h5v5" stroke="#40C057" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="7" r="1.6" fill="#FCC419" />
    </>
  ),
  level8: ( // Мудрець — сова
    <>
      <circle cx="12" cy="13" r="8" fill="#9775FA" />
      <circle cx="9" cy="11" r="2.4" fill="#fff" />
      <circle cx="15" cy="11" r="2.4" fill="#fff" />
      <circle cx="9" cy="11" r="1.1" fill="#1a1a2e" />
      <circle cx="15" cy="11" r="1.1" fill="#1a1a2e" />
      <path d="M12 13.5l-1.5 2h3L12 13.5Z" fill="#F59F00" />
      <path d="M6 5l2.5 3M18 5l-2.5 3" stroke="#7048E8" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  level9: ( // Майстер — кубок
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" fill="#FFD43B" />
      <path d="M17 5h2.5a2 2 0 0 1 0 4H17M7 5H4.5a2 2 0 0 0 0 4H7" stroke="#F59F00" strokeWidth="1.6" fill="none" />
      <rect x="10.5" y="13" width="3" height="4" fill="#F59F00" />
      <rect x="8" y="19" width="8" height="2" rx="1" fill="#E8A100" />
    </>
  ),
  level10: ( // Гуру — корона
    <>
      <path d="M4 8l3 4 5-6 5 6 3-4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" fill="#FCC419" />
      <circle cx="4" cy="8" r="1.4" fill="#F59F00" />
      <circle cx="20" cy="8" r="1.4" fill="#F59F00" />
      <circle cx="12" cy="6" r="1.4" fill="#F59F00" />
      <rect x="4" y="17" width="16" height="2" fill="#E8A100" />
    </>
  ),
}

export default function GameIcon({ name, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      {ICONS[name] || null}
    </svg>
  )
}