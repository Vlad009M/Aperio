import { useState, useEffect } from 'react'
import api from '../api/index.js'
import GameIcon from './GameIcon.jsx'

export default function GameWidget({ onNavigate, refreshKey }) {
  const [data, setData] = useState(null)  // ← додай цей рядок
  useEffect(() => {
    api.get('/game').then(res => setData(res.data)).catch(() => {})
  }, [refreshKey])

  if (!data) return null

  const { xp, level, streak } = data

  return (
    <div onClick={() => onNavigate('game')} style={s.widget}>
      <div style={s.top}>
        <span style={s.icon}><GameIcon name={`level${level.level}`} size={20} /></span>
        <div style={s.info}>
          <div style={s.levelText}>Рівень {level.level} — {level.title}</div>
          <div style={s.xpText}>{xp} XP</div>
        </div>
        {streak > 0 && (
          <div style={s.streak}>
            <span style={{ color: '#FF922B', display: 'inline-flex', gap: 1, verticalAlign: 'middle' }}>{Array.from({ length: streak >= 7 ? 2 : 1 }).map((_, i) => <span key={i} className="flame"><GameIcon name="fire" size={14} /></span>)}</span> {streak}
          </div>
        )}
      </div>
      <div style={s.barBg}>
        <div style={{ ...s.barFill, width: `${level.progress}%` }} />
      </div>
    </div>
  )
}

const s = {
  widget: { background: 'linear-gradient(135deg, #534AB7, #7F77DD)', borderRadius: 10, padding: '10px 12px', cursor: 'pointer', marginBottom: 4 },
  top: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  icon: { fontSize: 20, flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  levelText: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  xpText: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  streak: { fontSize: 12, color: '#fff', flexShrink: 0 },
  barBg: { height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', background: 'linear-gradient(90deg, #C4B5FD, #fff)', borderRadius: 2, transition: 'width 0.4s ease', boxShadow: '0 0 6px rgba(255,255,255,0.5)' },
}