'use client'

import { AuthenticatedUser } from '@/types'
import * as React from 'react'

interface AuthContextType {
  user: AuthenticatedUser | null
  token: string | null
  login: (userData: AuthenticatedUser) => void
  updateUser: (userData: AuthenticatedUser | null) => void
  setUser: (user: Partial<AuthenticatedUser> | null) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = React.useState<AuthenticatedUser | null>(null)
  const [token, setToken] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUserState(JSON.parse(storedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = React.useCallback((userData: AuthenticatedUser) => {
    localStorage.setItem('token', userData.token as string)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(userData.token as string)
    setUserState(userData)
  }, [])

  const updateUser = React.useCallback((userData: AuthenticatedUser | null) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUserState(userData)
    } else {
      localStorage.removeItem('user')
      setUserState(null)
    }
  }, [])

  const setUser = React.useCallback(
    (userData: Partial<AuthenticatedUser> | null) => {
      if (userData) {
        const currentUserData = JSON.parse(localStorage.getItem('user') || '{}')
        const newUserData = { ...currentUserData, ...userData }
        localStorage.setItem('user', JSON.stringify(newUserData))
        setUserState(newUserData)
      } else {
        localStorage.removeItem('user')
        setUserState(null)
      }
    },
    []
  )

  const logout = React.useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUserState(null)
  }, [])

  const value = React.useMemo(
    () => ({ user, token, login, logout, updateUser, setUser, isLoading }),
    [user, token, login, logout, updateUser, setUser, isLoading]
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
