import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { clientAPI, produitsAPI } from '../../api/services'
import { EmptyState, PageHeader, SearchInput } from '../../components/ui'

export default function ClientProduitsPage() {
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [quantites, setQuantites] = useState({})
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    setLoading(true)
    produitsAPI.getAll()
      .then(r => setProduits(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const disponibles = useMemo(() => produits.filter(p => p.actif !== false && (p.stockActuel ?? 0) > 0), [produits])
  const filtered = disponibles.filter(p =>
    p.designation?.toLowerCase().includes(search.toLowerCase()) ||
    p.reference?.toLowerCase().includes(search.toLowerCase()) ||
    p.categorie?.toLowerCase().includes(search.toLowerCase())
  )

  const demanderAchat = async (produit) => {
    const quantite = Number(quantites[produit.id] || 1)
    if (!quantite || quantite <= 0) {
      toast.error('Quantite invalide')
      return
    }

    setSavingId(produit.id)
    try {
      await clientAPI.demanderAchat({
        produitId: produit.id,
        quantite,
        observations: `Demande client pour ${produit.reference} - ${produit.designation}`,
      })
      toast.success('Demande envoyee')
      setQuantites(q => ({ ...q, [produit.id]: 1 }))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="page-shell">
      <PageHeader title="Produits disponibles" subtitle={`${disponibles.length} produit(s) disponible(s)`} />

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Reference, designation, categorie..." />
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="loading-spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="Aucun produit disponible" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['Reference', 'Designation', 'Categorie', 'Prix', 'Stock', 'Quantite', 'Action'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="table-row">
                    <td className="table-cell font-mono text-xs">{p.reference}</td>
                    <td className="table-cell font-medium">{p.designation}</td>
                    <td className="table-cell"><span className="badge-gray">{p.categorie || '-'}</span></td>
                    <td className="table-cell font-medium text-blue-700">{(p.prixVente || 0).toFixed(3)} TND</td>
                    <td className="table-cell">{p.stockActuel} {p.unite}</td>
                    <td className="table-cell">
                      <input
                        type="number"
                        min="1"
                        max={p.stockActuel || undefined}
                        value={quantites[p.id] || 1}
                        onChange={e => setQuantites(q => ({ ...q, [p.id]: e.target.value }))}
                        className="input-field w-24"
                      />
                    </td>
                    <td className="table-cell">
                      <button
                        type="button"
                        onClick={() => demanderAchat(p)}
                        disabled={savingId === p.id}
                        className="btn-primary inline-flex items-center gap-2 text-sm py-2"
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        {savingId === p.id ? 'Envoi...' : 'Demander achat'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
