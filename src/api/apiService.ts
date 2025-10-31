/**
 * API Service - Simula uma API REST
 * Utiliza dados mockados com persistência no localStorage
 */

import type {
  User,
  LoginCredentials,
  RegisterData,
  Reward,
  Purchase,
  PointTransaction,
  RedeemedReward,
  ApiResponse,
  Promotion,
  ManualPointsAssignment,
  AdminDashboardStats,
  AuditLog,
  PointsReport,
  RewardsReport,
  UsersReport,
  ReportFilters
} from '@/types'
import {
  loadFromStorage,
  saveToStorage,
  mockRewards,
  initializeMockData
} from './mockData'
import QRCode from 'qrcode'

// Inicializa dados mockados
initializeMockData()

// Simula delay de rede (200-500ms)
const delay = () => new Promise(resolve => 
  setTimeout(resolve, Math.random() * 300 + 200)
)

// ==================== AUTENTICAÇÃO ====================

export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    const user = users.find(u => u.cpf === credentials.cpf)
    
    if (!user) {
      return {
        success: false,
        message: 'CPF não encontrado'
      }
    }
    
    // Simulação: aceita qualquer senha para facilitar testes
    // Em produção, validaria hash de senha
    
    const token = btoa(`${user.id}-${Date.now()}`)
    
    return {
      success: true,
      data: { user, token }
    }
  },

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    
    // Verifica se CPF já existe
    if (users.some(u => u.cpf === data.cpf)) {
      return {
        success: false,
        message: 'CPF já cadastrado'
      }
    }
    
    // Verifica se email já existe
    if (users.some(u => u.email === data.email)) {
      return {
        success: false,
        message: 'Email já cadastrado'
      }
    }
    
    const newUser: User = {
      id: String(users.length + 1),
      cpf: data.cpf,
      name: data.name,
      email: data.email,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      points: 0,
      role: 'user',
      status: 'active',
      preferences: {
        darkMode: false,
        notifications: true,
        emailNotifications: true
      }
    }
    
    users.push(newUser)
    saveToStorage('users', users)
    
    const token = btoa(`${newUser.id}-${Date.now()}`)
    
    return {
      success: true,
      data: { user: newUser, token }
    }
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      return {
        success: false,
        message: 'Usuário não encontrado'
      }
    }
    
    // Não permite atualizar CPF, ID ou pontos diretamente
    const { id, cpf, points, ...allowedUpdates } = updates
    
    users[userIndex] = {
      ...users[userIndex],
      ...allowedUpdates
    }
    
    saveToStorage('users', users)
    
    return {
      success: true,
      data: users[userIndex]
    }
  }
}

// ==================== RECOMPENSAS ====================

export const rewardsApi = {
  async getAll(): Promise<ApiResponse<Reward[]>> {
    await delay()
    
    const rewards: Reward[] = loadFromStorage('rewards', mockRewards)
    
    return {
      success: true,
      data: rewards.filter(r => r.available)
    }
  },

  async redeem(userId: string, rewardId: string): Promise<ApiResponse<RedeemedReward>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    const rewards: Reward[] = loadFromStorage('rewards', mockRewards)
    const redeemedRewards: RedeemedReward[] = loadFromStorage('redeemedRewards', [])
    
    const userIndex = users.findIndex(u => u.id === userId)
    const reward = rewards.find(r => r.id === rewardId)
    
    if (userIndex === -1) {
      return { success: false, message: 'Usuário não encontrado' }
    }
    
    if (!reward) {
      return { success: false, message: 'Recompensa não encontrada' }
    }
    
    if (!reward.available) {
      return { success: false, message: 'Recompensa indisponível' }
    }
    
    if (users[userIndex].points < reward.pointsCost) {
      return { success: false, message: 'Pontos insuficientes' }
    }
    
    // Deduz pontos
    users[userIndex].points -= reward.pointsCost
    saveToStorage('users', users)
    
    // Cria código único
    const code = `FDL${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // Gera QR Code
    const qrCodeData = JSON.stringify({
      code,
      rewardId: reward.id,
      userId,
      timestamp: new Date().toISOString()
    })
    const qrCode = await QRCode.toDataURL(qrCodeData)
    
    const redeemedAt = new Date()
    const expiresAt = new Date(redeemedAt)
    expiresAt.setDate(expiresAt.getDate() + reward.validityDays)
    
    const redeemedReward: RedeemedReward = {
      id: `rr${Date.now()}`,
      userId,
      rewardId: reward.id,
      reward,
      code,
      qrCode,
      status: 'active',
      redeemedAt: redeemedAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    }
    
    redeemedRewards.push(redeemedReward)
    saveToStorage('redeemedRewards', redeemedRewards)
    
    // Registra transação de pontos
    const transactions: PointTransaction[] = loadFromStorage('pointTransactions', [])
    transactions.push({
      id: `t${Date.now()}`,
      userId,
      type: 'redeem',
      points: reward.pointsCost,
      description: `Resgate: ${reward.name}`,
      createdAt: new Date().toISOString(),
      relatedId: redeemedReward.id
    })
    saveToStorage('pointTransactions', transactions)
    
    return {
      success: true,
      data: redeemedReward
    }
  },

  async getRedeemed(userId: string): Promise<ApiResponse<RedeemedReward[]>> {
    await delay()
    
    const redeemedRewards: RedeemedReward[] = loadFromStorage('redeemedRewards', [])
    const userRewards = redeemedRewards.filter(r => r.userId === userId)
    
    // Atualiza status de recompensas expiradas
    const now = new Date()
    userRewards.forEach(reward => {
      if (reward.status === 'active' && new Date(reward.expiresAt) < now) {
        reward.status = 'expired'
      }
    })
    
    return {
      success: true,
      data: userRewards.sort((a, b) => 
        new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime()
      )
    }
  }
}

// ==================== PONTOS E HISTÓRICO ====================

export const pointsApi = {
  async getTransactions(userId: string): Promise<ApiResponse<PointTransaction[]>> {
    await delay()
    
    const transactions: PointTransaction[] = loadFromStorage('pointTransactions', [])
    const userTransactions = transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return {
      success: true,
      data: userTransactions
    }
  }
}

// ==================== COMPRAS ====================

export const purchasesApi = {
  async getHistory(userId: string): Promise<ApiResponse<Purchase[]>> {
    await delay()
    
    const purchases: Purchase[] = loadFromStorage('purchases', [])
    const userPurchases = purchases
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return {
      success: true,
      data: userPurchases
    }
  }
}

// ==================== ADMIN API ====================

export const adminApi = {
  // ===== DASHBOARD =====
  async getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    const transactions: PointTransaction[] = loadFromStorage('pointTransactions', [])
    const rewards: Reward[] = loadFromStorage('rewards', mockRewards)
    const redeemedRewards: RedeemedReward[] = loadFromStorage('redeemedRewards', [])
    const promotions: Promotion[] = loadFromStorage('promotions', [])
    
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active').length
    const totalPoints = users.reduce((sum, u) => sum + u.points, 0)
    
    const pointsRedeemed = transactions
      .filter(t => t.type === 'redeem')
      .reduce((sum, t) => sum + t.points, 0)
    
    const totalRevenue = transactions
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.points, 0)
    
    const recentUsers = users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    // Popular rewards
    const rewardCounts = new Map<string, number>()
    redeemedRewards.forEach(rr => {
      rewardCounts.set(rr.rewardId, (rewardCounts.get(rr.rewardId) || 0) + 1)
    })
    
    const popularRewards = Array.from(rewardCounts.entries())
      .map(([rewardId, count]) => {
        const reward = rewards.find(r => r.id === rewardId)
        const lastRedeemed = redeemedRewards
          .filter(rr => rr.rewardId === rewardId)
          .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())[0]
        
        return reward ? {
          reward,
          totalRedemptions: count,
          lastRedeemed: lastRedeemed?.redeemedAt || ''
        } : null
      })
      .filter(Boolean)
      .sort((a, b) => (b?.totalRedemptions || 0) - (a?.totalRedemptions || 0))
      .slice(0, 5) as any[]
    
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    
    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalPoints,
        pointsRedeemed,
        totalRewards: rewards.length,
        activePromotions: promotions.filter(p => p.status === 'active').length,
        totalRevenue,
        averagePointsPerUser: totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0,
        recentUsers,
        popularRewards,
        recentTransactions
      }
    }
  },

  // ===== USUÁRIOS =====
  async getUsers(): Promise<ApiResponse<User[]>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    return {
      success: true,
      data: users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      return { success: false, message: 'Usuário não encontrado' }
    }
    
    users[userIndex] = { ...users[userIndex], ...updates }
    saveToStorage('users', users)
    
    return {
      success: true,
      data: users[userIndex]
    }
  },

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    const filtered = users.filter(u => u.id !== userId)
    
    if (filtered.length === users.length) {
      return { success: false, message: 'Usuário não encontrado' }
    }
    
    saveToStorage('users', filtered)
    
    return { success: true }
  },

  // ===== PONTOS =====
  async assignPoints(assignment: Omit<ManualPointsAssignment, 'id' | 'createdAt'>): Promise<ApiResponse<ManualPointsAssignment>> {
    await delay()
    
    const users: User[] = loadFromStorage('users', [])
    const userIndex = users.findIndex(u => u.id === assignment.userId)
    
    if (userIndex === -1) {
      return { success: false, message: 'Usuário não encontrado' }
    }
    
    // Atualiza pontos do usuário
    const pointsChange = assignment.type === 'credit' ? assignment.points : -assignment.points
    users[userIndex].points += pointsChange
    
    // Não permite pontos negativos
    if (users[userIndex].points < 0) {
      return { success: false, message: 'Pontos insuficientes para débito' }
    }
    
    saveToStorage('users', users)
    
    // Salva registro de atribuição manual
    const assignments: ManualPointsAssignment[] = loadFromStorage('manualPointsAssignments', [])
    const newAssignment: ManualPointsAssignment = {
      ...assignment,
      id: `mpa${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    assignments.push(newAssignment)
    saveToStorage('manualPointsAssignments', assignments)
    
    // Registra transação de pontos
    const transactions: PointTransaction[] = loadFromStorage('pointTransactions', [])
    transactions.push({
      id: `t${Date.now()}`,
      userId: assignment.userId,
      type: assignment.type === 'credit' ? 'earn' : 'redeem',
      points: assignment.points,
      description: `Manual: ${assignment.reason}`,
      createdAt: new Date().toISOString(),
      relatedId: newAssignment.id
    })
    saveToStorage('pointTransactions', transactions)
    
    return {
      success: true,
      data: newAssignment
    }
  },

  // ===== RECOMPENSAS =====
  async createReward(reward: Omit<Reward, 'id'>): Promise<ApiResponse<Reward>> {
    await delay()
    
    const rewards: Reward[] = loadFromStorage('rewards', mockRewards)
    const newReward: Reward = {
      ...reward,
      id: `r${Date.now()}`
    }
    
    rewards.push(newReward)
    saveToStorage('rewards', rewards)
    
    return {
      success: true,
      data: newReward
    }
  },

  async updateReward(rewardId: string, updates: Partial<Reward>): Promise<ApiResponse<Reward>> {
    await delay()
    
    const rewards: Reward[] = loadFromStorage('rewards', mockRewards)
    const rewardIndex = rewards.findIndex(r => r.id === rewardId)
    
    if (rewardIndex === -1) {
      return { success: false, message: 'Recompensa não encontrada' }
    }
    
    rewards[rewardIndex] = { ...rewards[rewardIndex], ...updates }
    saveToStorage('rewards', rewards)
    
    return {
      success: true,
      data: rewards[rewardIndex]
    }
  },

  async deleteReward(rewardId: string): Promise<ApiResponse<void>> {
    await delay()
    
    const rewards: Reward[] = loadFromStorage('rewards', mockRewards)
    const filtered = rewards.filter(r => r.id !== rewardId)
    
    if (filtered.length === rewards.length) {
      return { success: false, message: 'Recompensa não encontrada' }
    }
    
    saveToStorage('rewards', filtered)
    
    return { success: true }
  },

  // ===== PROMOÇÕES =====
  async getPromotions(): Promise<ApiResponse<Promotion[]>> {
    await delay()
    
    const promotions: Promotion[] = loadFromStorage('promotions', [])
    return {
      success: true,
      data: promotions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  },

  async createPromotion(promotion: Omit<Promotion, 'id' | 'createdAt'>): Promise<ApiResponse<Promotion>> {
    await delay()
    
    const promotions: Promotion[] = loadFromStorage('promotions', [])
    const newPromotion: Promotion = {
      ...promotion,
      id: `promo${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    promotions.push(newPromotion)
    saveToStorage('promotions', promotions)
    
    return {
      success: true,
      data: newPromotion
    }
  },

  async updatePromotion(promotionId: string, updates: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
    await delay()
    
    const promotions: Promotion[] = loadFromStorage('promotions', [])
    const promotionIndex = promotions.findIndex(p => p.id === promotionId)
    
    if (promotionIndex === -1) {
      return { success: false, message: 'Promoção não encontrada' }
    }
    
    promotions[promotionIndex] = { ...promotions[promotionIndex], ...updates }
    saveToStorage('promotions', promotions)
    
    return {
      success: true,
      data: promotions[promotionIndex]
    }
  },

  async deletePromotion(promotionId: string): Promise<ApiResponse<void>> {
    await delay()
    
    const promotions: Promotion[] = loadFromStorage('promotions', [])
    const filtered = promotions.filter(p => p.id !== promotionId)
    
    if (filtered.length === promotions.length) {
      return { success: false, message: 'Promoção não encontrada' }
    }
    
    saveToStorage('promotions', filtered)
    
    return { success: true }
  },

  // ===== AUDITORIA =====
  async getAuditLogs(filters?: { userId?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<AuditLog[]>> {
    await delay()
    
    let logs: AuditLog[] = loadFromStorage('auditLogs', [])
    
    if (filters) {
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId)
      }
      if (filters.startDate) {
        logs = logs.filter(log => new Date(log.createdAt) >= new Date(filters.startDate!))
      }
      if (filters.endDate) {
        logs = logs.filter(log => new Date(log.createdAt) <= new Date(filters.endDate!))
      }
    }
    
    return {
      success: true,
      data: logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  },

  // ===== RELATÓRIOS =====
  async getPointsReport(filters?: ReportFilters): Promise<ApiResponse<PointsReport>> {
    await delay()
    
    let transactions: PointTransaction[] = loadFromStorage('pointTransactions', [])
    
    if (filters) {
      if (filters.userId) {
        transactions = transactions.filter(t => t.userId === filters.userId)
      }
      if (filters.startDate) {
        transactions = transactions.filter(t => new Date(t.createdAt) >= new Date(filters.startDate!))
      }
      if (filters.endDate) {
        transactions = transactions.filter(t => new Date(t.createdAt) <= new Date(filters.endDate!))
      }
    }
    
    const totalEarned = transactions
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.points, 0)
    
    const totalRedeemed = transactions
      .filter(t => t.type === 'redeem')
      .reduce((sum, t) => sum + t.points, 0)
    
    return {
      success: true,
      data: {
        period: `${filters?.startDate || 'Início'} - ${filters?.endDate || 'Hoje'}`,
        totalEarned,
        totalRedeemed,
        balance: totalEarned - totalRedeemed,
        transactions
      }
    }
  },

  async getRewardsReport(filters?: ReportFilters): Promise<ApiResponse<RewardsReport>> {
    await delay()
    
    let redeemedRewards: RedeemedReward[] = loadFromStorage('redeemedRewards', [])
    
    if (filters) {
      if (filters.rewardId) {
        redeemedRewards = redeemedRewards.filter(rr => rr.rewardId === filters.rewardId)
      }
      if (filters.startDate) {
        redeemedRewards = redeemedRewards.filter(rr => new Date(rr.redeemedAt) >= new Date(filters.startDate!))
      }
      if (filters.endDate) {
        redeemedRewards = redeemedRewards.filter(rr => new Date(rr.redeemedAt) <= new Date(filters.endDate!))
      }
    }
    
    const byCategory: Record<string, number> = {}
    redeemedRewards.forEach(rr => {
      const category = rr.reward.category
      byCategory[category] = (byCategory[category] || 0) + 1
    })
    
    const rewardCounts = new Map<string, number>()
    redeemedRewards.forEach(rr => {
      rewardCounts.set(rr.rewardId, (rewardCounts.get(rr.rewardId) || 0) + 1)
    })
    
    const rewards: Reward[] = loadFromStorage('rewards', mockRewards)
    const topRewards = Array.from(rewardCounts.entries())
      .map(([rewardId, count]) => {
        const reward = rewards.find(r => r.id === rewardId)
        const lastRedeemed = redeemedRewards
          .filter(rr => rr.rewardId === rewardId)
          .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())[0]
        
        return reward ? {
          reward,
          totalRedemptions: count,
          lastRedeemed: lastRedeemed?.redeemedAt || ''
        } : null
      })
      .filter(Boolean)
      .sort((a, b) => (b?.totalRedemptions || 0) - (a?.totalRedemptions || 0))
      .slice(0, 10) as any[]
    
    return {
      success: true,
      data: {
        period: `${filters?.startDate || 'Início'} - ${filters?.endDate || 'Hoje'}`,
        totalRedemptions: redeemedRewards.length,
        byCategory: byCategory as any,
        topRewards
      }
    }
  },

  async getUsersReport(filters?: ReportFilters): Promise<ApiResponse<UsersReport>> {
    await delay()
    
    let users: User[] = loadFromStorage('users', [])
    
    if (filters) {
      if (filters.startDate) {
        users = users.filter(u => new Date(u.createdAt) >= new Date(filters.startDate!))
      }
      if (filters.endDate) {
        users = users.filter(u => new Date(u.createdAt) <= new Date(filters.endDate!))
      }
    }
    
    const newUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active').length
    const inactiveUsers = users.filter(u => u.status === 'inactive').length
    const totalPoints = users.reduce((sum, u) => sum + u.points, 0)
    const averagePointsPerUser = newUsers > 0 ? Math.round(totalPoints / newUsers) : 0
    
    const topUsers = users
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
      .map(user => ({
        user,
        totalPoints: user.points
      }))
    
    return {
      success: true,
      data: {
        period: `${filters?.startDate || 'Início'} - ${filters?.endDate || 'Hoje'}`,
        newUsers,
        activeUsers,
        inactiveUsers,
        averagePointsPerUser,
        topUsers
      }
    }
  }
}


