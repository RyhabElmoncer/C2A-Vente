import api from './axios'

// Public
export const publicAPI = {
  getProduits: () => api.get('/public/produits'),
  getCatalogueAluminium: (reference) => api.get('/public/catalogue-aluminium', {
    params: reference ? { reference } : {},
  }),
  getProfileAluminium: (id) => api.get(`/public/catalogue-aluminium/${id}`),
}

// Clients
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  getBySite: (site) => api.get(`/clients/site/${site}`),
  getAvecCreances: () => api.get('/clients/creances'),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
}

// Produits
export const produitsAPI = {
  getAll: () => api.get('/produits'),
  getById: (id) => api.get(`/produits/${id}`),
  getRupture: () => api.get('/produits/rupture'),
  create: (data) => api.post('/produits', data),
  update: (id, data) => api.put(`/produits/${id}`, data),
}

// Devis
export const devisAPI = {
  getAll: () => api.get('/devis'),
  getById: (id) => api.get(`/devis/${id}`),
  create: (data) => api.post('/devis', data),
  changerStatut: (id, statut) => api.patch(`/devis/${id}/statut/${statut}`),
  convertir: (id) => api.post(`/devis/${id}/convertir`),
}

// Commandes
export const commandesAPI = {
  getAll: () => api.get('/commandes'),
  getById: (id) => api.get(`/commandes/${id}`),
  getBySite: (site) => api.get(`/commandes/site/${site}`),
  getByStatut: (statut) => api.get(`/commandes/statut/${statut}`),
  create: (data) => api.post('/commandes', data),
  changerStatut: (id, statut) => api.patch(`/commandes/${id}/statut/${statut}`),
}

// Espace client
export const clientAPI = {
  demanderAchat: (data) => api.post('/commandes/client', data),
}

// Factures
export const facturesAPI = {
  getAll: () => api.get('/factures'),
  getById: (id) => api.get(`/factures/${id}`),
  getEnRetard: () => api.get('/factures/retard'),
  create: (data) => api.post('/factures', data),
  enregistrerPaiement: (data) => api.post('/factures/paiements', data),
}

// Stock
export const stockAPI = {
  getMouvements: (produitId) => api.get(`/stock/mouvements/${produitId}`),
  getRupture: () => api.get('/stock/rupture'),
  enregistrerMouvement: (data) => api.post('/stock/mouvements', data),
}

// Dashboard
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
}
