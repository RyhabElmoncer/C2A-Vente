import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import AuthShell from '../../components/auth/AuthShell'
import { companyInfo } from '../../data/companyInfo'

const initialForm = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  password: '',
  confirmPassword: '',
}

function getErrorMessage(error) {
  const data = error.response?.data
  if (data?.message) return data.message
  if (data && typeof data === 'object') {
    const first = Object.values(data).find(Boolean)
    if (first) return first
  }
  return 'Impossible de créer le compte'
}

export default function RegisterClientPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  const validate = () => {
    if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.telephone.trim() || !form.password || !form.confirmPassword) {
      return 'Tous les champs sont obligatoires'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Adresse email invalide'
    }
    if (form.password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caracteres'
    }
    if (form.password !== form.confirmPassword) {
      return 'La confirmation du mot de passe ne correspond pas'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register-client', {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim().toLowerCase(),
        telephone: form.telephone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      }, { skipGlobalErrorToast: true })
      toast.success('Compte client créé. Vous pouvez vous connecter.')
      navigate('/login')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Espace client"
      title="Créer un compte"
      subtitle={`Inscrivez-vous pour consulter le catalogue ${companyInfo.shortName} et envoyer vos demandes d'achat à l'équipe commerciale.`}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nom</label>
          <input
            required
            autoComplete="family-name"
            value={form.nom}
            onChange={e => set('nom', e.target.value)}
            className="input-field py-3"
          />
        </div>

        <div>
          <label className="label">Prénom</label>
          <input
            required
            autoComplete="given-name"
            value={form.prenom}
            onChange={e => set('prenom', e.target.value)}
            className="input-field py-3"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Adresse email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            className="input-field py-3"
            placeholder="client@email.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Téléphone</label>
          <input
            required
            type="tel"
            autoComplete="tel"
            value={form.telephone}
            onChange={e => set('telephone', e.target.value)}
            className="input-field py-3"
            placeholder="XX XXX XXX"
          />
        </div>

        <div>
          <label className="label">Mot de passe</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            className="input-field py-3"
          />
        </div>

        <div>
          <label className="label">Confirmation</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={e => set('confirmPassword', e.target.value)}
            className="input-field py-3"
          />
        </div>

        {error && (
          <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="sm:col-span-2 space-y-4 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
          <p className="text-center text-sm text-slate-500">
            Déjà inscrit ?{' '}
            <Link to="/login" className="font-bold text-blue-700 hover:text-blue-900">
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}
