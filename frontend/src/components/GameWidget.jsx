import { useState, useEffect } from 'react'
import api from '../api/index.js'

export default function GameWidget({ onNavigate }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/game').then(res => setData(res.data)).catch(() => {})
  }, [])

  if (!data) return null

  const { xp, level, streak } = data

  return (
    <div onClick={() => onNavigate('game')} style={s.widget}>
      <div style={s.top}>
        <span style={s.icon}>{level.icon}</span>
        <div style={s.info}>
          <div style={s.levelText}>Рівень {level.level} — {level.title}</div>
          <div style={s.xpText}>{xp} XP</div>
        </div>
        {streak > 0 && (
          <div style={s.streak}>
            {streak >= 7 ? '🔥🔥' : '🔥'} {streak}
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
  barFill: { height: '100%', background: '#fff', borderRadius: 2, transition: 'width 0.4s ease' },
}