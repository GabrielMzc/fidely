/**
 * Auth Store - Gerenciamento de Autenticação
 * Controla login, registro, logout e perfil do usuário
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { authApi } from '@/api/apiService'

const TOKEN_KEY = 'fidely_auth_token'
const USER_KEY = 'fidely_user'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userPoints = computed(() => user.value?.points || 0)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login(credentials)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao fazer login')
      }

      user.value = response.data.user
      token.value = response.data.token

      // Persiste no localStorage
      localStorage.setItem(TOKEN_KEY, response.data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))

      return response.data.user
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.register(data)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao fazer cadastro')
      }

      user.value = response.data.user
      token.value = response.data.token

      // Persiste no localStorage
      localStorage.setItem(TOKEN_KEY, response.data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))

      return response.data.user
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer cadastro'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    error.value = null

    // Remove do localStorage
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function updateProfile(updates: Partial<User>) {
    if (!user.value) {
      throw new Error('Usuário não autenticado')
    }

    loading.value = true
    error.value = null

    try {
      const response = await authApi.updateProfile(user.value.id, updates)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao atualizar perfil')
      }

      user.value = response.data

      // Atualiza localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(response.data))

      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  function updateUserPoints(newPoints: number) {
    if (user.value) {
      user.value.points = newPoints
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    }
  }

  function loadFromStorage() {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Erro ao carregar dados do localStorage:', err)
        logout()
      }
    }
  }

  // Carrega dados ao inicializar
  loadFromStorage()

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    userPoints,
    isAdmin,
    isUser,
    // Actions
    login,
    register,
    logout,
    updateProfile,
    updateUserPoints,
    loadFromStorage
  }
})


