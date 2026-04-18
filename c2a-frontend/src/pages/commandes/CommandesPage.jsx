import { useEffect, useState } from 'react'
import { commandesAPI } from '../../api/services'
import { Badge, EmptyState, SearchInput, PageHeader } from '../../components/ui'
import toast from 'react-hot-toast'

const nextStatut = { EN_ATTENTE: 'CONFIRMEE', CONFIRMEE: 'EN_PREPARATION', EN_PREPARATION: 'EXPEDIEE', EXPEDIEE: 'LIVREE' }
const STATUTS = ['EN_ATTENTE', 'CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE']

export default function CommandesPage() {
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')

  const load = () => { setLoading(true); commandesAPI.getAll().then(r => setCommandes(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])

  const filtered = commandes.filter(c =>
    (c.numero?.includes(search) || c.client?.nom?.toLowerCase().includes(search.toLowerCase())) &&
    (statut === '' || c.statut === statut)
  )

  const handleStatut = async (id, s) => { await commandesAPI.changerStatut(id, s); toast.success(`→ ${s}`); load() }

  return (
    <div>
      <PageHeader title="Commandes" subtitle={`${commandes.length} commande(s)`} />
      <div className="card mb-4 flex gap-4 py-4 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Numéro, client…" />
        <select value={statut} onChange={e => setStatut(e.target.value)} className="input-field w-48">
          <option value="">Tous statuts</option>
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="card p-0 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          : filtered.length === 0 ? <EmptyState message="Aucune commande" /> : (
            <div className="overflow-x-auto"><table className="w-full">
              <thead><tr>{['Numéro', 'Client', 'Site', 'Date', 'Livraison prévue', 'Montant TTC', 'Statut', 'Action'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>{filtered.map(c => (
                <tr key={c.id} className="table-row">
                  <td className="table-cell font-mono font-medium">{c.numero}</td>
                  <td className="table-cell">{c.client?.nom}</td>
                  <td className="table-cell"><span className="badge-info">{c.site}</span></td>
                  <td className="table-cell text-gray-500">{c.dateCommande}</td>
                  <td className="table-cell text-gray-500">{c.dateLivraisonPrevue || '—'}</td>
                  <td className="table-cell font-medium text-blue-700">{(c.montantTTC || 0).toFixed(3)} TND</td>
                  <td className="table-cell"><Badge statut={c.statut} /></td>
                  <td className="table-cell">
                    {nextStatut[c.statut] && (
                      <button onClick={() => handleStatut(c.id, nextStatut[c.statut])} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100">
                        → {nextStatut[c.statut].replace(/_/g, ' ')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
      </div>
    </div>
  )
}
