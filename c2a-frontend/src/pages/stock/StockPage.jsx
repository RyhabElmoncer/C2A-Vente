import { useEffect, useState } from 'react'
import { stockAPI, produitsAPI } from '../../api/services'
import { Modal, Badge, EmptyState, SearchInput, PageHeader, FormField } from '../../components/ui'
import toast from 'react-hot-toast'
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const TYPES = ['ENTREE', 'SORTIE', 'AJUSTEMENT', 'RETOUR']

export default function StockPage() {
  const [produits, setProduits] = useState([])
  const [ruptures, setRuptures] = useState([])
  const [mouvements, setMouvements] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [selProduit, setSelProduit] = useState(null)
  const [form, setForm] = useState({ produitId: '', type: 'ENTREE', quantite: 1, motif: '', reference: '' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([produitsAPI.getAll(), stockAPI.getRupture()])
      .then(([pr, ru]) => { setProduits(pr.data); setRuptures(ru.data) })
      .catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const loadMouvements = async (produitId) => {
    const { data } = await stockAPI.getMouvements(produitId)
    setMouvements(data)
  }

  const filtered = produits.filter(p =>
    p.designation?.toLowerCase().includes(search.toLowerCase()) ||
    p.reference?.toLowerCase().includes(search.toLowerCase())
  )

  const handleMouvement = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await stockAPI.enregistrerMouvement({ ...form, produitId: +form.produitId, quantite: +form.quantite })
      toast.success('Mouvement enregistré !'); setModal(null); load()
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader
        title="Gestion des stocks"
        subtitle={`${produits.length} produit(s) — ${ruptures.length} en rupture`}
        action={<button onClick={() => setModal('mouvement')} className="btn-primary flex items-center gap-2"><PlusIcon className="w-4 h-4" />Mouvement</button>}
      />

      {ruptures.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Alertes rupture de stock</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {ruptures.map(p => <span key={p.id} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{p.designation} ({p.stockActuel})</span>)}
            </div>
          </div>
        </div>
      )}

      <div className="card mb-4 flex gap-4 py-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Référence, désignation…" />
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          : filtered.length === 0 ? <EmptyState message="Aucun produit" /> : (
            <div className="overflow-x-auto"><table className="w-full">
              <thead><tr>{['Réf.', 'Désignation', 'Catégorie', 'Stock actuel', 'Stock min', 'Emplacement', 'Statut', 'Historique'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>{filtered.map(p => (
                <tr key={p.id} className={`table-row ${p.enRupture ? 'bg-red-50/30' : ''}`}>
                  <td className="table-cell font-mono text-xs">{p.reference}</td>
                  <td className="table-cell font-medium">{p.designation}</td>
                  <td className="table-cell"><span className="badge-gray">{p.categorie}</span></td>
                  <td className="table-cell">
                    <span className={`text-lg font-bold ${p.enRupture ? 'text-red-600' : 'text-gray-900'}`}>{p.stockActuel}</span>
                    <span className="text-gray-400 text-xs ml-1">{p.unite}</span>
                    {p.enRupture && <span className="ml-1 text-red-500">⚠</span>}
                  </td>
                  <td className="table-cell text-gray-500">{p.stockMin}</td>
                  <td className="table-cell text-gray-500">{p.emplacement || '—'}</td>
                  <td className="table-cell"><span className={p.enRupture ? 'badge-danger' : 'badge-success'}>{p.enRupture ? 'Rupture' : 'OK'}</span></td>
                  <td className="table-cell">
                    <button onClick={async () => { setSelProduit(p); await loadMouvements(p.id); setModal('historique') }}
                      className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded hover:bg-gray-100">Voir</button>
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
      </div>

      <Modal open={modal === 'mouvement'} onClose={() => setModal(null)} title="Nouveau mouvement de stock" size="md">
        <form onSubmit={handleMouvement} className="space-y-4">
          <FormField label="Produit" required>
            <select required value={form.produitId} onChange={e => setForm(f => ({ ...f, produitId: e.target.value }))} className="input-field">
              <option value="">Choisir un produit…</option>
              {produits.map(p => <option key={p.id} value={p.id}>{p.reference} — {p.designation}</option>)}
            </select>
          </FormField>
          <FormField label="Type de mouvement">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Quantité" required>
            <input required type="number" min="1" value={form.quantite} onChange={e => setForm(f => ({ ...f, quantite: +e.target.value }))} className="input-field" />
          </FormField>
          <FormField label="Motif">
            <input value={form.motif} onChange={e => setForm(f => ({ ...f, motif: e.target.value }))} className="input-field" />
          </FormField>
          <FormField label="Référence document">
            <input value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} className="input-field" />
          </FormField>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Enregistrement…' : 'Valider'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'historique'} onClose={() => setModal(null)} title={`Historique — ${selProduit?.designation}`} size="lg">
        {mouvements.length === 0 ? <EmptyState message="Aucun mouvement enregistré" /> : (
          <table className="w-full text-sm">
            <thead><tr>{['Date', 'Type', 'Qté', 'Avant', 'Après', 'Motif', 'Utilisateur'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
            <tbody>{mouvements.map(m => (
              <tr key={m.id} className="table-row">
                <td className="table-cell text-xs text-gray-500">{m.dateOperation?.slice(0, 16)}</td>
                <td className="table-cell"><Badge statut={m.type} /></td>
                <td className="table-cell font-medium">{m.quantite}</td>
                <td className="table-cell text-gray-500">{m.stockAvant}</td>
                <td className="table-cell font-medium">{m.stockApres}</td>
                <td className="table-cell text-gray-500">{m.motif || '—'}</td>
                <td className="table-cell text-gray-500">{m.utilisateurNom || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Modal>
    </div>
  )
}
