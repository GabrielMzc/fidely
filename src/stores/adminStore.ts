/**
 * Admin Store - Gerenciamento de Operações Administrativas
 * CRUD de usuários, recompensas, promoções, atribuição de pontos, etc.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  User,
  Reward,
  Promotion,
  ManualPointsAssignment,
  AdminDashboardStats,
  AuditLog,
  PointsReport,
  RewardsReport,
  UsersReport,
  ReportFilters
} from '@/types'
import { adminApi } from '@/api/apiService'

export const useAdminStore = defineStore('admin', () => {
  // ==================== STATE ====================
  const users = ref<User[]>([])
  const promotions = ref<Promotion[]>([])
  const dashboardStats = ref<AdminDashboardStats | null>(null)
  const auditLogs = ref<AuditLog[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ==================== GETTERS ====================
  const activeUsers = computed(() => users.value.filter(u => u.status === 'active'))
  const inactiveUsers = computed(() => users.value.filter(u => u.status === 'inactive'))
  const blockedUsers = computed(() => users.value.filter(u => u.status === 'blocked'))
  
  const activePromotions = computed(() => 
    promotions.value.filter(p => p.status === 'active')
  )
  
  const scheduledPromotions = computed(() => 
    promotions.value.filter(p => p.status === 'scheduled')
  )

  // ==================== DASHBOARD ====================
  async function fetchDashboardStats() {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.getDashboardStats()

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar estatísticas')
      }

      dashboardStats.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== USUÁRIOS ====================
  async function fetchUsers() {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.getUsers()

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar usuários')
      }

      users.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUser(userId: string, updates: Partial<User>) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.updateUser(userId, updates)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao atualizar usuário')
      }

      // Atualiza localmente
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index] = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function blockUser(userId: string) {
    return updateUser(userId, { status: 'blocked' })
  }

  async function unblockUser(userId: string) {
    return updateUser(userId, { status: 'active' })
  }

  async function deleteUser(userId: string) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.deleteUser(userId)

      if (!response.success) {
        throw new Error(response.message || 'Erro ao deletar usuário')
      }

      // Remove localmente
      users.value = users.value.filter(u => u.id !== userId)

      return true
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== PONTOS ====================
  async function assignPoints(assignment: Omit<ManualPointsAssignment, 'id' | 'createdAt'>) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.assignPoints(assignment)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao atribuir pontos')
      }

      // Atualiza pontos do usuário localmente
      const user = users.value.find(u => u.id === assignment.userId)
      if (user) {
        const pointsChange = assignment.type === 'credit' ? assignment.points : -assignment.points
        user.points += pointsChange
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== RECOMPENSAS ====================
  async function createReward(reward: Omit<Reward, 'id'>) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.createReward(reward)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao criar recompensa')
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateReward(rewardId: string, updates: Partial<Reward>) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.updateReward(rewardId, updates)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao atualizar recompensa')
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteReward(rewardId: string) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.deleteReward(rewardId)

      if (!response.success) {
        throw new Error(response.message || 'Erro ao deletar recompensa')
      }

      return true
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== PROMOÇÕES ====================
  async function fetchPromotions() {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.getPromotions()

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar promoções')
      }

      promotions.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPromotion(promotion: Omit<Promotion, 'id' | 'createdAt'>) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.createPromotion(promotion)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao criar promoção')
      }

      promotions.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePromotion(promotionId: string, updates: Partial<Promotion>) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.updatePromotion(promotionId, updates)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao atualizar promoção')
      }

      const index = promotions.value.findIndex(p => p.id === promotionId)
      if (index !== -1) {
        promotions.value[index] = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePromotion(promotionId: string) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.deletePromotion(promotionId)

      if (!response.success) {
        throw new Error(response.message || 'Erro ao deletar promoção')
      }

      promotions.value = promotions.value.filter(p => p.id !== promotionId)
      return true
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelPromotion(promotionId: string) {
    return updatePromotion(promotionId, { status: 'cancelled' })
  }

  // ==================== AUDITORIA ====================
  async function fetchAuditLogs(filters?: { userId?: string; startDate?: string; endDate?: string }) {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.getAuditLogs(filters)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar logs')
      }

      auditLogs.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== RELATÓRIOS ====================
  async function getPointsReport(filters?: ReportFilters): Promise<PointsReport> {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.getPointsReport(filters)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao gerar relatório')
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getRewardsReport(filters?: ReportFilters): Promise<RewardsReport> {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.getRewardsReport(filters)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao gerar relatório')
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getUsersReport(filters?: ReportFilters): Promise<UsersReport> {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.getUsersReport(filters)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao gerar relatório')
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ==================== RESET ====================
  function $reset() {
    users.value = []
    promotions.value = []
    dashboardStats.value = null
    auditLogs.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    users,
    promotions,
    dashboardStats,
    auditLogs,
    loading,
    error,

    // Getters
    activeUsers,
    inactiveUsers,
    blockedUsers,
    activePromotions,
    scheduledPromotions,

    // Actions - Dashboard
    fetchDashboardStats,

    // Actions - Usuários
    fetchUsers,
    updateUser,
    blockUser,
    unblockUser,
    deleteUser,

    // Actions - Pontos
    assignPoints,

    // Actions - Recompensas
    createReward,
    updateReward,
    deleteReward,

    // Actions - Promoções
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    cancelPromotion,

    // Actions - Auditoria
    fetchAuditLogs,

    // Actions - Relatórios
    getPointsReport,
    getRewardsReport,
    getUsersReport,

    // Reset
    $reset
  }
})

