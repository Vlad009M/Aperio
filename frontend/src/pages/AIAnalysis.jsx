import { useState, useEffect } from 'react'
import api from '../api/index.js'
import { useIsMobile } from '../hooks/useResponsive.js'
import posthog from 'posthog-js'
import toast from 'react-hot-toast'
import UiIcon from '../components/UiIcon.jsx'

const MONO_URL = 'https://send.monobank.ua/jar/93HaeWmhhg'

export default function AIAnalysis({ emailVerified }) {
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Додаємо стан для лімітів
  const [limits, setLimits] = useState({ tokens: 5, nextRefill: null })
  const isMobile = useIsMobile()

  // Завантажуємо ліміти при відкритті вкладки
  useEffect(() => {
  if (emailVerified) {
    fetchLimits()
  }
}, [])

  const fetchLimits = async () => {
    try {
      const res = await api.get('/ai/limits')
      setLimits(res.data)
    } catch (e) {
      console.error('Помилка завантаження лімітів', e)
    }
  }

  const analyze = async () => {
    if (!emailVerified) {
      setError('Підтвердіть email перед використанням AI аналізу')
      return
    }
    setLoading(true)
    setError('')
    setAnalysis('')
    try {
      const res = await api.post('/ai/analyze')
      setAnalysis(res.data.analysis)
      posthog.capture('ai_analysis_completed')
      fetchLimits() // Оновлюємо ліміти після успішного аналізу
    } catch (e) {
      if (e.response?.data?.error === 'LIMIT_REACHED') {
        setError('У вас закінчилися безкоштовні запити. Поповніть ліміт або зачекайте відновлення.')
        fetchLimits() // Щоб показати нуль
      } else {
        setError('Помилка аналізу. Перевір що є транзакції за поточний місяць.')
      }
      posthog.capture('ai_analysis_failed')
    }
    setLoading(false)
  }

  const formatAnalysis = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('📊') || line.startsWith('⚠️') || line.startsWith('💡') || line.startsWith('🎯')) {
        return <div key={i} style={s.sectionTitle}>{line}</div>
      }
      if (line.trim() === '') return <div key={i} style={{ height: 8 }} />
      return <div key={i} style={s.line}>{line}</div>
    })
  }

  // Рахуємо години до відновлення
  const getHoursLeft = () => {
    if (!limits.nextRefill) return 0
    const diff = new Date(limits.nextRefill) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)))
  }

  const isOutOfTokens = limits.tokens <= 0;

  return (
    <div>
      <div style={{ ...s.header, ...(isMobile && { flexDirection: 'column', gap: 12 }) }}>
        <div>
          <h1 style={{ ...s.title, display: 'flex', alignItems: 'center', gap: 10 }}><UiIcon name="ai" size={28} /> AI Аналіз</h1>
          <p style={s.subtitle}>Claude аналізує твої витрати і дає персональні поради</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Показуємо бейдж з лімітами */}
          <div style={s.limitBadge}>
            ⚡ {limits.tokens} / 5 запитів
          </div>
          <button 
            onClick={analyze} 
            disabled={loading || !emailVerified || isOutOfTokens} 
            style={{ ...s.btn, opacity: (loading || !emailVerified || isOutOfTokens) ? 0.5 : 1 }}
          >
            {loading ? '⏳ Аналізую...' : isOutOfTokens ? `Відновиться через ${getHoursLeft()} год` : '✨ Проаналізувати місяць'}
          </button>
        </div>
      </div>

      {!analysis && !loading && !error && (
        <div style={s.emptyCard}>
          <div style={s.emptyIcon}><UiIcon name="ai" size={56} /></div>
          <h2 style={s.emptyTitle}>Готовий до аналізу!</h2>
          <p style={s.emptyText}>Натисни кнопку вище і Claude проаналізує твої витрати за поточний місяць, знайде де ти переплачуєш і запропонує бюджет на наступний місяць.</p>
          <div style={{ ...s.features, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
            {[
              { icon: 'chart',  color: '#818CF8', text: 'Загальний висновок про фінанси' },
              { icon: 'alert',  color: '#FBBF24', text: 'Категорії з надмірними витратами' },
              { icon: 'bulb',   color: '#34D399', text: 'Конкретні поради з цифрами' },
              { icon: 'target', color: '#FB7185', text: 'Рекомендований бюджет' },
            ].map((f, i) => (
              <div key={i} style={s.feature}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = f.color }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--glass-border)' }}>
                <span style={{ color: f.color, flexShrink: 0, display: 'flex' }}><UiIcon name={f.icon} size={22} /></span>
                {f.text}
              </div>
            ))}
          </div>

          {/* Плашка про ліміти та донат */}
          <div style={s.donateBanner}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left' }}>
              <span style={{ color: '#C084FC', flexShrink: 0, display: 'flex' }}><UiIcon name="coffee" size={24} /></span>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Як працюють ліміти?</div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                  5 безкоштовних запитів кожні 12 годин. Хочеш більше — задонать на каву розробнику і отримай +5 запитів одразу.
                </div>
              </div>
            </div>
            <a 
              href={MONO_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={s.donateBtn}
              onClick={() => toast.success('Після донату твій баланс поповниться автоматично!', { duration: 5000 })}
            >
              ☕ Підтримати і отримати +5 запитів
            </a>
          </div>
        </div>
      )}

      {loading && (
        <div style={s.loadingCard}>
          <div style={s.spinner}>⏳</div>
          <p style={s.loadingText}>Claude аналізує твої фінанси...</p>
          <p style={s.loadingSubtext}>Це займе кілька секунд</p>
        </div>
      )}

      {error && (
        <div style={s.errorCard}>
          <p>❌ {error}</p>
        </div>
      )}

      {analysis && (
        <div style={s.analysisCard}>
          <div style={s.analysisHeader}>
            <span style={s.analysisTag}>AI Аналіз</span>
            <span style={s.analysisDate}>{new Date().toLocaleDateString('uk', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div style={s.analysisContent}>
            {formatAnalysis(analysis)}
          </div>
          <button 
             onClick={analyze} 
             disabled={loading || isOutOfTokens}
             style={{ ...s.refreshBtn, opacity: isOutOfTokens ? 0.5 : 1 }}
          >
             🔄 {isOutOfTokens ? `Чекай ${getHoursLeft()} год` : 'Оновити аналіз'}
          </button>
        </div>
      )}
    </div>
  )
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 4, background: 'linear-gradient(135deg, #818CF8, #C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-flex', alignItems: 'center', gap: 10 },
  subtitle: { fontSize: 14, color: 'var(--color-text-secondary)' },
  btn: { padding: '12px 24px', background: 'linear-gradient(135deg, #6366F1, #9333EA)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.45)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
  limitBadge: { background: '#f8f9ff', border: '1px solid #e0e7ff', padding: '10px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#667eea', whiteSpace: 'nowrap' },
  emptyCard: { background: 'var(--glass-bg)', WebkitBackdropFilter: 'blur(var(--glass-blur))', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', borderRadius: 24, padding: 48, textAlign: 'center', boxShadow: 'var(--glass-shadow)' },
  emptyIcon: { display: 'flex', justifyContent: 'center', marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.5))' },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 },
  emptyText: { fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 },
  features: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 520, margin: '0 auto 32px' },
  feature: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--glass-bg)', WebkitBackdropFilter: 'blur(calc(var(--glass-blur) * 0.7))', backdropFilter: 'blur(calc(var(--glass-blur) * 0.7))', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '14px 16px', fontSize: 13, color: 'var(--color-text-primary)', textAlign: 'left', transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease' },
  donateBanner: { background: 'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(99,102,241,0.10))', borderRadius: 16, padding: 20, maxWidth: 520, margin: '0 auto', border: '1px solid rgba(124,58,237,0.25)' },
  donateBtn: { display: 'block', width: '100%', padding: '12px', background: '#7F77DD', color: '#fff', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, marginTop: 16, transition: 'background 0.2s' },
  loadingCard: { background: 'var(--glass-bg)', WebkitBackdropFilter: 'blur(var(--glass-blur))', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', borderRadius: 24, padding: 48, textAlign: 'center', boxShadow: 'var(--glass-shadow)' },
  spinner: { fontSize: 48, marginBottom: 16 },
  loadingText: { fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 },
  loadingSubtext: { fontSize: 14, color: 'var(--color-text-tertiary)' },
  errorCard: { background: '#fff5f5', borderRadius: 12, padding: 20, color: '#e53e3e', border: '1px solid #fed7d7' },
  analysisCard: { background: 'var(--glass-bg)', WebkitBackdropFilter: 'blur(var(--glass-blur))', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', borderRadius: 24, padding: 32, boxShadow: 'var(--glass-shadow)' },
  analysisHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' },
  analysisTag: { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  analysisDate: { fontSize: 13, color: '#999' },
  analysisContent: { lineHeight: 1.8 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginTop: 20, marginBottom: 8 },
  line: { fontSize: 14, color: '#444', paddingLeft: 8 },
  refreshBtn: { marginTop: 24, padding: '10px 20px', background: '#f8f9ff', border: '1px solid #667eea', color: '#667eea', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
}