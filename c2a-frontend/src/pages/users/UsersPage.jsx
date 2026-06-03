import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { usersAPI } from '../../api/services'
import { EmptyState, FormField, Modal, PageHeader, SearchInput } from '../../components/ui'
import { ROLES, roleLabels, roleOptions } from '../../config/access'

const SITES = ['Sfax', 'Gabes', 'Djerba']

function UserForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial || {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: ROLES.COMMERCIAL,
    site: 'Sfax',
    telephone: '',
    actif: true,
  })
  const [saving, setSaving] = useState(false)

  const set = (key, value) => setForm(current => ({ ...current, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSubmit(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Nom" required>
          <input required value={form.nom} onChange={e => set('nom', e.target.value)} className="input-field" />
        </FormField>
        <FormField label="Prenom" required>
          <input required value={form.prenom} onChange={e => set('prenom', e.target.value)} className="input-field" />
        </FormField>
        <FormField label="Email" required>
          <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" />
        </FormField>
        <FormField label={initial ? 'Nouveau mot de passe' : 'Mot de passe'} required={!initial}>
          <input
            required={!initial}
            minLength={8}
            type="password"
            value={form.password || ''}
            onChange={e => set('password', e.target.value)}
            className="input-field"
            placeholder={initial ? 'Laisser vide pour conserver' : '8 caracteres minimum'}
          />
        </FormField>
        <FormField label="Role" required>
          <select required value={form.role} onChange={e => set('role', e.target.value)} className="input-field">
            {roleOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FormField>
        <FormField label="Site" required>
          <select required value={form.site} onChange={e => set('site', e.target.value)} className="input-field">
            {SITES.map(site => <option key={site} value={site}>{site}</option>)}
          </select>
        </FormField>
        <FormField label="Telephone">
          <input value={form.telephone || ''} onChange={e => set('telephone', e.target.value)} className="input-field" />
        </FormField>
        <FormField label="Statut">
          <select value={String(form.actif)} onChange={e => set('actif', e.target.value === 'true')} className="input-field">
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </FormField>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const load = () => {
    setLoading(true)
    usersAPI.getAll().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = users.filter(user =>
    `${user.nom || ''} ${user.prenom || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    roleLabels[user.role]?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (data) => {
    await usersAPI.create(data)
    toast.success('Utilisateur cree')
    setModal(null)
    load()
  }

  const handleUpdate = async (data) => {
    await usersAPI.update(modal.item.id, data)
    toast.success('Utilisateur mis a jour')
    setModal(null)
    load()
  }

  const handleDeactivate = async (user) => {
    if (!confirm(`Desactiver ${user.nom} ${user.prenom} ?`)) return
    await usersAPI.deactivate(user.id)
    toast.success('Utilisateur desactive')
    load()
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Utilisateurs"
        subtitle={`${users.length} compte(s)`}
        action={<button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2"><PlusIcon className="w-4 h-4" />Nouvel utilisateur</button>}
      />

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, email, role..." />
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="loading-spinner" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState message="Aucun utilisateur" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>{['Nom', 'Email', 'Role', 'Site', 'Telephone', 'Statut', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="table-row">
                    <td className="table-cell font-medium">{user.nom} {user.prenom}</td>
                    <td className="table-cell text-slate-500">{user.email}</td>
                    <td className="table-cell"><span className="badge-info">{roleLabels[user.role] || user.role}</span></td>
                    <td className="table-cell">{user.site}</td>
                    <td className="table-cell text-slate-500">{user.telephone || '-'}</td>
                    <td className="table-cell"><span className={user.actif ? 'badge-success' : 'badge-danger'}>{user.actif ? 'Actif' : 'Inactif'}</span></td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => setModal({ type: 'edit', item: { ...user, password: '' } })} className="icon-button">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        {user.actif && (
                          <button onClick={() => handleDeactivate(user)} className="icon-button hover:text-red-600">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Nouvel utilisateur" size="lg">
        <UserForm onSubmit={handleCreate} onClose={() => setModal(null)} />
      </Modal>

      <Modal open={modal?.type === 'edit'} onClose={() => setModal(null)} title="Modifier utilisateur" size="lg">
        {modal?.type === 'edit' && <UserForm initial={modal.item} onSubmit={handleUpdate} onClose={() => setModal(null)} />}
      </Modal>
    </div>
  )
}
