import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ClientsPage from './pages/clients/ClientsPage'
import ProduitsPage from './pages/produits/ProduitsPage'
import DevisPage from './pages/devis/DevisPage'
import CommandesPage from './pages/commandes/CommandesPage'
import FacturesPage from './pages/factures/FacturesPage'
import StockPage from './pages/stock/StockPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="produits" element={<ProduitsPage />} />
        <Route path="devis" element={<DevisPage />} />
        <Route path="commandes" element={<CommandesPage />} />
        <Route path="factures" element={<FacturesPage />} />
        <Route path="stock" element={<StockPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
