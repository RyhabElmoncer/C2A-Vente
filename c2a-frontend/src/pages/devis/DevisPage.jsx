import { useEffect, useState } from 'react'
import { devisAPI, clientsAPI, produitsAPI } from '../../api/services'
import { Modal, Badge, EmptyState, SearchInput, PageHeader, FormField } from '../../components/ui'
import toast from 'react-hot-toast'
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

function LignesForm({ lignes, setLignes, produits }) {
  const add = () => setLignes(l => [...l, { produitId: '', quantite: 1, prixUnitaire: 0, remise: 0 }])
  const remove = (i) => setLignes(l => l.filter((_, idx) => idx !== i))
  const set = (i, k, v) => setLignes(l => l.map((x, idx) => idx === i ? { ...x, [k]: v } : x))
  const total = lignes.reduce((a, l) => a + l.quantite * l.prixUnitaire * (1 - l.remise / 100), 0)
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="label">Lignes</span>
        <button type="button" onClick={add} className="text-xs text-blue-600 flex items-center gap-1"><PlusIcon className="w-3 h-3" />Ajouter</button>
      </div>
      {lignes.map((l, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg p-2 mb-2">
          <div className="col-span-5">
            <select value={l.produitId} onChange={e => { const p = produits.find(p => p.id === +e.target.value); set(i, 'produitId', e.target.value); if (p) set(i, 'prixUnitaire', p.prixVente) }} className="input-field text-xs">
              <option value="">Produit…</option>
              {produits.map(p => <option key={p.id} value={p.id}>{p.reference} — {p.designation}</option>)}
            </select>
          </div>
          <div className="col-span-2"><input type="number" min="0.001" step="0.001" value={l.quantite} onChange={e => set(i, 'quantite', +e.target.value)} className="input-field text-xs" placeholder="Qté" /></div>
          <div className="col-span-2"><input type="number" min="0" step="0.001" value={l.prixUnitaire} onChange={e => set(i, 'prixUnitaire', +e.target.value)} className="input-field text-xs" placeholder="PU" /></div>
          <div className="col-span-1"><input type="number" min="0" max="100" value={l.remise} onChange={e => set(i, 'remise', +e.target.value)} className="input-field text-xs" placeholder="%" /></div>
          <div className="col-span-1 text-xs text-right font-medium">{(l.quantite * l.prixUnitaire * (1 - l.remise / 100)).toFixed(2)}</div>
          <div className="col-span-1 text-right"><button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-lg">×</button></div>
        </div>
      ))}
      <div className="flex justify-end text-sm font-semibold">Total HT : {total.toFixed(3)} TND</div>
    </div>
  )
}

export default function DevisPage() {
  const [devis, setDevis] = useState([])
  const [clients, setClients] = useState([])
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ clientId: '', remiseGlobale: 0, tva: 19, observations: '', conditionsPaiement: '30 jours' })
  const [lignes, setLignes] = useState([])
  const [saving, setSaving] = useState(false)

  const load = () => { setLoading(true); devisAPI.getAll().then(r => setDevis(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => {
    load()
    clientsAPI.getAll().then(r => setClients(r.data)).catch(() => {})
    produitsAPI.getAll().then(r => setProduits(r.data)).catch(() => {})
  }, [])

  const filtered = devis.filter(d => d.numero?.includes(search) || d.client?.nom?.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!lignes.length) { toast.error('Ajoutez au moins une ligne'); return }
    setSaving(true)
    try {
      await devisAPI.create({ ...form, clientId: +form.clientId, lignes: lignes.map(l => ({ produitId: +l.produitId, quantite: +l.quantite, prixUnitaire: +l.prixUnitaire, remise: +l.remise })) })
      toast.success('Devis créé !'); setModal(null); load()
    } finally { setSaving(false) }
  }

  const handleStatut = async (id, statut) => { await devisAPI.changerStatut(id, statut); toast.success(`→ ${statut}`); load() }
  const handleConvertir = async (id) => {
    if (!confirm('Convertir en commande ?')) return
    await devisAPI.convertir(id); toast.success('Commande créée !'); load()
  }

  return (
    <div>
      <PageHeader title="Devis" subtitle={`${devis.length} devis`}
        action={<button onClick={() => { setModal('create'); setLignes([]) }} className="btn-primary flex items-center gap-2"><PlusIcon className="w-4 h-4" />Nouveau devis</button>} />
      <div className="card mb-4 flex gap-4 py-4"><SearchInput value={search} onChange={setSearch} placeholder="Numéro, client…" /></div>
      <div className="card p-0 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          : filtered.length === 0 ? <EmptyState message="Aucun devis" /> : (
            <div className="overflow-x-auto"><table className="w-full">
              <thead><tr>{['Numéro', 'Client', 'Date', 'Validité', 'Montant TTC', 'Statut', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>{filtered.map(d => (
                <tr key={d.id} className="table-row">
                  <td className="table-cell font-mono font-medium">{d.numero}</td>
                  <td className="table-cell">{d.client?.nom}</td>
                  <td className="table-cell text-gray-500">{d.dateCreation}</td>
                  <td className="table-cell text-gray-500">{d.dateValidite}</td>
                  <td className="table-cell font-medium text-blue-700">{(d.montantTTC || 0).toFixed(3)} TND</td>
                  <td className="table-cell"><Badge statut={d.statut} /></td>
                  <td className="table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {d.statut === 'BROUILLON' && <button onClick={() => handleStatut(d.id, 'ENVOYE')} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Envoyer</button>}
                      {d.statut === 'ENVOYE' && <button onClick={() => handleStatut(d.id, 'VALIDE')} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Valider</button>}
                      {d.statut === 'VALIDE' && <button onClick={() => handleConvertir(d.id)} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded flex items-center gap-1"><ArrowPathIcon className="w-3 h-3" />Convertir</button>}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
      </div>
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Nouveau devis" size="xl">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Client" required>
              <select required value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} className="input-field">
                <option value="">Choisir…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </FormField>
            <FormField label="Conditions paiement"><input value={form.conditionsPaiement} onChange={e => setForm(f => ({ ...f, conditionsPaiement: e.target.value }))} className="input-field" /></FormField>
            <FormField label="Remise globale (%)"><input type="number" min="0" max="100" value={form.remiseGlobale} onChange={e => setForm(f => ({ ...f, remiseGlobale: +e.target.value }))} className="input-field" /></FormField>
            <FormField label="TVA (%)"><input type="number" min="0" value={form.tva} onChange={e => setForm(f => ({ ...f, tva: +e.target.value }))} className="input-field" /></FormField>
            <div className="col-span-2"><FormField label="Observations"><textarea value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} className="input-field" rows={2} /></FormField></div>
          </div>
          <LignesForm lignes={lignes} setLignes={setLignes} produits={produits} />
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Création…' : 'Créer le devis'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
