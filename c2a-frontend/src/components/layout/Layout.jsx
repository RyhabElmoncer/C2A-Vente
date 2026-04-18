import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  HomeIcon, UsersIcon, CubeIcon, DocumentTextIcon,
  ShoppingCartIcon, ReceiptPercentIcon, ArchiveBoxIcon,
  ArrowRightOnRectangleIcon, BellIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

const navItems = [
  { to: '/',          label: 'Tableau de bord', icon: HomeIcon,             exact: true },
  { to: '/clients',   label: 'Clients',          icon: UsersIcon },
  { to: '/produits',  label: 'Catalogue',        icon: CubeIcon },
  { to: '/devis',     label: 'Devis',            icon: DocumentTextIcon },
  { to: '/commandes', label: 'Commandes',        icon: ShoppingCartIcon },
  { to: '/factures',  label: 'Facturation',      icon: ReceiptPercentIcon },
  { to: '/stock',     label: 'Stock',            icon: ArchiveBoxIcon },
]

const roleColors = {
  GERANT: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-red-100 text-red-800',
  COMMERCIAL: 'bg-blue-100 text-blue-800',
  COMPTABLE: 'bg-green-100 text-green-800',
  MAGASINIER: 'bg-orange-100 text-orange-800',
  AGENT_RECOUVREMENT: 'bg-yellow-100 text-yellow-800',
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">C2A</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">Gestion Ventes</p>
              <p className="text-xs text-gray-500">C2A — Sfax</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{user?.nom?.[0]}{user?.prenom?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.nom} {user?.prenom}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleColors[user?.role] || 'bg-gray-100 text-gray-700'}`}>
                  {user?.role}
                </span>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center text-gray-400 hover:text-red-500">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user?.site}</span>
            <button className="relative text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100">
              <BellIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
