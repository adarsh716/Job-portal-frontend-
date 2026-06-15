import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { decodeToken } from '../utils/jwtDecode'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      const payload = decodeToken(storedToken)
      if (payload && payload.exp * 1000 > Date.now()) {
        setToken(storedToken)
        setUser({
          userId: payload.sub,
          email: payload.email,
          role: payload.role,
        })
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  async function login(email, password) {
    const res = await authApi.login(email, password)
    const { accessToken, role, userId, email: userEmail } = res.data.data
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
    setUser({ userId, email: userEmail, role })
    return { role }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    window.location.href = '/login'
  }

  const value = {
    user,
    token,
    role: user?.role,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
