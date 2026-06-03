import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../../components/auth/AuthShell'
import { companyInfo } from '../../data/companyInfo'
import { homeFor } from '../../config/access'

const demoAccounts = [
  { label: 'Gérant', email: 'gerant@c2a.tn', pass: 'gerant123' },
  { label: 'Commercial', email: 'commercial@c2a.tn', pass: 'commercial123' },
  { label: 'Comptable', email: 'comptable@c2a.tn', pass: 'comptable123' },
  { label: 'Recouvrement', email: 'agent@c2a.tn', pass: 'agent1234' },
  { label: 'Stock', email: 'stock@c2a.tn', pass: 'stock123' },
  { label: 'Client', email: 'client@c2a.tn', pass: 'client123' },
  { label: 'Admin', email: 'admin@c2a.tn', pass: 'admin123' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      toast.success('Connexion réussie !')
      navigate(homeFor(data))
    } catch {
      toast.error('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Accès sécurisé"
      title="Connexion"
      subtitle={`Connectez-vous à votre espace ${companyInfo.officialName} pour accéder aux opérations commerciales et au suivi client.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Adresse email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="input-field py-3"
            placeholder="vous@c2a.tn"
          />
        </div>

        <div>
          <label className="label">Mot de passe</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="input-field py-3"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
        <span className="text-sm text-slate-500">Nouveau client ? </span>
        <Link to="/register-client" className="text-sm font-bold text-blue-700 hover:text-blue-900">
          Créer un compte
        </Link>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Comptes de démonstration</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {demoAccounts.map(({ label, email, pass }) => (
            <button
              key={label}
              type="button"
              onClick={() => setForm({ email, password: pass })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  )
}
