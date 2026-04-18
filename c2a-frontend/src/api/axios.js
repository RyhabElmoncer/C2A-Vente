import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('c2a_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || err.response?.data?.error || 'Erreur serveur'
    if (err.response?.status === 401) {
      localStorage.removeItem('c2a_token')
      localStorage.removeItem('c2a_user')
      window.location.href = '/login'
    } else if (err.response?.status === 403) {
      toast.error('Accès refusé')
    } else {
      toast.error(msg)
    }
    return Promise.reject(err)
  }
)

export default api
