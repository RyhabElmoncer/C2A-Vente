import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterClientPage from './pages/auth/RegisterClientPage'
import HomePage from './pages/public/HomePage'
import ProductCatalogPage from './pages/public/ProductCatalogPage'
import AluminiumCataloguePage from './pages/public/AluminiumCataloguePage'
import AluminiumProfileDetailPage from './pages/public/AluminiumProfileDetailPage'
import Dashboard from './pages/dashboard/Dashboard'
import ClientsPage from './pages/clients/ClientsPage'
import ProduitsPage from './pages/produits/ProduitsPage'
import DevisPage from './pages/devis/DevisPage'
import CommandesPage from './pages/commandes/CommandesPage'
import FacturesPage from './pages/factures/FacturesPage'
import StockPage from './pages/stock/StockPage'
import ClientHomePage from './pages/client/ClientHomePage'
import ClientProduitsPage from './pages/client/ClientProduitsPage'

const internalRoles = ['GERANT', 'ADMIN', 'COMMERCIAL', 'MAGASINIER', 'COMPTABLE', 'AGENT_RECOUVREMENT']

function homeFor(user) {
  if (!user) return '/'
  return user.role === 'CLIENT' ? '/client' : '/dashboard'
}

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-100"><div className="loading-spinner h-10 w-10"/></div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={homeFor(user)} replace />
  return children
}

function PublicHomeRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-100"><div className="loading-spinner h-10 w-10"/></div>
  return user ? <Navigate to={homeFor(user)} replace /> : children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={<PublicHomeRoute><HomePage /></PublicHomeRoute>} />
      <Route path="/home" element={<PublicHomeRoute><HomePage /></PublicHomeRoute>} />
      <Route path="/catalogue" element={<ProductCatalogPage />} />
      <Route path="/catalogue-aluminium" element={<AluminiumCataloguePage />} />
      <Route path="/catalogue-aluminium/:id" element={<AluminiumProfileDetailPage />} />
      <Route path="/login" element={user ? <Navigate to={homeFor(user)} replace /> : <LoginPage />} />
      <Route path="/register-client" element={user ? <Navigate to={homeFor(user)} replace /> : <RegisterClientPage />} />
      <Route path="/client" element={<PrivateRoute roles={['CLIENT']}><Layout /></PrivateRoute>}>
        <Route index element={<ClientHomePage />} />
        <Route path="produits" element={<ClientProduitsPage />} />
      </Route>
      <Route element={<PrivateRoute roles={internalRoles}><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/produits" element={<ProduitsPage />} />
        <Route path="/devis" element={<DevisPage />} />
        <Route path="/commandes" element={<CommandesPage />} />
        <Route path="/factures" element={<FacturesPage />} />
        <Route path="/stock" element={<StockPage />} />
      </Route>
      <Route path="*" element={<Navigate to={homeFor(user)} replace />} />
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
