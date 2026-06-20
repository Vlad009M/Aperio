// SVG-іконки ачівок. Мапа code → іконка. Кольорові, у стилі застосунку.
const ICONS = {
  // ── Транзакції ──
  first_tx: (
    <>
      <circle cx="12" cy="12" r="9" fill="#A78BFA" />
      <path d="M12 7v10M8.5 10.5L12 7l3.5 3.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  tx_10: (
    <>
      <rect x="4" y="13" width="4" height="7" rx="1" fill="#B197FC" />
      <rect x="10" y="9" width="4" height="11" rx="1" fill="#9775FA" />
      <rect x="16" y="5" width="4" height="15" rx="1" fill="#7048E8" />
    </>
  ),
  tx_25: (
    <>
      <rect x="4" y="13" width="4" height="7" rx="1" fill="#74C0FC" />
      <rect x="10" y="9" width="4" height="11" rx="1" fill="#4DABF7" />
      <rect x="16" y="5" width="4" height="15" rx="1" fill="#1971C2" />
      <circle cx="18" cy="4" r="2" fill="#FCC419" />
    </>
  ),
  tx_50: (
    <>
      <circle cx="12" cy="12" r="9" fill="#4DABF7" />
      <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="#1971C2" strokeWidth="1.5" fill="none" />
    </>
  ),
  tx_100: (
    <>
      <path d="M12 2l2.4 5 5.6.6-4 4 1 5.4L12 19l-5 3 1-5.4-4-4 5.6-.6L12 2Z" fill="#FFD43B" stroke="#F59F00" strokeWidth="1" strokeLinejoin="round" />
    </>
  ),
  tx_250: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#9775FA" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  tx_500: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" fill="#FFD43B" />
      <path d="M17 5h2.5a2 2 0 0 1 0 4H17M7 5H4.5a2 2 0 0 0 0 4H7" stroke="#F59F00" strokeWidth="1.5" fill="none" />
      <rect x="10.5" y="13" width="3" height="4" fill="#F59F00" />
      <rect x="8" y="19" width="8" height="2" rx="1" fill="#E8A100" />
    </>
  ),
  tx_1000: (
    <>
      <path d="M12 2l2.8 6.5L22 9l-5 4.8L18.5 21 12 17.3 5.5 21 7 13.8 2 9l7.2-.5L12 2Z" fill="#C4B5FD" stroke="#7048E8" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.5" fill="#fff" />
    </>
  ),
  // ── Streak ──
  streak_3: (
    <path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3.5C8 9 7 11 7 13a5 5 0 0 0 10 0c0-4-3-6-5-10Z" fill="#FF922B" />
  ),
  streak_7: (
    <>
      <path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3.5C8 9 7 11 7 13a5 5 0 0 0 10 0c0-4-3-6-5-10Z" fill="#FF6B1A" />
      <path d="M12 9c.5 1.5 2 2 2 4a2 2 0 0 1-4 0c0-.8.3-1.3.7-1.8C10 12 11 13 12 9Z" fill="#FFD43B" />
    </>
  ),
  streak_14: (
    <>
      <path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3.5C8 9 7 11 7 13a5 5 0 0 0 10 0c0-4-3-6-5-10Z" fill="#FA5252" />
      <path d="M12 9c.5 1.5 2 2 2 4a2 2 0 0 1-4 0c0-.8.3-1.3.7-1.8C10 12 11 13 12 9Z" fill="#FFE066" />
    </>
  ),
  streak_30: (
    <>
      <path d="M12 2c1.2 3.5 4.5 5 4.5 9a4.5 4.5 0 0 1-9 0c0-1.8.6-3 1.2-4C7.5 9 6.5 11.5 6.5 14a5.5 5.5 0 0 0 11 0c0-4.5-3.5-7-5.5-12Z" fill="#E03131" />
      <path d="M12 9c.6 1.8 2.2 2.2 2.2 4.4a2.2 2.2 0 0 1-4.4 0c0-.9.3-1.5.8-2C10.3 12.5 11 13.5 12 9Z" fill="#FFD43B" />
    </>
  ),
  streak_60: (
    <>
      <path d="M12 2c1.2 3.5 4.5 5 4.5 9a4.5 4.5 0 0 1-9 0c0-1.8.6-3 1.2-4C7.5 9 6.5 11.5 6.5 14a5.5 5.5 0 0 0 11 0c0-4.5-3.5-7-5.5-12Z" fill="#D6336C" />
      <path d="M12 9c.6 1.8 2.2 2.2 2.2 4.4a2.2 2.2 0 0 1-4.4 0c0-.9.3-1.5.8-2C10.3 12.5 11 13.5 12 9Z" fill="#FFE066" />
    </>
  ),
  streak_100: (
    <>
      <path d="M12 2c1.2 3.5 4.5 5 4.5 9a4.5 4.5 0 0 1-9 0c0-1.8.6-3 1.2-4C7.5 9 6.5 11.5 6.5 14a5.5 5.5 0 0 0 11 0c0-4.5-3.5-7-5.5-12Z" fill="#9C36B5" />
      <path d="M12 9c.6 1.8 2.2 2.2 2.2 4.4a2.2 2.2 0 0 1-4.4 0c0-.9.3-1.5.8-2C10.3 12.5 11 13.5 12 9Z" fill="#FFD43B" />
      <circle cx="18" cy="5" r="1.6" fill="#FCC419" />
    </>
  ),
  // ── Заощадження ──
  saved_20: (
    <>
      <ellipse cx="12" cy="13" rx="8" ry="6.5" fill="#69DB7C" />
      <circle cx="15.5" cy="11.5" r="1" fill="#2B8A3E" />
      <path d="M7 8.5C7 6.5 9 5.5 11 6" stroke="#40C057" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="10" y="4.5" width="4" height="2.5" rx="1.2" fill="#40C057" />
      <rect x="8" y="18.5" width="2" height="2.5" rx="0.5" fill="#2B8A3E" />
      <rect x="14" y="18.5" width="2" height="2.5" rx="0.5" fill="#2B8A3E" />
    </>
  ),
  saved_30: (
    <>
      <ellipse cx="12" cy="13" rx="8" ry="6.5" fill="#38D9A9" />
      <circle cx="15.5" cy="11.5" r="1" fill="#099268" />
      <rect x="10" y="4.5" width="4" height="2.5" rx="1.2" fill="#0CA678" />
      <path d="M11 13l1.2 1.2L15 11.5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  saved_40: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2" fill="#20C997" />
      <path d="M4 8l8-5 8 5" stroke="#099268" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="2.5" fill="#fff" />
      <rect x="11.2" y="13" width="1.6" height="2.5" fill="#099268" />
    </>
  ),
  saved_50: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2" fill="#FFD43B" />
      <path d="M4 8l8-5 8 5" stroke="#F59F00" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="3" fill="#fff" />
      <path d="M12 12.5v3M11 13.5h1.5a1 1 0 0 1 0 2H11" stroke="#F59F00" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </>
  ),
  // ── Рівні ──
  level_3: (
    <>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 8 18a2.5 2.5 0 0 0 4 0V5.5A2 2 0 0 0 9 4Z" fill="#DA77F2" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3 3 0 0 1 16 18a2.5 2.5 0 0 1-4 0V5.5A2 2 0 0 1 15 4Z" fill="#BE4BDB" />
    </>
  ),
  level_5: (
    <>
      <path d="M12 2l2.4 5 5.6.6-4 4 1 5.4L12 19l-5 3 1-5.4-4-4 5.6-.6L12 2Z" fill="#9775FA" stroke="#7048E8" strokeWidth="1" strokeLinejoin="round" />
    </>
  ),
  level_7: (
    <>
      <path d="M4 17l5-5 3 3 7-7" stroke="#40C057" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 8h5v5" stroke="#40C057" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="7" r="1.6" fill="#FCC419" />
    </>
  ),
  level_10: (
    <>
      <path d="M4 8l3 4 5-6 5 6 3-4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" fill="#FCC419" />
      <circle cx="12" cy="6" r="1.4" fill="#F59F00" />
      <rect x="4" y="17" width="16" height="2" fill="#E8A100" />
    </>
  ),
  // ── Категорії ──
  cat_5: (
    <>
      <circle cx="9" cy="9" r="4" fill="#FF6B6B" />
      <circle cx="15" cy="9" r="4" fill="#4DABF7" opacity="0.85" />
      <circle cx="12" cy="14" r="4" fill="#40C057" opacity="0.85" />
    </>
  ),
  cat_10: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="2" fill="#FF6B6B" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="#4DABF7" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="#40C057" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="#FFD43B" />
    </>
  ),
  cat_all: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6 1.5 1.5 0 0 1 0-3h2a4 4 0 0 0 4-4c0-3.3-2.7-5-6-5Z" fill="#9775FA" />
      <circle cx="8" cy="9" r="1.3" fill="#FF6B6B" />
      <circle cx="12" cy="7" r="1.3" fill="#FCC419" />
      <circle cx="16" cy="9" r="1.3" fill="#4DABF7" />
    </>
  ),
  // ── Особливі ──
  income_first: (
    <>
      <circle cx="12" cy="12" r="9" fill="#69DB7C" />
      <path d="M12 16V8M9 11l3-3 3 3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  transfer_first: (
    <>
      <circle cx="12" cy="12" r="9" fill="#748FFC" />
      <path d="M8 10h7l-2-2M16 14H9l2 2" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  expense_tracked: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" fill="#B197FC" />
      <path d="M9 7h6M9 11h6M9 15h4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  big_expense: (
    <>
      <circle cx="12" cy="12" r="9" fill="#FF8787" />
      <path d="M12 7v10M9 14l3 3 3-3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  big_income: (
    <>
      <circle cx="12" cy="12" r="9" fill="#51CF66" />
      <path d="M12 7v3M12 14v3M9.5 9.5a2 2 0 0 1 2-1.5h1a1.8 1.8 0 0 1 0 3.6h-1a1.8 1.8 0 0 0 0 3.6h1a2 2 0 0 0 2-1.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  no_fun_week: (
    <>
      <circle cx="12" cy="12" r="9" fill="#9775FA" />
      <path d="M9 9.5a1.5 1.5 0 0 1 3 0M12 9.5a1.5 1.5 0 0 1 3 0M9 14c1.5 1.5 4.5 1.5 6 0" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
  no_fun_month: (
    <>
      <circle cx="12" cy="12" r="9" fill="#7048E8" />
      <path d="M9 9.5a1.5 1.5 0 0 1 3 0M12 9.5a1.5 1.5 0 0 1 3 0M9 14c1.5 1.5 4.5 1.5 6 0" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="6" r="1.6" fill="#FCC419" />
    </>
  ),
  health_beats_fun: (
    <>
      <path d="M12 20s-7-4.5-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.5 12 20 12 20Z" fill="#FF8787" />
      <path d="M8 12h2l1-2 1.5 3 1-1.5h2" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  challenge_done: (
    <>
      <circle cx="12" cy="12" r="8" fill="#FCC419" />
      <circle cx="12" cy="12" r="4.5" fill="#fff" />
      <circle cx="12" cy="12" r="2" fill="#F59F00" />
    </>
  ),
  income_month: (
    <>
      <path d="M4 17l5-5 3 3 7-7" stroke="#40C057" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 8h5v5" stroke="#40C057" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  saved_first: (
    <>
      <ellipse cx="12" cy="13" rx="8" ry="6.5" fill="#69DB7C" />
      <rect x="10" y="4.5" width="4" height="2.5" rx="1.2" fill="#40C057" />
    </>
  ),
}

export default function AchIcon({ code, size = 32 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      {ICONS[code] || (
        <circle cx="12" cy="12" r="8" fill="var(--color-text-tertiary)" opacity="0.4" />
      )}
    </svg>
  )
}