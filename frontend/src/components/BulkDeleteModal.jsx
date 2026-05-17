import { useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import api from '../api/index.js'

const PERIODS = [
  { id: 'day',   label: 'За сьогодні',   icon: '📅', desc: 'Видалить всі транзакції за сьогоднішній день' },
  { id: 'week',  label: 'За тиждень',    icon: '🗓️', desc: 'Видалить транзакції за поточний тиждень (пн–нд)' },
  { id: 'month', label: 'За місяць',     icon: '📆', desc: 'Видалить транзакції за поточний місяць' },
  { id: 'year',  label: 'За рік',        icon: '🗃️', desc: 'Видалить всі транзакції за поточний рік' },
  { id: 'all',   label: 'Всі транзакції', icon: '⚠️', desc: 'Видалить ВСІ транзакції без можливості відновлення', danger: true },
]

export default function BulkDeleteModal({ onClose, onSuccess }) {
  const [selected, setSelected] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const period = PERIODS.find(p => p.id === selected)

  const handleDelete = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await api.delete('/transactions/bulk', { data: { period: selected } })
      toast.success(`Видалено ${res.data.deleted} транзакцій`)
      onSuccess()
      onClose()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Помилка видалення')
    }
    setLoading(false)
  }

  return createPortal(
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div style={s.title}>🗑️ Видалення транзакцій</div>
          <button onClick={onClose} style={s.closeBtn}>
            <i className="ti ti-x" style={{ fontSize: 18 }} />
          </button>
        </div>

        {!confirm ? (
          <>
            <div style={s.subtitle}>Оберіть період для видалення</div>
            <div style={s.list}>
              {PERIODS.map(p => (
                <button key={p.id}
                  onClick={() => setSelected(p.id)}
                  style={{ ...s.periodBtn, ...(selected === p.id ? (p.danger ? s.selectedDanger : s.selected) : {}), ...(p.danger ? s.dangerBtn : {}) }}
                >
                  <span style={s.periodIcon}>{p.icon}</span>
                  <div style={s.periodText}>
                    <div style={s.periodLabel}>{p.label}</div>
                    <div style={s.periodDesc}>{p.desc}</div>
                  </div>
                  {selected === p.id && <i className="ti ti-check" style={{ fontSize: 16, color: p.danger ? '#993C1D' : '#534AB7' }} />}
                </button>
              ))}
            </div>

            <div style={s.btns}>
              <button onClick={onClose} style={s.cancelBtn}>Скасувати</button>
              <button
                onClick={() => setConfirm(true)}
                disabled={!selected}
                style={{ ...s.nextBtn, opacity: selected ? 1 : 0.4, background: period?.danger ? '#993C1D' : '#7F77DD' }}
              >
                Далі →
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ ...s.confirmBox, borderColor: period?.danger ? '#F5B8A8' : '#AFA9EC', background: period?.danger ? '#FEF2EE' : '#F5F4FE' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{period?.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: period?.danger ? '#993C1D' : '#534AB7', marginBottom: 6 }}>
                {period?.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {period?.desc}. Це незворотна дія!
              </div>
            </div>

            <div style={s.btns}>
              <button onClick={() => setConfirm(false)} style={s.cancelBtn}>← Назад</button>
              <button
                onClick={handleDelete}
                disabled={loading}
                style={{ ...s.nextBtn, opacity: loading ? 0.7 : 1, background: period?.danger ? '#993C1D' : '#7F77DD' }}
              >
                {loading ? 'Видалення...' : 'Підтвердити видалення'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' },
  modal: { background: 'var(--color-background-primary, #fff)', borderRadius: 16, padding: 28, width: 460, maxWidth: '92vw', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 17, fontWeight: 500, color: 'var(--color-text-primary)' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', display: 'flex', padding: 4, borderRadius: 6 },
  subtitle: { fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 16 },
  list: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 },
  periodBtn: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--color-background-secondary, #fafafa)', border: '0.5px solid var(--color-border-tertiary, #e0e0e0)', borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%' },
  selected: { background: '#EEEDFE', borderColor: '#AFA9EC' },
  selectedDanger: { background: '#FEF2EE', borderColor: '#F5B8A8' },
  dangerBtn: { },
  periodIcon: { fontSize: 20, flexShrink: 0 },
  periodText: { flex: 1 },
  periodLabel: { fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 },
  periodDesc: { fontSize: 11, color: 'var(--color-text-tertiary)' },
  confirmBox: { border: '0.5px solid', borderRadius: 12, padding: '24px 20px', textAlign: 'center', marginBottom: 24 },
  btns: { display: 'flex', gap: 10, justifyContent: 'flex-end' },
  cancelBtn: { padding: '9px 18px', background: 'none', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: 'var(--color-text-secondary)' },
  nextBtn: { padding: '9px 18px', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500 },
}