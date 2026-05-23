import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx' // Твій новий контекст
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DonateButton from './components/DonateButton.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import About from './pages/About.jsx'

function App() {
  // Тепер ми беремо дані з контексту, ніяких useState/useEffect тут не потрібно!
  const { user, loading } = useAuth()

  // Поки контекст перевіряє сесію — нічого не рендеримо
  if (loading) return null 

  // Якщо юзер є — значить авторизований
  const isAuth = !!user 

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} />
        
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
        
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/about" element={<About />} />
        
        <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} />
      </Routes>
      {isAuth && <DonateButton />}
    </>
  )
}

export default App