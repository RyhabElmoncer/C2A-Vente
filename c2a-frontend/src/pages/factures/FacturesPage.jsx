import { useEffect, useState } from 'react'
import { facturesAPI } from '../../api/services'
import { Modal, Badge, EmptyState, SearchInput, PageHeader, FormField } from '../../components/ui'
import toast from 'react-hot-toast'
import { PlusIcon } from '@heroicons/react/24/outline'

const MODES = ['ESPECES', 'CHEQUE', 'VIREMENT', 'TRAITE', 'CARTE']

export default function FacturesPage() {
  const [factures, setFactures] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [pForm, setPForm] = useState({ factureId: '', montant: '', modePaiement: 'VIREMENT', reference: '', banque: '' })
  const [saving, setSaving] = useState(false)

  const load = () => { setLoading(true); facturesAPI.getAll().then(r => setFactures(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])

  const filtered = factures.filter(f => f.numero?.includes(search))

  const handlePaiement = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await facturesAPI.enregistrerPaiement({ ...pForm, factureId: +pForm.factureId, montant: +pForm.montant })
      toast.success('Paiement enregistré !'); setModal(null); load()
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Facturation" subtitle={`${factures.length} facture(s)`} />
      <div className="card mb-4 flex gap-4 py-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Numéro de facture…" />
      </div>
      <div className="card p-0 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          : filtered.length === 0 ? <EmptyState message="Aucune facture" /> : (
            <div className="overflow-x-auto"><table className="w-full">
              <thead><tr>{['Numéro', 'Date', 'Échéance', 'Montant TTC', 'Payé', 'Restant', 'Statut', 'Action'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>{filtered.map(f => (
                <tr key={f.id} className="table-row">
                  <td className="table-cell font-mono font-medium">{f.numero}</td>
                  <td className="table-cell text-gray-500">{f.dateFacture}</td>
                  <td className="table-cell text-gray-500">{f.dateEcheance}</td>
                  <td className="table-cell font-medium">{(f.montantTTC || 0).toFixed(3)} TND</td>
                  <td className="table-cell text-green-600">{(f.montantPaye || 0).toFixed(3)} TND</td>
                  <td className="table-cell font-medium text-orange-600">{(f.montantRestant || 0).toFixed(3)} TND</td>
                  <td className="table-cell"><Badge statut={f.statut} /></td>
                  <td className="table-cell">
                    {f.statut !== 'PAYEE' && f.statut !== 'ANNULEE' && (
                      <button onClick={() => { setPForm(p => ({ ...p, factureId: f.id, montant: f.montantRestant })); setModal('paiement') }}
                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                        <PlusIcon className="w-3 h-3" />Paiement
                      </button>
                    )}
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
      </div>
      <Modal open={modal === 'paiement'} onClose={() => setModal(null)} title="Enregistrer un paiement" size="md">
        <form onSubmit={handlePaiement} className="space-y-4">
          <FormField label="Montant (TND)" required>
            <input required type="number" step="0.001" min="0.001" value={pForm.montant} onChange={e => setPForm(p => ({ ...p, montant: e.target.value }))} className="input-field" />
          </FormField>
          <FormField label="Mode de paiement">
            <select value={pForm.modePaiement} onChange={e => setPForm(p => ({ ...p, modePaiement: e.target.value }))} className="input-field">
              {MODES.map(m => <option key={m}>{m}</option>)}
            </select>
          </FormField>
          <FormField label="Référence"><input value={pForm.reference} onChange={e => setPForm(p => ({ ...p, reference: e.target.value }))} className="input-field" /></FormField>
          <FormField label="Banque"><input value={pForm.banque} onChange={e => setPForm(p => ({ ...p, banque: e.target.value }))} className="input-field" /></FormField>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Enregistrement…' : 'Valider'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
