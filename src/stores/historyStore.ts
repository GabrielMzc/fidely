/**
 * History Store - Gerenciamento de Históricos
 * Controla histórico de pontos e compras
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PointTransaction, Purchase } from '@/types'
import { pointsApi, purchasesApi } from '@/api/apiService'
import { useAuthStore } from './authStore'

export const useHistoryStore = defineStore('history', () => {
  const authStore = useAuthStore()

  // State
  const pointTransactions = ref<PointTransaction[]>([])
  const purchases = ref<Purchase[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalPointsEarned = computed(() => 
    pointTransactions.value
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.points, 0)
  )

  const totalPointsRedeemed = computed(() => 
    pointTransactions.value
      .filter(t => t.type === 'redeem')
      .reduce((sum, t) => sum + t.points, 0)
  )

  const totalSpent = computed(() => 
    purchases.value.reduce((sum, p) => sum + p.amount, 0)
  )

  const recentTransactions = computed(() => 
    pointTransactions.value.slice(0, 10)
  )

  const recentPurchases = computed(() => 
    purchases.value.slice(0, 5)
  )

  // Actions
  async function fetchPointTransactions() {
    if (!authStore.user) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await pointsApi.getTransactions(authStore.user.id)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar transações')
      }

      pointTransactions.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar transações'
      console.error('Erro ao carregar transações:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPurchases() {
    if (!authStore.user) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await purchasesApi.getHistory(authStore.user.id)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar compras')
      }

      purchases.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar compras'
      console.error('Erro ao carregar compras:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchAll() {
    await Promise.all([
      fetchPointTransactions(),
      fetchPurchases()
    ])
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    pointTransactions,
    purchases,
    loading,
    error,
    // Getters
    totalPointsEarned,
    totalPointsRedeemed,
    totalSpent,
    recentTransactions,
    recentPurchases,
    // Actions
    fetchPointTransactions,
    fetchPurchases,
    fetchAll,
    clearError
  }
})


