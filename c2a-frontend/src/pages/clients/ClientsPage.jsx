import { useEffect, useState } from 'react'
import { clientsAPI } from '../../api/services'
import { Modal, Badge, EmptyState, SearchInput, PageHeader, FormField } from '../../components/ui'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

const SITES = ['Sfax', 'Gabes', 'Djerba']

function ClientForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial || {
    nom: '', raisonSociale: '', telephone: '', email: '',
    adresse: '', ville: '', codePostal: '', site: 'Sfax',
    creditMax: 0, matriculeFiscal: ''
  })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await onSubmit(form) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nom / Prénom" required>
          <input required value={form.nom} onChange={e => set('nom', e.target.value)} className="input-field" placeholder="Nom complet" />
        </FormField>
        <FormField label="Raison sociale">
          <input value={form.raisonSociale} onChange={e => set('raisonSociale', e.target.value)} className="input-field" placeholder="Société SARL…" />
        </FormField>
        <FormField label="Téléphone" required>
          <input required value={form.telephone} onChange={e => set('telephone', e.target.value)} className="input-field" placeholder="XX XXX XXX" />
        </FormField>
        <FormField label="Email">
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" placeholder="client@email.com" />
        </FormField>
        <FormField label="Matricule fiscal">
          <input value={form.matriculeFiscal} onChange={e => set('matriculeFiscal', e.target.value)} className="input-field" />
        </FormField>
        <FormField label="Site" required>
          <select required value={form.site} onChange={e => set('site', e.target.value)} className="input-field">
            {SITES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Adresse">
          <input value={form.adresse} onChange={e => set('adresse', e.target.value)} className="input-field" />
        </FormField>
        <FormField label="Ville">
          <input value={form.ville} onChange={e => set('ville', e.target.value)} className="input-field" />
        </FormField>
        <FormField label="Code postal">
          <input value={form.codePostal} onChange={e => set('codePostal', e.target.value)} className="input-field" />
        </FormField>
        <FormField label="Crédit max (TND)">
          <input type="number" min="0" value={form.creditMax} onChange={e => set('creditMax', +e.target.value)} className="input-field" />
        </FormField>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | { type:'edit', item } | { type:'view', item }

  const load = () => {
    setLoading(true)
    clientsAPI.getAll().then(r => setClients(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = clients.filter(c =>
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.telephone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (data) => {
    await clientsAPI.create(data)
    toast.success('Client créé !')
    setModal(null); load()
  }

  const handleUpdate = async (data) => {
    await clientsAPI.update(modal.item.id, data)
    toast.success('Client mis à jour !')
    setModal(null); load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Désactiver ce client ?')) return
    await clientsAPI.delete(id)
    toast.success('Client désactivé')
    load()
  }

  const fmt = (n) => new Intl.NumberFormat('fr-TN').format(n || 0)

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} client(s) enregistré(s)`}
        action={
          <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> Nouveau client
          </button>
        }
      />

      {/* Filters */}
      <div className="card mb-4 flex items-center gap-4 py-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un client…" />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>
        ) : filtered.length === 0 ? <EmptyState message="Aucun client trouvé" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['Nom', 'Téléphone', 'Email', 'Site', 'Crédit max', 'Créance', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell font-medium">
                      <div>{c.nom}</div>
                      {c.raisonSociale && <div className="text-xs text-gray-400">{c.raisonSociale}</div>}
                    </td>
                    <td className="table-cell">{c.telephone}</td>
                    <td className="table-cell text-gray-500">{c.email || '—'}</td>
                    <td className="table-cell"><span className="badge-info">{c.site}</span></td>
                    <td className="table-cell">{fmt(c.creditMax)} TND</td>
                    <td className="table-cell">
                      <span className={c.soldeCreance > 0 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
                        {fmt(c.soldeCreance)} TND
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={c.actif ? 'badge-success' : 'badge-danger'}>{c.actif ? 'Actif' : 'Inactif'}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => setModal({ type: 'view', item: c })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setModal({ type: 'edit', item: c })} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Nouveau client" size="lg">
        <ClientForm onSubmit={handleCreate} onClose={() => setModal(null)} />
      </Modal>

      <Modal open={modal?.type === 'edit'} onClose={() => setModal(null)} title="Modifier le client" size="lg">
        {modal?.type === 'edit' && (
          <ClientForm initial={modal.item} onSubmit={handleUpdate} onClose={() => setModal(null)} />
        )}
      </Modal>

      <Modal open={modal?.type === 'view'} onClose={() => setModal(null)} title="Détails client" size="md">
        {modal?.type === 'view' && (
          <div className="space-y-3 text-sm">
            {[
              ['Nom', modal.item.nom], ['Raison sociale', modal.item.raisonSociale],
              ['Téléphone', modal.item.telephone], ['Email', modal.item.email],
              ['Adresse', modal.item.adresse], ['Ville', modal.item.ville],
              ['Site', modal.item.site], ['Crédit max', fmt(modal.item.creditMax) + ' TND'],
              ['Créance', fmt(modal.item.soldeCreance) + ' TND'],
            ].map(([k, v]) => v && (
              <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
