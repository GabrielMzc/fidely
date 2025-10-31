/**
 * Tipos e Interfaces do Sistema Fidely+
 * Definições completas para todas as entidades do sistema
 */

// ==================== ROLES ====================
export type UserRole = 'user' | 'admin'

// ==================== USUÁRIO ====================
export interface User {
  id: string
  cpf: string
  name: string
  email: string
  phone: string
  createdAt: string
  points: number
  role: UserRole
  status: UserStatus
  preferences: UserPreferences
  lastLoginAt?: string
}

export type UserStatus = 'active' | 'inactive' | 'blocked'

export interface UserPreferences {
  darkMode: boolean
  notifications: boolean
  emailNotifications: boolean
}

// ==================== AUTENTICAÇÃO ====================
export interface LoginCredentials {
  cpf: string
  password: string
}

export interface RegisterData {
  name: string
  cpf: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ==================== PONTOS ====================
export interface PointTransaction {
  id: string
  userId: string
  type: 'earn' | 'redeem'
  points: number
  description: string
  createdAt: string
  relatedId?: string // ID da compra ou recompensa relacionada
}

// ==================== COMPRAS ====================
export interface Purchase {
  id: string
  userId: string
  amount: number
  pointsEarned: number
  items: PurchaseItem[]
  createdAt: string
  storeName: string
}

export interface PurchaseItem {
  name: string
  quantity: number
  price: number
}

// ==================== RECOMPENSAS ====================
export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  imageUrl: string
  category: RewardCategory
  available: boolean
  validityDays: number // Dias de validade após o resgate
  terms?: string // Termos e condições
}

export type RewardCategory = 
  | 'combo' 
  | 'beverage' 
  | 'snack' 
  | 'discount' 
  | 'special'

// ==================== RECOMPENSAS RESGATADAS ====================
export interface RedeemedReward {
  id: string
  userId: string
  rewardId: string
  reward: Reward
  code: string // Código único para apresentar no caixa
  qrCode: string // QR Code em base64
  status: RewardStatus
  redeemedAt: string
  expiresAt: string
  usedAt?: string
}

export type RewardStatus = 'active' | 'used' | 'expired'

// ==================== NOTIFICAÇÕES ====================
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export type NotificationType = 
  | 'points_earned' 
  | 'reward_redeemed' 
  | 'reward_expiring' 
  | 'promotional'

// ==================== FILTROS E PAGINAÇÃO ====================
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// ==================== FORMULÁRIOS ====================
export interface FormErrors {
  [key: string]: string
}

export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

// ==================== PROMOÇÕES ====================
export interface Promotion {
  id: string
  title: string
  description: string
  type: PromotionType
  value: number // Pontos extras ou multiplicador
  startDate: string
  endDate: string
  imageUrl?: string
  status: PromotionStatus
  conditions?: string
  minPurchaseAmount?: number
  targetRewardIds?: string[]
  createdAt: string
  createdBy: string // userId do admin
}

export type PromotionType = 
  | 'bonus_points'      // Pontos extras em compras
  | 'multiplier'        // Multiplicador de pontos (2x, 3x)
  | 'discount_reward'   // Desconto em recompensas específicas
  | 'free_points'       // Pontos grátis para todos

export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'cancelled'

// ==================== ATRIBUIÇÃO MANUAL DE PONTOS ====================
export interface ManualPointsAssignment {
  id: string
  userId: string
  points: number
  reason: string
  assignedBy: string // userId do admin
  createdAt: string
  type: 'credit' | 'debit'
}

// ==================== ADMIN DASHBOARD ====================
export interface AdminDashboardStats {
  totalUsers: number
  activeUsers: number
  totalPoints: number
  pointsRedeemed: number
  totalRewards: number
  activePromotions: number
  totalRevenue: number
  averagePointsPerUser: number
  recentUsers: User[]
  popularRewards: RewardStats[]
  recentTransactions: PointTransaction[]
}

export interface RewardStats {
  reward: Reward
  totalRedemptions: number
  lastRedeemed: string
}

// ==================== LOGS DE AUDITORIA ====================
export interface AuditLog {
  id: string
  userId: string
  userRole: UserRole
  action: AuditAction
  resource: string
  resourceId: string
  details: string
  ipAddress?: string
  createdAt: string
}

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'login' 
  | 'logout'
  | 'assign_points'
  | 'redeem_reward'

// ==================== RELATÓRIOS ====================
export interface ReportFilters {
  startDate?: string
  endDate?: string
  userId?: string
  rewardId?: string
  promotionId?: string
  type?: string
}

export interface PointsReport {
  period: string
  totalEarned: number
  totalRedeemed: number
  balance: number
  transactions: PointTransaction[]
}

export interface RewardsReport {
  period: string
  totalRedemptions: number
  byCategory: Record<RewardCategory, number>
  topRewards: RewardStats[]
}

export interface UsersReport {
  period: string
  newUsers: number
  activeUsers: number
  inactiveUsers: number
  averagePointsPerUser: number
  topUsers: {
    user: User
    totalPoints: number
  }[]
}


