import { Link, NavLink } from 'react-router-dom'
import BrandLogo from '../brand/BrandLogo'
import PublicChatbot from './PublicChatbot'
import { companyInfo } from '../../data/companyInfo'

function PublicNavbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-bold transition-colors ${isActive ? 'text-blue-700' : 'text-slate-600 hover:text-slate-950'}`

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <BrandLogo className="h-12 w-44 rounded-xl bg-white shadow-sm sm:w-52" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>Accueil</NavLink>
          <NavLink to="/catalogue" className={linkClass}>Produits</NavLink>
          <NavLink to="/catalogue-aluminium" className={linkClass}>Aluminium</NavLink>
          <NavLink to="/login" className={linkClass}>Connexion</NavLink>
          <NavLink to="/register-client" className={linkClass}>Inscription client</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-secondary hidden sm:inline-flex">Se connecter</Link>
          <Link to="/register-client" className="btn-primary">Créer un compte</Link>
        </div>
      </div>
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 lg:grid-cols-[1.1fr_1.4fr_0.9fr]">
        <div>
          <BrandLogo className="mb-4 h-16 w-56 rounded-2xl bg-white p-1.5" />
          <p className="text-sm leading-6 text-slate-300">
            {companyInfo.officialName}, spécialiste aluminium et acier avec agences à Sfax, Gabes et Djerba.
          </p>
          <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
            {companyInfo.category}
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3">Agences</p>
          <div className="space-y-3 text-sm text-slate-300">
            {companyInfo.branches.map(branch => (
              <div key={branch.city}>
                <p className="font-bold text-white">{branch.city}</p>
                <p>{branch.address}</p>
                <p>Tél. : {branch.phone}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold mb-3">Coordonnées</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Tél. : {companyInfo.primaryPhone}</p>
            <p>Facebook : {companyInfo.facebookPage}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {companyInfo.officialName}. Tous droits réservés.
      </div>
    </footer>
  )
}

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNavbar />
      {children}
      <PublicFooter />
      <PublicChatbot />
    </div>
  )
}
