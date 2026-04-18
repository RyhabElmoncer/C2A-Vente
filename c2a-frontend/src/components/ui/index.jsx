// ===== MODAL =====
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

// ===== STATUS BADGE =====
const statutConfig = {
  // Devis
  BROUILLON:       { cls: 'badge-gray',    label: 'Brouillon' },
  ENVOYE:          { cls: 'badge-info',    label: 'Envoyé' },
  VALIDE:          { cls: 'badge-success', label: 'Validé' },
  REFUSE:          { cls: 'badge-danger',  label: 'Refusé' },
  EXPIRE:          { cls: 'badge-warning', label: 'Expiré' },
  CONVERTI:        { cls: 'badge-success', label: 'Converti' },
  // Commande
  EN_ATTENTE:      { cls: 'badge-warning', label: 'En attente' },
  CONFIRMEE:       { cls: 'badge-info',    label: 'Confirmée' },
  EN_PREPARATION:  { cls: 'badge-info',    label: 'En préparation' },
  EXPEDIEE:        { cls: 'badge-info',    label: 'Expédiée' },
  LIVREE:          { cls: 'badge-success', label: 'Livrée' },
  ANNULEE:         { cls: 'badge-danger',  label: 'Annulée' },
  // Facture
  EMISE:                { cls: 'badge-info',    label: 'Émise' },
  PARTIELLEMENT_PAYEE:  { cls: 'badge-warning', label: 'Part. payée' },
  PAYEE:                { cls: 'badge-success', label: 'Payée' },
  // Stock
  ENTREE:  { cls: 'badge-success', label: 'Entrée' },
  SORTIE:  { cls: 'badge-danger',  label: 'Sortie' },
  AJUSTEMENT: { cls: 'badge-warning', label: 'Ajustement' },
  RETOUR:  { cls: 'badge-info',    label: 'Retour' },
}

export function Badge({ statut }) {
  const cfg = statutConfig[statut] || { cls: 'badge-gray', label: statut }
  return <span className={cfg.cls}>{cfg.label}</span>
}

// ===== EMPTY STATE =====
export function EmptyState({ message = 'Aucun élément trouvé' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  )
}

// ===== CONFIRM DIALOG =====
export function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary">Annuler</button>
        <button onClick={() => { onConfirm(); onClose() }} className="btn-danger">Confirmer</button>
      </div>
    </Modal>
  )
}

// ===== SEARCH INPUT =====
export function SearchInput({ value, onChange, placeholder = 'Rechercher…' }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9 w-64"
      />
    </div>
  )
}

// ===== PAGE HEADER =====
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ===== FORM FIELD =====
export function FormField({ label, required, children, error }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ===== SELECT FIELD =====
export function SelectField({ label, required, value, onChange, options, placeholder = 'Sélectionner…' }) {
  return (
    <FormField label={label} required={required}>
      <select value={value} onChange={e => onChange(e.target.value)} className="input-field">
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </FormField>
  )
}
