import { useEffect, useState } from 'react'
import { produitsAPI } from '../../api/services'
import { Modal, EmptyState, SearchInput, PageHeader, FormField } from '../../components/ui'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const CATEGORIES = ['ALUMINIUM', 'INOX', 'BOIS', 'MDF', 'ACCESSOIRE']
const UNITES = ['ML', 'M2', 'KG', 'PIECE', 'M3', 'LITRE']

function ProduitForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial || { reference: '', designation: '', categorie: 'ALUMINIUM', prixAchat: '', prixVente: '', unite: 'ML', stockActuel: 0, stockMin: 5, emplacement: '' })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { await onSubmit(form) } finally { setSaving(false) } }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Référence" required><input required value={form.reference} onChange={e => set('reference', e.target.value)} className="input-field" placeholder="ALU-001" /></FormField>
        <FormField label="Catégorie"><select value={form.categorie} onChange={e => set('categorie', e.target.value)} className="input-field">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></FormField>
        <div className="col-span-2"><FormField label="Désignation" required><input required value={form.designation} onChange={e => set('designation', e.target.value)} className="input-field" /></FormField></div>
        <FormField label="Prix achat (TND)" required><input required type="number" step="0.001" min="0" value={form.prixAchat} onChange={e => set('prixAchat', +e.target.value)} className="input-field" /></FormField>
        <FormField label="Prix vente (TND)" required><input required type="number" step="0.001" min="0" value={form.prixVente} onChange={e => set('prixVente', +e.target.value)} className="input-field" /></FormField>
        <FormField label="Unité"><select value={form.unite} onChange={e => set('unite', e.target.value)} className="input-field">{UNITES.map(u => <option key={u}>{u}</option>)}</select></FormField>
        <FormField label="Stock min"><input type="number" min="0" value={form.stockMin} onChange={e => set('stockMin', +e.target.value)} className="input-field" /></FormField>
        {!initial && <FormField label="Stock initial"><input type="number" min="0" value={form.stockActuel} onChange={e => set('stockActuel', +e.target.value)} className="input-field" /></FormField>}
        <FormField label="Emplacement"><input value={form.emplacement} onChange={e => set('emplacement', e.target.value)} className="input-field" /></FormField>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </form>
  )
}

export default function ProduitsPage() {
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  const [modal, setModal] = useState(null)

  const load = () => { setLoading(true); produitsAPI.getAll().then(r => setProduits(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])

  const filtered = produits.filter(p =>
    (p.designation?.toLowerCase().includes(search.toLowerCase()) || p.reference?.toLowerCase().includes(search.toLowerCase())) &&
    (cat === '' || p.categorie === cat)
  )

  const handleCreate = async (data) => { await produitsAPI.create(data); toast.success('Produit créé !'); setModal(null); load() }
  const handleUpdate = async (data) => { await produitsAPI.update(modal.item.id, data); toast.success('Mis à jour !'); setModal(null); load() }

  return (
    <div className="page-shell">
      <PageHeader title="Catalogue produits" subtitle={`${produits.length} produit(s)`}
        action={<button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2"><PlusIcon className="w-4 h-4" />Nouveau produit</button>} />
      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Référence, désignation…" />
        <select value={cat} onChange={e => setCat(e.target.value)} className="input-field w-44">
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="text-sm text-red-600 flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4" />{produits.filter(p => p.enRupture).length} en rupture</span>
      </div>
      <div className="card p-0 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><div className="loading-spinner"/></div>
        : filtered.length === 0 ? <EmptyState message="Aucun produit" /> : (
          <div className="overflow-x-auto"><table className="w-full">
            <thead><tr>{['Réf.','Désignation','Catégorie','Prix achat','Prix vente','Unité','Stock','Statut',''].map(h=><th key={h} className="table-header">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className={`table-row ${p.enRupture ? 'bg-red-50/50' : ''}`}>
                  <td className="table-cell font-mono text-xs">{p.reference}</td>
                  <td className="table-cell font-medium">{p.designation}</td>
                  <td className="table-cell"><span className="badge-gray">{p.categorie}</span></td>
                  <td className="table-cell">{p.prixAchat?.toFixed(3)}</td>
                  <td className="table-cell font-medium text-blue-700">{p.prixVente?.toFixed(3)} TND</td>
                  <td className="table-cell">{p.unite}</td>
                  <td className="table-cell"><span className={p.enRupture ? 'text-red-600 font-bold' : ''}>{p.stockActuel} {p.enRupture && '⚠'}</span><span className="text-gray-400 text-xs ml-1">/ {p.stockMin}</span></td>
                  <td className="table-cell"><span className={p.actif ? 'badge-success' : 'badge-danger'}>{p.actif ? 'Actif' : 'Inactif'}</span></td>
                  <td className="table-cell"><button onClick={() => setModal({ type:'edit', item:p })} className="icon-button"><PencilIcon className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Nouveau produit" size="lg"><ProduitForm onSubmit={handleCreate} onClose={() => setModal(null)} /></Modal>
      <Modal open={modal?.type === 'edit'} onClose={() => setModal(null)} title="Modifier produit" size="lg">
        {modal?.type === 'edit' && <ProduitForm initial={modal.item} onSubmit={handleUpdate} onClose={() => setModal(null)} />}
      </Modal>
    </div>
  )
}
