export const ROLES = {
  ADMIN: 'ADMIN',
  GERANT: 'GERANT',
  COMMERCIAL: 'COMMERCIAL',
  MAGASINIER: 'MAGASINIER',
  COMPTABLE: 'COMPTABLE',
  AGENT_RECOUVREMENT: 'AGENT_RECOUVREMENT',
  CLIENT: 'CLIENT',
}

export const roleLabels = {
  ADMIN: 'Administrateur',
  GERANT: 'Directeur / Gerant',
  COMMERCIAL: 'Commercial / Vendeur',
  MAGASINIER: 'Gestionnaire de stock',
  COMPTABLE: 'Responsable facturation',
  AGENT_RECOUVREMENT: 'Agent de recouvrement',
  CLIENT: 'Client',
}

export const roleOptions = Object.values(ROLES).map((role) => ({
  value: role,
  label: roleLabels[role],
}))

export const pageRoles = {
  dashboard: [ROLES.ADMIN, ROLES.GERANT],
  utilisateurs: [ROLES.ADMIN],
  clients: [ROLES.COMMERCIAL],
  produits: [ROLES.COMMERCIAL, ROLES.MAGASINIER],
  devis: [ROLES.COMMERCIAL],
  commandes: [ROLES.COMMERCIAL, ROLES.MAGASINIER, ROLES.COMPTABLE],
  factures: [ROLES.COMPTABLE, ROLES.AGENT_RECOUVREMENT],
  stock: [ROLES.MAGASINIER],
}

export const roleHome = {
  ADMIN: '/dashboard',
  GERANT: '/dashboard',
  COMMERCIAL: '/clients',
  MAGASINIER: '/produits',
  COMPTABLE: '/factures',
  AGENT_RECOUVREMENT: '/factures',
  CLIENT: '/client',
}

export function homeFor(user) {
  return user ? roleHome[user.role] || '/' : '/'
}

export function hasAccess(user, roles) {
  return Boolean(user && (!roles || roles.includes(user.role)))
}
