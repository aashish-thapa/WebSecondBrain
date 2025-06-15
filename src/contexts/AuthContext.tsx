'use client'

import { AuthenticatedUser } from '@/types'
import * as React from 'react'

interface AuthContextType {
  user: AuthenticatedUser | null
  token: string | null
  login: (userData: AuthenticatedUser) => void
  updateUser: (userData: AuthenticatedUser | null) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthenticatedUser | null>(null)
  const [token, setToken] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = React.useCallback((userData: AuthenticatedUser) => {
    localStorage.setItem('token', userData.token as string)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(userData.token as string)
    setUser(userData)
  }, [])

  const updateUser = React.useCallback((userData: AuthenticatedUser | null) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } else {
      localStorage.removeItem('user')
      setUser(null)
    }
  }, [])

  const logout = React.useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const value = React.useMemo(
    () => ({ user, token, login, logout, updateUser, isLoading }),
    [user, token, login, logout, updateUser, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
