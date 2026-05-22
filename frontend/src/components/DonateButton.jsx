import { useState } from 'react'
import { useIsMobile } from '../hooks/useResponsive.js'

const MONO_URL = 'https://send.monobank.ua/jar/93HaeWmhhg'

export default function DonateButton() {
  const [hovered, setHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const isMobile = useIsMobile()

  return (
    <>
      {showTooltip && (
        <div style={{ ...s.tooltip, bottom: isMobile ? 138 : 72 }}>
          ☕ Підтримати розробника
          <div style={s.tooltipArrow} />
        </div>
      )}

      <a
        href={MONO_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...s.btn,
          bottom: isMobile ? 72 : 24,
          ...(hovered ? s.btnHover : {}),
        }}
        onMouseEnter={() => { setHovered(true); setShowTooltip(true) }}
        onMouseLeave={() => { setHovered(false); setShowTooltip(false) }}
        title="Підтримати на каву ☕"
      >
        <span style={s.icon}>☕</span>
        <span style={{ ...s.label, maxWidth: hovered ? 120 : 0 }}>
          На каву
        </span>
      </a>
    </>
  )
}

const s = {
  btn: {
    position: 'fixed',
    right: 24,
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    background: 'linear-gradient(135deg, #1A1F71, #2B3DE0)',
    color: '#fff',
    borderRadius: 50,
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(43,61,224,0.4)',
    transition: 'all 0.25s ease',
    border: '1.5px solid rgba(255,255,255,0.15)',
    cursor: 'pointer',
  },
  btnHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 28px rgba(43,61,224,0.55)',
  },
  icon: {
    fontSize: 20,
    lineHeight: 1,
    flexShrink: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'max-width 0.25s ease',
    letterSpacing: 0.2,
  },
  tooltip: {
    position: 'fixed',
    right: 24,
    zIndex: 9997,
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 12,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -5,
    right: 20,
    width: 10,
    height: 10,
    background: 'rgba(0,0,0,0.8)',
    transform: 'rotate(45deg)',
  },
}