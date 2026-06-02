import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('c2a_token')
    const userData = localStorage.getItem('c2a_user')
    if (token && userData) {
      setUser(JSON.parse(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password }, { skipGlobalErrorToast: true })
    localStorage.setItem('c2a_token', data.token)
    localStorage.setItem('c2a_user', JSON.stringify(data))
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('c2a_token')
    localStorage.removeItem('c2a_user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const hasRole = (...roles) => user && roles.includes(user.role)

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
