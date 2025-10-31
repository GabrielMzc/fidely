/**
 * Rewards Store - Gerenciamento de Recompensas
 * Controla catálogo, resgates e recompensas do usuário
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reward, RedeemedReward } from '@/types'
import { rewardsApi } from '@/api/apiService'
import { useAuthStore } from './authStore'

export const useRewardsStore = defineStore('rewards', () => {
  const authStore = useAuthStore()

  // State
  const rewards = ref<Reward[]>([])
  const redeemedRewards = ref<RedeemedReward[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const availableRewards = computed(() => {
    const userPoints = authStore.userPoints
    return rewards.value.map(reward => ({
      ...reward,
      canRedeem: userPoints >= reward.pointsCost
    }))
  })

  const activeRewards = computed(() => 
    redeemedRewards.value.filter(r => r.status === 'active')
  )

  const usedRewards = computed(() => 
    redeemedRewards.value.filter(r => r.status === 'used')
  )

  const expiredRewards = computed(() => 
    redeemedRewards.value.filter(r => r.status === 'expired')
  )

  const rewardsByCategory = computed(() => {
    const grouped: Record<string, Reward[]> = {}
    
    rewards.value.forEach(reward => {
      if (!grouped[reward.category]) {
        grouped[reward.category] = []
      }
      grouped[reward.category].push(reward)
    })
    
    return grouped
  })

  // Actions
  async function fetchRewards() {
    loading.value = true
    error.value = null

    try {
      const response = await rewardsApi.getAll()

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar recompensas')
      }

      rewards.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar recompensas'
      console.error('Erro ao carregar recompensas:', err)
    } finally {
      loading.value = false
    }
  }

  async function redeemReward(rewardId: string) {
    if (!authStore.user) {
      throw new Error('Usuário não autenticado')
    }

    loading.value = true
    error.value = null

    try {
      const response = await rewardsApi.redeem(authStore.user.id, rewardId)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao resgatar recompensa')
      }

      // Atualiza lista de recompensas resgatadas
      redeemedRewards.value.unshift(response.data)

      // Atualiza pontos do usuário
      const reward = rewards.value.find(r => r.id === rewardId)
      if (reward) {
        authStore.updateUserPoints(authStore.userPoints - reward.pointsCost)
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erro ao resgatar recompensa'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRedeemedRewards() {
    if (!authStore.user) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await rewardsApi.getRedeemed(authStore.user.id)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar recompensas resgatadas')
      }

      redeemedRewards.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar recompensas resgatadas'
      console.error('Erro ao carregar recompensas resgatadas:', err)
    } finally {
      loading.value = false
    }
  }

  function getRewardById(id: string): Reward | undefined {
    return rewards.value.find(r => r.id === id)
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    rewards,
    redeemedRewards,
    loading,
    error,
    // Getters
    availableRewards,
    activeRewards,
    usedRewards,
    expiredRewards,
    rewardsByCategory,
    // Actions
    fetchRewards,
    redeemReward,
    fetchRedeemedRewards,
    getRewardById,
    clearError
  }
})


