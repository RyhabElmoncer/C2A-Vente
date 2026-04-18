import { useEffect, useState } from 'react'
import { dashboardAPI } from '../../api/services'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  CurrencyDollarIcon, ShoppingCartIcon, UsersIcon,
  ExclamationTriangleIcon, BanknotesIcon, ClockIcon
} from '@heroicons/react/24/outline'

const fmt = (n) => new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(n || 0)

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.get().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/>
    </div>
  )

  const stats = [
    { label: 'CA ce mois', value: fmt(data?.chiffreAffairesMois), icon: CurrencyDollarIcon, color: 'bg-blue-50 text-blue-600', sub: `Annuel : ${fmt(data?.chiffreAffairesAnnee)}` },
    { label: 'Commandes / mois', value: data?.nombreCommandesMois ?? 0, icon: ShoppingCartIcon, color: 'bg-green-50 text-green-600' },
    { label: 'Clients actifs', value: data?.nombreClientsActifs ?? 0, icon: UsersIcon, color: 'bg-purple-50 text-purple-600' },
    { label: 'Encaissements / mois', value: fmt(data?.encaissementsMois), icon: BanknotesIcon, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Créances totales', value: fmt(data?.totalCreances), icon: ClockIcon, color: 'bg-orange-50 text-orange-600' },
    { label: 'Produits en rupture', value: data?.nombreProduitsRupture ?? 0, icon: ExclamationTriangleIcon, color: 'bg-red-50 text-red-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble des performances C2A</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ventes par mois */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Chiffre d'affaires — 12 mois</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.ventesParMois || []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="montant" fill="#3b82f6" radius={[4,4,0,0]} name="Montant TTC" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Commandes par mois */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Nombre de commandes — 12 mois</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data?.ventesParMois || []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="nombreCommandes" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Commandes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top clients & produits */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top clients</h2>
          {(data?.topClients || []).length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">Aucune donnée</p>
            : <table className="w-full text-sm">
                <thead><tr>
                  <th className="text-left py-2 text-gray-500 font-medium">Client</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Commandes</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Total achats</th>
                </tr></thead>
                <tbody>
                  {data.topClients.map((c, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="py-2 font-medium">{c.nomClient}</td>
                      <td className="py-2 text-right text-gray-600">{c.nombreCommandes}</td>
                      <td className="py-2 text-right text-blue-700 font-medium">{fmt(c.totalAchats)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top produits</h2>
          {(data?.topProduits || []).length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">Aucune donnée</p>
            : <table className="w-full text-sm">
                <thead><tr>
                  <th className="text-left py-2 text-gray-500 font-medium">Produit</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Qté vendue</th>
                  <th className="text-right py-2 text-gray-500 font-medium">CA</th>
                </tr></thead>
                <tbody>
                  {data.topProduits.map((p, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="py-2 font-medium">{p.designation}</td>
                      <td className="py-2 text-right text-gray-600">{p.quantiteVendue}</td>
                      <td className="py-2 text-right text-blue-700 font-medium">{fmt(p.chiffreAffaires)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>
    </div>
  )
}
