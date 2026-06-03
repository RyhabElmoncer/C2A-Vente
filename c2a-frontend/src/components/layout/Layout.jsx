import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../brand/BrandLogo'
import PublicChatbot from '../public/PublicChatbot'
import { companyInfo } from '../../data/companyInfo'
import {
  HomeIcon, UsersIcon, CubeIcon, DocumentTextIcon,
  ShoppingCartIcon, ReceiptPercentIcon, ArchiveBoxIcon,
  ArrowRightOnRectangleIcon, BellIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { ROLES, pageRoles, roleLabels } from '../../config/access'

const internalNavItems = [
  { to: '/dashboard',    label: 'Tableau de bord', icon: HomeIcon,             exact: true, roles: pageRoles.dashboard },
  { to: '/utilisateurs', label: 'Utilisateurs',     icon: ShieldCheckIcon,                 roles: pageRoles.utilisateurs },
  { to: '/clients',      label: 'Clients',          icon: UsersIcon,                       roles: pageRoles.clients },
  { to: '/produits',     label: 'Catalogue',        icon: CubeIcon,                        roles: pageRoles.produits },
  { to: '/devis',        label: 'Devis',            icon: DocumentTextIcon,                roles: pageRoles.devis },
  { to: '/commandes',    label: 'Commandes',        icon: ShoppingCartIcon,                roles: pageRoles.commandes },
  { to: '/factures',     label: 'Facturation',      icon: ReceiptPercentIcon,              roles: pageRoles.factures },
  { to: '/stock',        label: 'Stock',            icon: ArchiveBoxIcon,                  roles: pageRoles.stock },
]

const clientNavItems = [
  { to: '/client',          label: 'Mon espace', icon: HomeIcon, exact: true },
  { to: '/client/produits', label: 'Produits',   icon: CubeIcon },
]

const roleColors = {
  GERANT: 'badge-info',
  ADMIN: 'badge-danger',
  COMMERCIAL: 'badge-info',
  COMPTABLE: 'badge-success',
  MAGASINIER: 'badge-warning',
  AGENT_RECOUVREMENT: 'badge-gray',
  CLIENT: 'badge-info',
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navItems = user?.role === ROLES.CLIENT
    ? clientNavItems
    : internalNavItems.filter(item => item.roles.includes(user?.role))

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col border-r border-slate-800 bg-slate-950 text-white shadow-2xl transition-all duration-300`}>
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-3 py-5">
          <BrandLogo className={`${sidebarOpen ? 'h-12 w-36' : 'h-10 w-10'} flex-shrink-0 rounded-xl bg-white p-1 shadow-lg`} />
          {sidebarOpen && (
            <div>
              <p className="text-sm font-black leading-tight text-white">{companyInfo.officialName}</p>
              <p className="text-xs text-slate-400">{user?.role === ROLES.CLIENT ? 'Espace client' : 'ERP aluminium & acier'}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-lg shadow-blue-950/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-700">
                <span className="text-xs font-black text-white">{user?.nom?.[0]}{user?.prenom?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user?.nom} {user?.prenom}</p>
                <span className={roleColors[user?.role] || 'badge-gray'}>
                  {roleLabels[user?.role] || user?.role}
                </span>
              </div>
              <button onClick={handleLogout} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-red-300">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="flex w-full justify-center rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-red-300">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="icon-button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 sm:inline-flex">{user?.site || 'C2A'}</span>
            <button className="icon-button relative">
              <BellIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
        {user?.role === ROLES.CLIENT && <PublicChatbot />}
      </div>
    </div>
  )
}
