import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DonateButton from './components/DonateButton.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import About from './pages/About.jsx'

const isAuth = () => !!localStorage.getItem('token')

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isAuth() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuth() ? "/dashboard" : "/login"} />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <DonateButton />
    </>
  )
}

export default App