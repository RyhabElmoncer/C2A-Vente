import { Link } from 'react-router-dom'
import { CubeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import { PageHeader } from '../../components/ui'

export default function ClientHomePage() {
  const { user } = useAuth()

  return (
    <div className="page-shell">
      <PageHeader
        title="Espace client"
        subtitle={`Bonjour ${user?.prenom || user?.nom || ''}, consultez le catalogue et envoyez vos demandes d'achat.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/client/produits" className="card transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <CubeIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-slate-950">Produits disponibles</h2>
              <p className="mt-0.5 text-sm text-slate-500">Voir le catalogue et demander un achat.</p>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-slate-950">Demandes d'achat</h2>
              <p className="mt-0.5 text-sm text-slate-500">Vos demandes sont transmises a l'equipe commerciale.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
