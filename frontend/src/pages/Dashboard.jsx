import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Charts from './Charts.jsx'
import AIAnalysis from './AIAnalysis.jsx'
import api from '../api/index.js'
import EditModal from '../components/EditModal.jsx'
import { sanitize } from '../utils/sanitize.js'
import AdminPanel from './AdminPanel.jsx'
import ProfileModal from '../components/ProfileModal.jsx'
import Import from './Import.jsx'
import BulkDeleteModal from '../components/BulkDeleteModal.jsx'
import GamePage from './GamePage.jsx'
import GameWidget from '../components/GameWidget.jsx'
import BudgetSection from '../components/BudgetSection.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { useIsMobile } from '../hooks/useResponsive.js'
import posthog from 'posthog-js'
import FeedbackModal from '../components/FeedbackModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { calcSafeToSpend } from '../utils/safeToSpend.js'

const MONTHS = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень']

const CATEGORIES = [
  { name: 'Їжа',              icon: '/icons/food.svg',          color: '#FAECE7', type: 'expense' },
  { name: 'Кафе та ресторани',icon: '/icons/food.svg',          color: '#FDE8D8', type: 'expense' },
  { name: 'Транспорт',        icon: '/icons/transport.svg',     color: '#E3F2FD', type: 'expense' },
  { name: 'Розваги',          icon: '/icons/entertainment.svg', color: '#F3E5F5', type: 'expense' },
  { name: 'Здоров\'я',        icon: '/icons/health.svg',        color: '#FFEBEE', type: 'expense' },
  { name: 'Одяг',             icon: '/icons/clothing.svg',      color: '#FFF8E1', type: 'expense' },
  { name: 'Комунальні',       icon: '/icons/utilities.svg',     color: '#FFF9C4', type: 'expense' },
  { name: 'Зв\'язок',         icon: '/icons/utilities.svg',     color: '#E8EAF6', type: 'expense' },
  { name: 'Житло',            icon: '/icons/other.svg',         color: '#F1F8E9', type: 'expense' },
  { name: 'Навчання',         icon: '/icons/other.svg',         color: '#E8F5E9', type: 'expense' },
  { name: 'Краса та догляд',  icon: '/icons/health.svg',        color: '#FCE4EC', type: 'expense' },
  { name: 'Техніка',          icon: '/icons/other.svg',         color: '#E3F2FD', type: 'expense' },
  { name: 'Подарунки',        icon: '/icons/other.svg',         color: '#FFF3E0', type: 'expense' },
  { name: 'Подорожі',         icon: '/icons/transport.svg',     color: '#E0F7FA', type: 'expense' },
  { name: 'Тварини',          icon: '/icons/other.svg',         color: '#F9FBE7', type: 'expense' },
  { name: 'Зарплата',         icon: '/icons/salary.svg',        color: '#E8F5E9', type: 'income'  },
  { name: 'Фріланс',          icon: '/icons/freelance.svg',     color: '#E0F7FA', type: 'income'  },
  { name: 'Підробіток',       icon: '/icons/freelance.svg',     color: '#F0FFF4', type: 'income'  },
  { name: 'Кешбек',           icon: '/icons/salary.svg',        color: '#E8F5E9', type: 'income'  },
  { name: 'Подарунок',        icon: '/icons/other.svg',         color: '#FFF8E1', type: 'income'  },
  { name: 'Інші доходи',      icon: '/icons/salary.svg',        color: '#F3E5F5', type: 'income'  },
  { name: 'Інше',             icon: '/icons/other.svg',         color: '#EDE7F6', type: 'expense' },
]
function SparkLine({ transactions, isMobile }) {
  const daysInMonth = new Date(
    new Date().getFullYear(), new Date().getMonth() + 1, 0
  ).getDate()

  // Накопичений баланс по днях
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dayTx = transactions.filter(t => new Date(t.date).getDate() === day)
    const income = dayTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return income - expense
  })

  // Кумулятивний баланс
  const cumulative = days.reduce((acc, val) => {
    acc.push((acc[acc.length - 1] || 0) + val)
    return acc
  }, [])

  if (cumulative.every(v => v === 0)) return null

  const W = isMobile ? 90 : 140, H = isMobile ? 44 : 56
  const max = Math.max(...cumulative)
  const min = Math.min(...cumulative)
  const range = max - min || 1
  const today = new Date().getDate()
  const points = cumulative.slice(0, today)

  const px = (i) => (i / (points.length - 1 || 1)) * W
  const py = (v) => H - ((v - min) / range) * H

  const pathD = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')
  const areaD = pathD + ` L${px(points.length - 1).toFixed(1)},${H} L0,${H} Z`

  const lastVal = points[points.length - 1]
  const isUp = lastVal >= 0

  return (
    <div style={{ flexShrink: 0, opacity: 0.85 }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Area */}
        <path d={areaD} fill="url(#sparkGrad)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Last dot */}
        <circle
          cx={px(points.length - 1)}
          cy={py(lastVal)}
          r="3.5"
          fill="#fff"
          stroke={isUp ? '#43e97b' : '#fa709a'}
          strokeWidth="2"
        />
      </svg>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textAlign: 'right', marginTop: 2 }}>
        динаміка місяця
      </div>
    </div>
  )
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { user: authUser, setUser: updateAuthUser } = useAuth()
  const user = authUser || {}
  const navigate = useNavigate()
  const now = new Date()
  const [transactions, setTransactions] = useState([])
  const [allTransactions, setAllTransactions] = useState([])
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 })
  const [prevStats, setPrevStats] = useState({ expense: 0, income: 0 })
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTx, setEditTx] = useState(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterMonth, setFilterMonth] = useState(now.getMonth())
  const [filterYear, setFilterYear] = useState(now.getFullYear())
  const [form, setForm] = useState({
    amount: '', type: 'expense', description: '', categoryId: '',
    date: now.toISOString().split('T')[0]
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [messages, setMessages] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const [gameKey, setGameKey] = useState(0)
  const isMobile = useIsMobile()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [emailVerified, setEmailVerified] = useState(user.emailVerified === true)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [verifySuccess, setVerifySuccess] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [budgetsData, setBudgetsData] = useState([])

const handleVerifyEmail = async () => {
  if (!verifyCode || verifyCode.length !== 6) {
    setVerifyError('Введи 6-значний код')
    return
  }
  setVerifyLoading(true)
  setVerifyError('')
  try {
    await api.post('/auth/verify-email', { code: verifyCode })
    setEmailVerified(true)
    setVerifySuccess(true)
    const updatedUser = { ...user, emailVerified: true }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  } catch (e) {
    setVerifyError(e.response?.data?.error || 'Невірний код')
  }
  setVerifyLoading(false)
}

const handleResendCode = async () => {
  try {
    await api.post('/auth/resend-verification')
    setVerifyError('')
    toast.success('Новий код відправлено на пошту!')
  } catch {
    toast.error('Помилка відправки')
  }
}

  const loadMessages = async () => {
    try {
      const res = await api.get('/messages')
      setMessages(res.data)
    } catch {}
  }

  const syncGame = async () => {
  try {
    const res = await api.post('/game/sync')
    if (res.data.newAchievements?.length > 0) {
      res.data.newAchievements.forEach(a => {
        toast.success(`${a.icon} Нова ачівка: ${a.title} +${a.xp} XP`, { duration: 4000 })
      })
    }
    setGameKey(k => k + 1)
  } catch {}
}

  useEffect(() => {
  Promise.all([loadData(), loadMessages()])
}, [])
  useEffect(() => { applyFilters() }, [allTransactions, search, filterMonth, filterYear])

  const loadData = async () => {
  try {
    const [catsRes, txRes, budgetsRes] = await Promise.all([
      api.get('/categories'),
      api.get('/transactions'),
      api.get(`/budgets?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
    ])

    let cats = catsRes.data

    const existingNames = new Set(cats.map(c => c.name))
    const missing = CATEGORIES.filter(c => !existingNames.has(c.name))
    if (missing.length > 0) {
      await Promise.all(missing.map(cat => api.post('/categories', cat)))
      const newCats = await api.get('/categories')
      cats = newCats.data
    }

    const seen = new Set()
    const unique = cats.filter(c => {
      if (seen.has(c.name)) return false
      seen.add(c.name)
      return true
    })
    setCategories(unique)
    setAllTransactions(txRes.data)
    setBudgetsData(budgetsRes.data)
    calcPrevStats(txRes.data)
  } catch {
    toast.error('Помилка завантаження')
  }
}

  const calcPrevStats = (txs) => {
    const prev = now.getMonth() === 0 ? 11 : now.getMonth() - 1
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
    const prevTxs = txs.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === prev && d.getFullYear() === prevYear
    })
    setPrevStats({
      income: prevTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: prevTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    })
  }

  const applyFilters = () => {
    let filtered = allTransactions
    if (search) filtered = filtered.filter(t =>
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.name?.toLowerCase().includes(search.toLowerCase())
    )
    filtered = filtered.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear
    })
    setTransactions(filtered)
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    setStats({ income, expense, balance: income - expense })
  }

  // ДОДАНО: Мутація для миттєвого збереження транзакції
  const addTxMutation = useMutation({
    mutationFn: async (newTx) => {
      const res = await api.post('/transactions', newTx);
      return res.data;
    },
    // Цей блок виконується МИТТЄВО при кліку на кнопку
    onMutate: async (newTx) => {
      setForm({ amount: '', type: 'expense', description: '', categoryId: '', date: now.toISOString().split('T')[0] })
      setShowForm(false)
      toast.success('Транзакцію додано!')

      // Створюємо "фейкову" транзакцію для UI
      const optimisticTx = {
        ...newTx,
        id: Math.random().toString(), // тимчасовий ID
        _optimistic: true,
        category: categories.find(c => c.id === newTx.categoryId) || { name: 'Інше' }
      };

      // Миттєво оновлюємо локальний стан (без очікування бекенду!)
      setAllTransactions(old => [optimisticTx, ...old])
      setTransactions(old => {
        // Застосовуємо фільтри, якщо треба
        if (new Date(newTx.date).getMonth() === filterMonth) {
          return [optimisticTx, ...old]
        }
        return old
      })
      
      // Перераховуємо статистику миттєво
      setStats(prev => {
        const income = newTx.type === 'income' ? prev.income + newTx.amount : prev.income;
        const expense = newTx.type === 'expense' ? prev.expense + newTx.amount : prev.expense;
        return { income, expense, balance: income - expense };
      })
    },
    onSuccess: () => {
      // Коли бекенд відповів (через 5-10 сек), тихо оновлюємо дані у фоні
      loadData();
      syncGame();
    },
    onError: () => {
      toast.error('Помилка синхронізації з сервером. Оновіть сторінку.')
      loadData(); // Відкочуємо дані назад
    }
  })

  const addTransaction = (e) => {
  e.preventDefault()
  if (!emailVerified) {
    toast.error('Підтвердіть email перед додаванням транзакцій')
    return
  }
    if (!form.amount) { toast.error('Введи суму'); return }
    if (form.type !== 'transfer' && !form.categoryId) { toast.error('Оберіть категорію'); return }
    
    // Формуємо дані
    const otherCat = categories.find(c => c.name === 'Інше')
    const txData = {
      ...form,
      description: sanitize(form.description),
      amount: parseFloat(form.amount),
      categoryId: form.type === 'transfer' ? otherCat?.id || categories[0]?.id : form.categoryId
    }

    posthog.capture('transaction_added', {
      type: form.type,
      amount: txData.amount,
      category: categories.find(c => c.id === form.categoryId)?.name,
    })

    // ЗАПУСКАЄМО МУТАЦІЮ
    addTxMutation.mutate(txData);
  }

  const deleteTransaction = async (id) => {
  if (!emailVerified) {
    toast.error('Підтвердіть email перед видаленням')
    return
  }
  // Миттєво видаляємо з UI
  setAllTransactions(old => old.filter(t => t.id !== id))
  setTransactions(old => old.filter(t => t.id !== id))
  try {
    await api.delete(`/transactions/${id}`)
    toast.success('Видалено')
    posthog.capture('transaction_deleted')
    syncGame()
  } catch {
    toast.error('Помилка видалення')
    loadData() // відкочуємо якщо помилка
  }
}

  const markAsRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`)
      loadMessages()
    } catch {}
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('user')
    posthog.reset()
    navigate('/login')
    window.location.href = '/login'
  }

  const unreadCount = messages.filter(m => !m.read).length
  const incomeChange = prevStats.income > 0 ? Math.round(((stats.income - prevStats.income) / prevStats.income) * 100) : null
  const expenseChange = prevStats.expense > 0 ? Math.round(((stats.expense - prevStats.expense) / prevStats.expense) * 100) : null
  const savings = stats.income > 0 ? Math.round(((stats.income - stats.expense) / stats.income) * 100) : 0

   const safeData = calcSafeToSpend({
    now,
    transactions: allTransactions,
    income: stats.income,
    budgets: budgetsData,
  })
  const safeToSpend = safeData?.value ?? null
  const hasBudgets = budgetsData.length > 0
  const [showSafeTooltip, setShowSafeTooltip] = useState(false)
  const [challengeData, setChallengeData] = useState(null)

  useEffect(() => {
  api.get('/game').then(res => setChallengeData(res.data.challenge)).catch(() => {})
}, [gameKey])

  const pieData = categories
    .filter(c => c.type === 'expense')
    .map(cat => ({
      ...cat,
      value: transactions.filter(t => t.category?.name === cat.name && t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)

  const totalExpense = pieData.reduce((s, d) => s + d.value, 0)

  const barData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const m = d.getMonth(), y = d.getFullYear()
    const expense = allTransactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === m && new Date(t.date).getFullYear() === y).reduce((s, t) => s + t.amount, 0)
    const maxExpense = Math.max(...Array.from({ length: 6 }, (_, j) => {
      const dd = new Date(); dd.setMonth(dd.getMonth() - (5 - j))
      return allTransactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === dd.getMonth()).reduce((s, t) => s + t.amount, 0)
    }), 1)
    return { month: d.toLocaleString('uk', { month: 'short' }), expense, height: Math.round((expense / maxExpense) * 100), active: m === now.getMonth() }
  })

  const navItems = [
    { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Дашборд' },
    { id: 'transactions', icon: 'ti-arrows-exchange', label: 'Транзакції' },
    { id: 'charts', icon: 'ti-chart-bar', label: 'Графіки' },
    { id: 'ai', icon: 'ti-robot', label: 'AI Аналіз' },
    { id: 'messages', icon: 'ti-bell', label: 'Повідомлення', badge: unreadCount },
    ...(user.role === 'ROOT' ? [{ id: 'admin', icon: 'ti-shield-check', label: 'Адмін' }] : []),
    { id: 'import', icon: 'ti-download', label: 'Імпорт' },
    { id: '_feedback', icon: 'ti-message-circle', label: 'Залишити відгук' },
    { id: 'game', icon: 'ti-sword', label: 'Герой' },
  ]

  const filteredCategories = form.type === 'transfer' 
  ? categories 
  : categories.filter(c => c.type === form.type)
  const initials = currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'VL'

  return (
    <div className="app-shell" style={{ ...s.app, flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Mobile top bar */}
{isMobile && (
  <div style={s.mobileTopBar}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src="/Aperio.png" alt="Aperio" style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover' }} />
      <span style={s.logoText}>Aperio</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <ThemeToggle />
      {(activeTab === 'dashboard' || activeTab === 'transactions') && (
          <button onClick={() => emailVerified && setShowForm(v => !v)} style={{ ...s.mobileAddBtn, opacity: emailVerified ? 1 : 0.5 }} disabled={!emailVerified}>
            <i className="ti ti-plus" style={{ fontSize: 18 }} />
          </button>
        )}
      <button onClick={() => setShowProfile(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <div style={s.avatar}>
          {currentUser.avatarUrl
            ? <img src={currentUser.avatarUrl} alt="avatar" style={s.avatarImg} />
            : initials
          }
        </div>
      </button>
    </div>
  </div>
)}
      {/* SIDEBAR */}
      <div style={{ ...s.sidebar, display: isMobile ? 'none' : 'flex', flexDirection: 'column' }}>
        <div style={s.logoRow}>
          <img src="/Aperio.png" alt="Aperio" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }} />
          <span style={s.logoText}>Aperio</span>
        </div>
        <div style={s.navLabel}>Меню</div>
        {navItems.map(item => (
            <button key={item.id}
              onClick={() => item.id === '_feedback' ? setShowFeedback(true) : setActiveTab(item.id)}
            style={{ ...s.navItem, ...(activeTab === item.id ? s.navActive : {}) }}>
            <i className={`ti ${item.icon}`} style={{ fontSize: 18 }} />
            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
            {item.badge > 0 && (
              <span style={s.navBadge}>{item.badge}</span>
            )}
          </button>
        ))}
        <div style={s.navLabel}>Акаунт</div>
        <button onClick={logout} style={s.navItem}>
          <i className="ti ti-logout" style={{ fontSize: 18 }} />
          Вийти
        </button>
        <GameWidget onNavigate={setActiveTab} refreshKey={gameKey} />
        <button onClick={() => setShowProfile(true)} style={s.userRowBtn}>
  <div style={s.avatar}>
    {currentUser.avatarUrl
      ? <img src={currentUser.avatarUrl} alt="avatar" style={s.avatarImg} />
      : initials
    }
  </div>
  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
      <div style={s.userName}>{currentUser.name}</div>
        <div style={s.userRole}>{currentUser.role === 'ROOT' ? 'Адміністратор' : 'Особистий'}</div>
        </div>
        <i className="ti ti-settings" style={{ fontSize: 15, color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
      </button>
      </div>

      {/* MAIN */}
      <div style={{ ...s.main, ...(isMobile && { padding: '12px', paddingBottom: 80, overflowX: 'hidden', boxSizing: 'border-box', width: '100%' }) }}>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
            {!emailVerified && (
              <div style={{ background: 'linear-gradient(135deg, #FEF9F0, #FEF2DE)', border: '0.5px solid #F5C842', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#633806', marginBottom: 4 }}>
                    📧 Підтвердіть свою email адресу
                  </div>
                  <div style={{ fontSize: 12, color: '#985A00' }}>
                    Введи 6-значний код з листа який прийшов на твою пошту
                  </div>
                  {verifyError && <div style={{ fontSize: 12, color: '#993C1D', marginTop: 4 }}>{verifyError}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    style={{ width: 120, padding: '8px 12px', border: '0.5px solid #F5C842', borderRadius: 8, fontSize: 16, letterSpacing: 4, textAlign: 'center', outline: 'none' }}
                    placeholder="000000"
                    maxLength={6}
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  />
                  <button onClick={handleVerifyEmail} disabled={verifyLoading}
                    style={{ padding: '8px 16px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500, opacity: verifyLoading ? 0.7 : 1 }}>
                    {verifyLoading ? '...' : 'Підтвердити'}
                  </button>
                  <button onClick={handleResendCode}
                    style={{ padding: '8px 12px', background: 'none', border: '0.5px solid #F5C842', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: '#985A00' }}>
                    Надіслати знову
                  </button>
                </div>
              </div>
            )}
            <div style={s.topBar}>
              <div>
                <div style={s.pageTitle}>Дашборд</div>
                <div style={s.monthNav}>
                  <button onClick={() => { const d = new Date(filterYear, filterMonth - 1); setFilterMonth(d.getMonth()); setFilterYear(d.getFullYear()) }} style={s.monthBtn}>‹</button>
                  <span style={s.monthLabel}>{MONTHS[filterMonth]} {filterYear}</span>
                  <button onClick={() => { const d = new Date(filterYear, filterMonth + 1); setFilterMonth(d.getMonth()); setFilterYear(d.getFullYear()) }} style={s.monthBtn}>›</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {!isMobile && <ThemeToggle />}
                <button className="glass-shine" onClick={() => emailVerified && setShowForm(!showForm)} style={{ ...s.addBtn, opacity: emailVerified ? 1 : 0.5 }} disabled={!emailVerified}>
                  <i className="ti ti-plus" /> {showForm ? 'Закрити' : 'Додати'}
                </button>
              </div>
            </div>

            {/* FORM */}
            {showForm && (
              <div style={s.formCard}>
                <div style={s.formTitle}>Нова транзакція</div>
                <form onSubmit={addTransaction}>
                  <div style={{ ...s.formRow, ...(isMobile && { flexWrap: 'wrap' }) }}>
                    <select style={s.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value, categoryId: '' })}>
                      <option value="expense">Витрата</option>
                      <option value="income">Дохід</option>
                      <option value="transfer">Переказ</option>
                    </select>
                    <input style={s.input} type="number" placeholder="Сума ₴" min="0.01" step="0.01"
                      value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                    <input style={s.input} type="date" value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div style={{ ...s.formRow, ...(isMobile && { flexWrap: 'wrap' }) }}>
                    {form.type !== 'transfer' && (
                      <select style={s.select} value={form.categoryId}
                        onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                        <option value="">Оберіть категорію</option>
                        {filteredCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                    <input style={{ ...s.input, flex: 2 }} type="text" placeholder="Опис (необов'язково)"
                      value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <button style={{ ...s.addBtn, width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                    type="submit" disabled={loading}>
                    {loading ? 'Збереження...' : 'Зберегти транзакцію'}
                  </button>
                </form>
              </div>
            )}

            <div style={{ ...s.twoCol, gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: isMobile ? 12 : 20 }}>
              {/* LEFT */}
              <div style={{ minWidth: 0, width: '100%', overflow: 'hidden' }}>
                {filterMonth === now.getMonth() && filterYear === now.getFullYear() && (
                  <div style={s.safeCard}>
                    {safeToSpend === null ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={s.safeLabel}>💰 Safe-to-Spend</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                          Додай дохід щоб побачити денний ліміт
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                        <div>
                          <div style={s.safeLabel}>Сьогодні безпечно витратити</div>
                          <div
                            style={{ ...s.safeAmount, cursor: 'pointer', display: 'inline-block' }}
                            onClick={() => setShowSafeTooltip(v => !v)}
                            title="Як це порахувалось?"
                          >
                            {safeToSpend === 0 ? '₴0' : `₴${Math.round(safeToSpend).toLocaleString()}`}
                            <i className="ti ti-info-circle" style={{ fontSize: 14, marginLeft: 8, opacity: 0.7, verticalAlign: 'middle' }} />
                          </div>
                          <div style={s.safeSubtext}>
                            {safeToSpend === 0
                              ? 'Сьогодні краще пригальмувати ☕'
                              : !hasBudgets
                              ? 'Встанови бюджети для точнішого розрахунку'
                              : 'На основі твоїх бюджетів'}
                          </div>
                        </div>
                        <div style={s.safeIcon}>💸</div>

                        {showSafeTooltip && safeData && (
                          <div style={s.safeTooltip} onClick={e => e.stopPropagation()}>
                            <div style={s.tooltipHeader}>
                              <span>Як це порахувалось?</span>
                              <button onClick={() => setShowSafeTooltip(false)} style={s.tooltipClose}>×</button>
                            </div>
                            <div style={s.tooltipRow}>
                              <span style={s.tooltipLabel}>{safeData.hasBudget ? 'Бюджет на місяць' : 'Дохід за місяць'}</span>
                              <span style={s.tooltipValue}>₴{Math.round(safeData.baseAmount).toLocaleString()}</span>
                            </div>
                            <div style={s.tooltipRow}>
                              <span style={s.tooltipLabel}>Вже витрачено</span>
                              <span style={s.tooltipValue}>−₴{Math.round(safeData.monthExpense).toLocaleString()}</span>
                            </div>
                            <div style={{ ...s.tooltipRow, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 8, marginTop: 4 }}>
                              <span style={s.tooltipLabel}>Залишилось</span>
                              <span style={{ ...s.tooltipValue, fontWeight: 600 }}>
                                ₴{Math.round(safeData.baseAmount - safeData.monthExpense).toLocaleString()} на {safeData.daysLeft} {safeData.daysLeft === 1 ? 'день' : safeData.daysLeft < 5 ? 'дні' : 'днів'}
                              </span>
                            </div>
                            <div style={s.tooltipRow}>
                              <span style={s.tooltipLabel}>Денний ліміт</span>
                              <span style={s.tooltipValue}>₴{Math.round(safeData.dailyLimit).toLocaleString()}</span>
                            </div>
                            <div style={s.tooltipRow}>
                              <span style={s.tooltipLabel}>Витрачено сьогодні</span>
                              <span style={s.tooltipValue}>−₴{Math.round(safeData.spentToday).toLocaleString()}</span>
                            </div>
                            <div style={s.tooltipFooter}>
                              Тому сьогодні ти можеш безпечно витратити <b>₴{Math.round(safeToSpend).toLocaleString()}</b>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div style={s.balanceCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={s.balanceLabel}>Загальний баланс</div>
                      <div style={s.balanceAmount}>₴{stats.balance.toLocaleString()}</div>
                      <div style={s.balanceRow}>
                        <div style={s.balanceSub}>
                          <span style={s.balanceSubLabel}>Доходи</span>
                          <span style={s.balanceSubVal}>₴{stats.income.toLocaleString()}</span>
                        </div>
                        <div style={s.balanceSub}>
                          <span style={s.balanceSubLabel}>Витрати</span>
                          <span style={s.balanceSubVal}>₴{stats.expense.toLocaleString()}</span>
                        </div>
                        <div style={s.balanceSub}>
                          <span style={s.balanceSubLabel}>Місяць</span>
                          <span style={s.balanceSubVal}>{MONTHS[filterMonth].slice(0, 3)}</span>
                        </div>
                      </div>
                    </div>
                    <SparkLine transactions={transactions} isMobile={isMobile} />
                  </div>
                </div>

                <div style={{ ...s.statsGrid, ...(isMobile && { gap: 6 }) }}>
                  <div style={s.statCard}>
                    <div style={s.statIcon}>
                      <img src="/icons/income-stat.svg" width={34} height={34} alt="" />
                    </div>
                    <div style={s.statLabel}>Доходи</div>
                    <div style={s.statVal}>₴{stats.income.toLocaleString()}</div>
                    {incomeChange !== null && (
                      <div style={{ ...s.statChange, color: incomeChange >= 0 ? '#3B6D11' : '#993C1D' }}>
                        <i className={`ti ti-arrow-${incomeChange >= 0 ? 'up' : 'down'}`} /> {Math.abs(incomeChange)}% vs минулий
                      </div>
                    )}
                  </div>
                  <div style={s.statCard}>
                    <div style={s.statIcon}>
                      <img src="/icons/expense-stat.svg" width={34} height={34} alt="" />
                    </div>
                    <div style={s.statLabel}>Витрати</div>
                    <div style={s.statVal}>₴{stats.expense.toLocaleString()}</div>
                    {expenseChange !== null && (
                      <div style={{ ...s.statChange, color: expenseChange <= 0 ? '#3B6D11' : '#993C1D' }}>
                        <i className={`ti ti-arrow-${expenseChange >= 0 ? 'up' : 'down'}`} /> {Math.abs(expenseChange)}% vs минулий
                      </div>
                    )}
                  </div>
                  <div style={s.statCard}>
                    <div style={s.statIcon}>
                      <img src="/icons/savings-stat.svg" width={34} height={34} alt="" />
                    </div>
                    <div style={s.statLabel}>Заощаджено</div>
                    <div style={s.statVal}>{savings}%</div>
                    <div style={{ ...s.statChange, color: savings >= 20 ? '#3B6D11' : '#993C1D' }}>
                      {savings >= 50 ? 'Відмінно!' : savings >= 20 ? 'Добре' : 'Варто більше'}
                    </div>
                  </div>
                </div>

                <div style={s.sectionHeader}>
                  <span style={s.sectionTitle}>Останні транзакції</span>
                  <span style={s.seeAll} onClick={() => setActiveTab('transactions')}>Всі →</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: isMobile ? 12 : 16, alignItems: 'start', width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ ...s.txCard, minWidth: 0 }}>
                    {transactions.slice(0, 6).map(t => {
                      const catDef = CATEGORIES.find(c => c.name === t.category?.name)
                      return (
                        <div key={t.id} style={s.txRow}>
                          <div style={s.txIcon}>
                            <img 
                              src={CATEGORIES.find(c => c.name === t.category?.name)?.icon || '/icons/other.svg'} 
                              width={isMobile ? 32 : 38} height={isMobile ? 32 : 38} alt="" />
                          </div>
                          <div style={s.txInfo}>
                            <div style={s.txName}>{t.category?.name || 'Інше'}</div>
                            <div style={s.txDate}>{t.description || '—'} · {new Date(t.date).toLocaleDateString('uk', { day: 'numeric', month: 'short' })}</div>
                          </div>
                          <div style={{ ...s.txAmount, color: t.type === 'income' ? '#3B6D11' : t.type === 'transfer' ? '#534AB7' : '#993C1D' }}>
                            {t.type === 'income' ? '+' : t.type === 'transfer' ? '⇄' : '-'}₴{t.amount.toLocaleString()}
                          </div>
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            <button 
                                onClick={() => !t._optimistic && setEditTx(t)} 
                                style={{ ...s.actionBtn, opacity: t._optimistic ? 0.3 : 1 }} 
                                title={t._optimistic ? 'Збереження...' : 'Редагувати'}
                                disabled={t._optimistic}>
                              <img src="/icons/edit.svg" width={isMobile ? 24 : 28} height={isMobile ? 24 : 28} alt="edit" />
                            </button>
                            <button 
                                  onClick={() => !t._optimistic && deleteTransaction(t.id)} 
                                  style={{ ...s.actionBtn, opacity: t._optimistic ? 0.3 : 1 }} 
                                  title={t._optimistic ? 'Збереження...' : 'Видалити'}
                                  disabled={t._optimistic}
                                >
                              <img src="/icons/delete.svg" width={isMobile ? 24 : 28} height={isMobile ? 24 : 28} alt="delete" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    {transactions.length === 0 && (
                      <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>
                        Немає транзакцій за {MONTHS[filterMonth]}. Додай першу!
                      </div>
                    )}
                  </div>

                  {/* Челендж */}
                  {challengeData ? (
                    <div style={s.challengeWidget}>
                      <div style={s.challengeHeader}>
                        <span style={{ fontSize: 18 }}>⚡</span>
                        <div>
                          <div style={s.challengeTitle}>Тижневий челендж</div>
                          <div style={s.challengeSub}>оновлюється щопонеділка</div>
                        </div>
                      </div>
                      <div style={s.challengeDesc}>
                        {challengeData.type === 'spend_less_food' && `Витрать на їжу менше ніж ₴${Math.round(challengeData.targetAmount)}`}
                        {challengeData.type === 'spend_less_fun' && `Витрать на розваги менше ніж ₴${Math.round(challengeData.targetAmount)}`}
                        {challengeData.type === 'add_transactions' && `Додавай транзакцію кожен день (ціль: ${Math.round(challengeData.targetAmount)})`}
                      </div>
                      <div style={{ margin: '12px 0 6px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                        <span>Прогрес</span>
                        <span>{Math.round(challengeData.currentAmount)} / {Math.round(challengeData.targetAmount)}</span>
                      </div>
                      <div style={s.challengeBar}>
                        <div style={{
                          ...s.challengeBarFill,
                          width: `${Math.min(challengeData.type === 'add_transactions'
                            ? (challengeData.currentAmount / challengeData.targetAmount) * 100
                            : (1 - challengeData.currentAmount / challengeData.targetAmount) * 100, 100)}%`
                        }} />
                      </div>
                      <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                        🎁 Нагорода: +{challengeData.xpReward} XP
                      </div>
                      {challengeData.completed && (
                        <div style={{ marginTop: 8, fontSize: 13, color: '#43e97b', fontWeight: 600 }}>✅ Виконано!</div>
                      )}
                      <button onClick={() => setActiveTab('game')} style={s.challengeBtn}>
                        Всі деталі →
                      </button>
                    </div>
                  ) : (
                    <div style={{ ...s.challengeWidget, opacity: 0.6 }}>
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Додай транзакції щоб отримати челендж</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ ...s.rightCol, ...(isMobile && { marginTop: 16 }) }}>
                <div style={s.rightCard}>
                  <div style={s.sectionTitle}>Витрати по місяцях</div>
                  <div style={s.bars}>
                    {barData.map((d, i) => (
                      <div key={i} style={s.barCol}>
                        <div style={{ ...s.bar, height: Math.max(d.height, 4) + '%', background: d.active ? '#7F77DD' : '#EEEDFE' }} />
                        <div style={s.barLabel}>{d.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={s.rightCard}>
                  <div style={s.sectionTitle}>Категорії витрат</div>
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pieData.slice(0, 4).map((d, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <img 
                                  src={CATEGORIES.find(c => c.name === d.name)?.icon || '/icons/other.svg'} 
                                  width={16} height={16} alt="" style={{ borderRadius: 3 }} 
                                />
                            {d.name}
                          </span>
                          <span style={{ fontWeight: 500 }}>{totalExpense > 0 ? Math.round((d.value / totalExpense) * 100) : 0}%</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--color-background-tertiary)', borderRadius: 3 }}>
                          <div style={{ height: '100%', width: (totalExpense > 0 ? (d.value / totalExpense) * 100 : 0) + '%', background: i === 0 ? '#7F77DD' : i === 1 ? '#AFA9EC' : i === 2 ? '#CECBF6' : '#EEEDFE', borderRadius: 3 }} />
                        </div>
                      </div>
                    ))}
                    {pieData.length === 0 && <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center', padding: 12 }}>Додай витрати</div>}
                  </div>
                </div>

                <div style={s.aiCard}>
                  <div style={s.aiBadge}><i className="ti ti-robot" style={{ fontSize: 13 }} /> AI Порада</div>
                  <div style={s.aiText}>
                    {stats.income === 0 ? 'Додай транзакції щоб отримати AI пораду на основі твоїх даних.' :
                      savings >= 50 ? `Чудово! Ти заощаджуєш ${savings}% доходу. Розглянь інвестування надлишку.` :
                      savings >= 20 ? `Непогано — ${savings}% заощаджень. Спробуй довести до 30%.` :
                      `Витрати ${stats.expense > stats.income ? 'перевищують' : 'майже рівні'} доходам. Перейди до AI Аналізу для детальних порад.`}
                  </div>
                  <button onClick={() => { posthog.capture('ai_analysis_opened'); setActiveTab('ai') }} style={s.aiBtn}>Детальний аналіз →</button>
                </div>

                <BudgetSection categories={categories} categoriesMeta={CATEGORIES} filterMonth={filterMonth} filterYear={filterYear} />
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
            <div style={s.topBar}>
              <div>
                <div style={s.pageTitle}>Транзакції</div>
                <div style={s.monthNav}>
                  <button onClick={() => { const d = new Date(filterYear, filterMonth - 1); setFilterMonth(d.getMonth()); setFilterYear(d.getFullYear()) }} style={s.monthBtn}>‹</button>
                  <span style={s.monthLabel}>{MONTHS[filterMonth]} {filterYear}</span>
                  <button onClick={() => { const d = new Date(filterYear, filterMonth + 1); setFilterMonth(d.getMonth()); setFilterYear(d.getFullYear()) }} style={s.monthBtn}>›</button>
                </div>
              </div>
               <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowBulkDelete(true)} style={{ ...s.addBtn, background: '#FEF2EE', color: '#993C1D', border: '0.5px solid #F5B8A8', opacity: emailVerified ? 1 : 0.5, ...(isMobile && { padding: '8px 12px', fontSize: 12 }) }} disabled={!emailVerified}>
                <i className="ti ti-trash" /> {!isMobile && 'Видалити'}
              </button>
              <button onClick={() => { setActiveTab('dashboard'); setShowForm(true) }} style={{ ...s.addBtn, opacity: emailVerified ? 1 : 0.5, ...(isMobile && { padding: '8px 12px', fontSize: 12 }) }} disabled={!emailVerified}>
                <i className="ti ti-plus" /> {!isMobile && 'Додати'}
              </button>
            </div>
            </div>
            <div style={s.txCard}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <input style={{ ...s.input, width: '100%' }} type="text"
                  placeholder="🔍 Пошук по опису або категорії..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {transactions.map(t => {
                const catDef = CATEGORIES.find(c => c.name === t.category?.name)
                return (
                  <div key={t.id} style={s.txRow}>
                    <div style={s.txIcon}>
                      <img 
                        src={CATEGORIES.find(c => c.name === t.category?.name)?.icon || '/icons/other.svg'} 
                        width={isMobile ? 32 : 38} height={isMobile ? 32 : 38} alt="" />
                    </div>
                    <div style={s.txInfo}>
                      <div style={s.txName}>{t.category?.name || 'Інше'}</div>
                      <div style={s.txDate}>{t.description || '—'} · {new Date(t.date).toLocaleDateString('uk', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div style={{ ...s.txAmount, color: t.type === 'income' ? '#3B6D11' : t.type === 'transfer' ? '#534AB7' : '#993C1D' }}>
                      {t.type === 'income' ? '+' : t.type === 'transfer' ? '⇄' : '-'}₴{t.amount.toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button 
                          onClick={() => !t._optimistic && setEditTx(t)} 
                          style={{ ...s.actionBtn, opacity: t._optimistic ? 0.3 : 1 }} 
                          title={t._optimistic ? 'Збереження...' : 'Редагувати'}
                          disabled={t._optimistic}
                        >
                        <img src="/icons/edit.svg" width={isMobile ? 24 : 28} height={isMobile ? 24 : 28} alt="edit" />
                      </button>
                      <button 
                            onClick={() => !t._optimistic && deleteTransaction(t.id)} 
                            style={{ ...s.actionBtn, opacity: t._optimistic ? 0.3 : 1 }} 
                            title={t._optimistic ? 'Збереження...' : 'Видалити'}
                            disabled={t._optimistic}
                          >
                        <img src="/icons/delete.svg" width={isMobile ? 24 : 28} height={isMobile ? 24 : 28} alt="delete" />
                      </button>
                    </div>
                  </div>
                )
              })}
              {transactions.length === 0 && (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>
                  Немає транзакцій за цей період
                </div>
              )}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div>
            <div style={s.topBar}>
              <div>
                <div style={s.pageTitle}>Повідомлення</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                  {unreadCount > 0 ? `${unreadCount} непрочитаних` : 'Всі повідомлення прочитано'}
                </div>
              </div>
            </div>

            <div style={s.msgsCard}>
              {messages.length === 0 && (
                <div style={{ padding: 48, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
                  <div style={{ fontSize: 14, color: 'var(--color-text-tertiary)' }}>Повідомлень поки немає</div>
                </div>
              )}
              {messages.map(m => (
                <div
                  key={m.id}
                  style={{ ...s.msgRow, background: m.read ? 'transparent' : '#F5F4FE' }}
                  onClick={() => !m.read && markAsRead(m.id)}
                >
                  <div style={s.msgLeft}>
                    <div style={s.msgAvatar}>
                      <i className="ti ti-shield-check" style={{ fontSize: 16, color: '#534AB7' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={s.msgFrom}>від {m.from?.name} · Адміністратор</div>
                      <div style={s.msgText}>{m.text}</div>
                      <div style={s.msgDate}>{new Date(m.createdAt).toLocaleDateString('uk', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                  </div>
                  {!m.read && (
                    <div style={s.unreadPill}>Нове</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'charts' && <Charts transactions={allTransactions} categories={categories} />}
        {activeTab === 'ai' && <AIAnalysis emailVerified={emailVerified} />}
        {activeTab === 'admin' && <AdminPanel />}
        {activeTab === 'import' && <Import categories={categories} onSuccess={loadData} emailVerified={emailVerified} />}
        {activeTab === 'game' && <GamePage />}

       {/* FOOTER */}
        {!isMobile && (
          <div style={s.footer}>
            <span style={s.footerText}>© 2026 Aperio</span>
            <span style={s.footerDot}>·</span>
            <a href="/download" style={s.footerLink}>Завантажити застосунок</a>
            <span style={s.footerDot}>·</span>
            <a href="/about" style={s.footerLink}>Про сервіс</a>
            <span style={s.footerDot}>·</span>
            <a href="/privacy" style={s.footerLink}>Конфіденційність</a>
            <span style={s.footerDot}>·</span>
            <a href="/terms" style={s.footerLink}>Умови використання</a>
            <span style={s.footerDot}>·</span>
            <a href="mailto:matovkavlad@gmail.com" style={s.footerLink}>Контакт</a>
          </div>
        )}
      </div>

{/* Mobile bottom nav */}
{isMobile && (
  <div style={s.bottomNav}>
    {[
      { id: 'dashboard',    icon: 'ti-layout-dashboard', label: 'Дашборд' },
      { id: 'transactions', icon: 'ti-arrows-exchange',  label: 'Транзакції' },
      { id: 'charts',       icon: 'ti-chart-bar',        label: 'Графіки' },
      { id: 'ai',           icon: 'ti-robot',            label: 'AI' },
      { id: '_more',        icon: 'ti-dots',             label: 'Ще' },
    ].map(item => (
      <button key={item.id}
        onClick={() => item.id === '_more'
          ? setShowMobileMenu(v => !v)
          : (setActiveTab(item.id), setShowMobileMenu(false))
        }
        style={{
          ...s.bottomNavItem,
          ...(activeTab === item.id || (item.id === '_more' && showMobileMenu) ? s.bottomNavActive : {}),
        }}>
        <i className={`ti ${item.icon}`} style={{ fontSize: 22 }} />
        <span style={{ fontSize: 11, marginTop: 2, fontWeight: activeTab === item.id ? 500 : 400 }}>{item.label}</span>
        {item.id === '_more' && unreadCount > 0 && (
          <span style={{ position: 'absolute', top: 6, right: 10, background: '#993C1D', color: '#fff', borderRadius: 20, padding: '1px 5px', fontSize: 8, fontWeight: 600 }}>{unreadCount}</span>
        )}
      </button>
    ))}
  </div>
)}

{/* Mobile more drawer */}
{isMobile && showMobileMenu && (
  <div style={s.mobileMoreDrawer} onClick={() => setShowMobileMenu(false)}>
    <div style={s.mobileMoreContent} onClick={e => e.stopPropagation()}>
      {[
        { id: 'messages', icon: 'ti-bell',        label: 'Повідомлення', badge: unreadCount },
        { id: 'game',     icon: 'ti-sword',        label: 'Герой' },
        { id: 'import',   icon: 'ti-download',     label: 'Імпорт' },
        ...(user.role === 'ROOT' ? [{ id: 'admin', icon: 'ti-shield-check', label: 'Адмін' }] : []),
        { id: '_feedback', icon: 'ti-message-circle', label: 'Залишити відгук' },
      ].map(item => (
        <button key={item.id}
          onClick={() => {
            if (item.id === '_feedback') { setShowFeedback(true); setShowMobileMenu(false) }
            else { setActiveTab(item.id); setShowMobileMenu(false) }
          }}
          style={{ ...s.moreDrawerItem, ...(activeTab === item.id ? s.moreDrawerActive : {}) }}>
          <i className={`ti ${item.icon}`} style={{ fontSize: 18 }} />
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge > 0 && <span style={s.navBadge}>{item.badge}</span>}
        </button>
      ))}
      <div style={{ height: 1, background: 'var(--color-border-tertiary)', margin: '8px 0' }} />
      <button onClick={logout} style={{ ...s.moreDrawerItem, color: '#993C1D' }}>
        <i className="ti ti-logout" style={{ fontSize: 18 }} />
        <span>Вийти</span>
      </button>
      <div style={{ height: 1, background: 'var(--color-border-tertiary)', margin: '8px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '8px 0' }}>
        <a href="/about" style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Про сервіс</a>
        <span style={{ color: 'var(--color-border-tertiary)' }}>·</span>
        <a href="/privacy" style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Конфіденційність</a>
        <span style={{ color: 'var(--color-border-tertiary)' }}>·</span>
        <a href="/terms" style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Умови</a>
      </div>
    </div>
  </div>
)}

      {editTx && (
        <EditModal
        transaction={editTx}
        categories={categories}
        onClose={() => setEditTx(null)}
        onSuccess={(updated) => {
          setAllTransactions(old => old.map(t => t.id === updated.id ? updated : t))
          setEditTx(null)
        }}
      />
      )}
      {showBulkDelete && (
        <BulkDeleteModal
          onClose={() => setShowBulkDelete(false)}
          onSuccess={loadData}
        />
      )}
      {showProfile && (
      <ProfileModal
        onClose={() => setShowProfile(false)}
        onUpdate={(updated) => {
          setCurrentUser(updated)
          updateAuthUser(updated)
        }}
      />
    )}

    {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      
    </div>
  )
}

const s = {
  app: { display: 'flex', minHeight: '100vh', background: 'var(--color-background-tertiary, #f4f5f7)', width: '100%', maxWidth: '100vw', overflowX: 'hidden' },
  sidebar: { width: 210, background: 'var(--glass-bg)', WebkitBackdropFilter: 'blur(var(--glass-blur))', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', borderRadius: 24, boxShadow: 'var(--glass-shadow)', padding: '20px 12px', margin: 12, display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 12, height: 'calc(100vh - 24px)', overflowY: 'auto' },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px', marginBottom: 20 },
  logoText: { fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' },
  navLabel: { fontSize: 10, color: 'var(--color-text-tertiary)', padding: '12px 12px 4px', textTransform: 'uppercase', letterSpacing: 0.6 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, fontSize: 13, color: 'var(--color-text-secondary)', background: 'transparent', border:'none', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'background 0.2s ease, color 0.2s ease' },
  navActive: { background: 'var(--accent-glow)', color: 'var(--color-text-primary)', fontWeight: 500, boxShadow: '0 0 12px var(--accent-glow)' },
  navBadge: { background: '#993C1D', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 600 },
  userRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px 4px', marginTop: 'auto', borderTop: '0.5px solid var(--color-border-tertiary)' },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#534AB7', flexShrink: 0 },
  userName: { fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' },
  userRole: { fontSize: 11, color: 'var(--color-text-tertiary)' },
  main: { flex: 1, padding: 28, overflowY: 'auto', minWidth: 0, width: 0, maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  pageTitle: { fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 },
  monthNav: { display: 'flex', alignItems: 'center', gap: 10 },
  monthBtn: { width: 28, height: 28, borderRadius: '50%', border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)', cursor: 'pointer', fontSize: 16, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  monthLabel: { fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', minWidth: 120, textAlign: 'center' },
  addBtn: { position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'linear-gradient(135deg, var(--accent-primary), #534AB7)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 13, cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 16px var(--accent-glow)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
  formCard: { background: 'var(--color-background-primary)', border: '0.5px solid #AFA9EC', borderRadius: 12, padding: 20, marginBottom: 20 },
  formTitle: { fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 14 },
  formRow: { display: 'flex', gap: 10, marginBottom: 10 },
  select: { flex: 1, padding: '9px 12px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' },
  input: { flex: 1, padding: '9px 12px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start', width: '100%', boxSizing: 'border-box' },
  balanceCard: { borderRadius: 14, padding: '14px 16px', background: 'linear-gradient(135deg, #7F77DD 0%, #534AB7 100%)', color: '#fff', marginBottom: 16, position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' },
  balanceLabel: { fontSize: 12, opacity: 0.75, marginBottom: 6 },
  balanceAmount: { fontSize: 28, fontWeight: 500, marginBottom: 14 },
  balanceRow: { display: 'flex', gap: 24 },
  balanceSub: { display: 'flex', flexDirection: 'column', gap: 2 },
  balanceSubLabel: { fontSize: 11, opacity: 0.7 },
  balanceSubVal: { fontSize: 15, fontWeight: 500 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20, maxWidth: '100%' },
  statCard: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: '12px 10px', minWidth: 0, overflow: 'hidden' },
  statIcon: { width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statLabel: { fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 4 },
  statVal: { fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  statChange: { fontSize: 11, marginTop: 4 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' },
  seeAll: { fontSize: 12, color: '#7F77DD', cursor: 'pointer' },
  txCard: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12 },
  txRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: '0.5px solid var(--color-border-tertiary)' },
  txIcon: { width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txInfo: { flex: 1, minWidth: 0 },
  txName: { fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' },
  txDate: { fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' },
  txAmount: { fontSize: 13, fontWeight: 500, flexShrink: 0, minWidth: 60, textAlign: 'right' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '2px', borderRadius: 6, display: 'flex', alignItems: 'center' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 14 },
  rightCard: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16 },
  bars: { display: 'flex', alignItems: 'flex-end', gap: 6, height: 70, marginTop: 14 },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: '3px 3px 0 0', minHeight: 4, transition: 'height 0.3s' },
  barLabel: { fontSize: 10, color: 'var(--color-text-tertiary)' },
  aiCard: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: 16 },
  aiBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EEEDFE', color: '#534AB7', fontSize: 11, padding: '4px 10px', borderRadius: 20, marginBottom: 10 },
  aiText: { fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 12 },
  aiBtn: { fontSize: 12, color: '#7F77DD', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 },
  msgsCard: { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, overflow: 'hidden' },
  msgRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: '0.5px solid var(--color-border-tertiary)', cursor: 'pointer', transition: 'background 0.15s' },
  msgLeft: { display: 'flex', gap: 12, flex: 1 },
  msgAvatar: { width: 38, height: 38, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgFrom: { fontSize: 11, color: '#534AB7', fontWeight: 500, marginBottom: 5 },
  msgText: { fontSize: 13, color: 'var(--color-text-primary)', lineHeight: 1.6 },
  msgDate: { fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 6 },
  unreadPill: { background: '#7F77DD', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600, flexShrink: 0, height: 'fit-content' },
  userRowBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px 4px', marginTop: 'auto', borderTop: '0.5px solid var(--color-border-tertiary)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderRadius: 8,},
  avatarImg: {width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'},
  challengeWidget: { background: 'linear-gradient(135deg, #534AB7, #7F77DD)', borderRadius: 12, padding: 16, color: '#fff' },
  challengeHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  challengeTitle: { fontSize: 13, fontWeight: 600 },
  challengeSub: { fontSize: 10, opacity: 0.65, marginTop: 2 },
  challengeDesc: { fontSize: 13, lineHeight: 1.5, opacity: 0.9, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px' },
  challengeBar: { height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  challengeBarFill: { height: '100%', background: '#fff', borderRadius: 3, transition: 'width 0.4s ease' },
  challengeBtn: { marginTop: 12, fontSize: 12, color: '#fff', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 500, width: '100%' },
  mobileTopBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)', position: 'sticky', top: 0, zIndex: 50 },
  mobileAddBtn: { width: 36, height: 36, borderRadius: 9, background: '#7F77DD', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--color-background-primary)', borderTop: '0.5px solid var(--color-border-tertiary)', display: 'flex', zIndex: 100, paddingBottom: 'env(safe-area-inset-bottom, 0px)' },
  bottomNavItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 4px 10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', position: 'relative', gap: 3, minHeight: 56 },
  bottomNavActive: { color: '#534AB7' },
  mobileMoreDrawer: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
  mobileMoreContent: { background: 'var(--color-background-primary)', borderRadius: '16px 16px 0 0', padding: '20px 16px 36px' },
  moreDrawerItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderRadius: 10, fontSize: 15, color: 'var(--color-text-primary)', textAlign: 'left' },
  moreDrawerActive: { background: '#EEEDFE', color: '#534AB7' },
  footer: { display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', padding: '24px 0 8px', marginTop: 20, borderTop: '0.5px solid var(--color-border-tertiary)', flexWrap: 'wrap' },
  footerText: { fontSize: 12, color: 'var(--color-text-tertiary)' },
  footerDot: { fontSize: 12, color: 'var(--color-border-tertiary)' },
  footerLink: { fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'none' },
  betaBadge: { display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EEEDFE', color: '#534AB7', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, padding: '3px 8px', borderRadius: 20, border: 'none', cursor: 'pointer' },
  betaDot: { width: 6, height: 6, borderRadius: '50%', background: '#7F77DD', display: 'inline-block', boxShadow: '0 0 0 2px rgba(127,119,221,0.3)' },
  safeCard: { borderRadius: 14, padding: '14px 16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', marginBottom: 16, boxShadow: '0 1px 3px rgba(16, 185, 129, 0.15)', width: '100%', boxSizing: 'border-box', position: 'relative' },
  safeLabel: { fontSize: 12, opacity: 0.85, marginBottom: 6, fontWeight: 500 },
  safeAmount: { fontSize: 30, fontWeight: 600, marginBottom: 4 },
  safeSubtext: { fontSize: 12, opacity: 0.85 },
  safeIcon: { fontSize: 28, opacity: 0.9 },
  safeTooltip: { position: 'absolute', top: 'calc(100% + 12px)', left: 0, right: 0, background: 'rgba(6, 78, 59, 0.98)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: '14px 16px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', zIndex: 10, fontSize: 13, border: '1px solid rgba(255,255,255,0.1)' },
  tooltipHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 12, fontWeight: 600, opacity: 0.9 },
  tooltipClose: { background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1, opacity: 0.6 },
  tooltipRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 13 },
  tooltipLabel: { opacity: 0.8 },
  tooltipValue: { fontWeight: 500 },
  tooltipFooter: { marginTop: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, lineHeight: 1.5 }
}
