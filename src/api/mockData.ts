/**
 * Dados Mockados para a API
 * Simula um backend real com dados persistidos no localStorage
 */

import type { User, Reward, Purchase, PointTransaction, RedeemedReward } from '@/types'

// ==================== USUÁRIOS ====================
export const mockUsers: User[] = [
  {
    id: '1',
    cpf: '11144477735', // CPF válido: 111.444.777-35
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '11987654321',
    createdAt: '2024-01-15T10:00:00Z',
    points: 150,
    role: 'user',
    status: 'active',
    preferences: {
      darkMode: false,
      notifications: true,
      emailNotifications: true
    }
  },
  {
    id: '2',
    cpf: '52998224725', // CPF válido: 529.982.247-25
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '11912345678',
    createdAt: '2024-02-20T14:30:00Z',
    points: 450,
    role: 'user',
    status: 'active',
    preferences: {
      darkMode: true,
      notifications: true,
      emailNotifications: false
    }
  },
  {
    id: 'admin1',
    cpf: '12345678909', // CPF admin válido: 123.456.789-09
    name: 'Administrador',
    email: 'admin@fidely.com',
    phone: '11999999999',
    createdAt: '2024-01-01T00:00:00Z',
    points: 0,
    role: 'admin',
    status: 'active',
    preferences: {
      darkMode: true,
      notifications: true,
      emailNotifications: true
    }
  }
]

// ==================== RECOMPENSAS ====================
export const mockRewards: Reward[] = [
  {
    id: 'r1',
    name: 'Combo Clássico Grátis',
    description: 'Um hambúrguer clássico + batata média + refrigerante 350ml',
    pointsCost: 100,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'combo',
    available: true,
    validityDays: 30,
    terms: 'Válido de segunda a sexta-feira. Não cumulativo com outras promoções.'
  },
  {
    id: 'r2',
    name: 'Batata Grande Grátis',
    description: 'Porção grande de batatas fritas crocantes',
    pointsCost: 50,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    category: 'snack',
    available: true,
    validityDays: 15,
    terms: 'Não cumulativo com outras promoções de batatas.'
  },
  {
    id: 'r3',
    name: 'Refrigerante 600ml Grátis',
    description: 'Refrigerante de 600ml de sua escolha',
    pointsCost: 30,
    imageUrl: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
    category: 'beverage',
    available: true,
    validityDays: 15,
    terms: 'Válido para qualquer sabor disponível.'
  },
  {
    id: 'r4',
    name: '10% de Desconto',
    description: 'Cupom de 10% de desconto em qualquer compra',
    pointsCost: 80,
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop',
    category: 'discount',
    available: true,
    validityDays: 45,
    terms: 'Válido para compras acima de R$ 20,00. Não cumulativo.'
  },
  {
    id: 'r5',
    name: 'Combo Premium',
    description: 'Hambúrguer premium + batata grande + refrigerante 600ml + sobremesa',
    pointsCost: 200,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
    category: 'combo',
    available: true,
    validityDays: 30,
    terms: 'Válido todos os dias. Não cumulativo com outras promoções.'
  },
  {
    id: 'r6',
    name: 'Milk Shake Grátis',
    description: 'Milk shake cremoso de qualquer sabor (300ml)',
    pointsCost: 60,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    category: 'beverage',
    available: true,
    validityDays: 20,
    terms: 'Sabores disponíveis: chocolate, morango, baunilha.'
  },
  {
    id: 'r7',
    name: 'Onion Rings Grátis',
    description: 'Porção de anéis de cebola crocantes',
    pointsCost: 45,
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
    category: 'snack',
    available: true,
    validityDays: 15,
    terms: 'Não cumulativo com outras promoções.'
  },
  {
    id: 'r8',
    name: '20% de Desconto',
    description: 'Cupom de 20% de desconto em qualquer compra',
    pointsCost: 150,
    imageUrl: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=400&h=300&fit=crop',
    category: 'discount',
    available: true,
    validityDays: 60,
    terms: 'Válido para compras acima de R$ 50,00. Não cumulativo.'
  },
  {
    id: 'r9',
    name: 'Sobremesa Especial',
    description: 'Brownie com sorvete e calda',
    pointsCost: 70,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    category: 'special',
    available: true,
    validityDays: 20,
    terms: 'Sujeito à disponibilidade.'
  },
  {
    id: 'r10',
    name: 'Combo Família',
    description: '4 hambúrgueres + 2 batatas grandes + 4 refrigerantes',
    pointsCost: 350,
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    category: 'combo',
    available: true,
    validityDays: 30,
    terms: 'Perfeito para compartilhar! Não cumulativo.'
  }
]

// ==================== COMPRAS ====================
export const mockPurchases: Purchase[] = [
  {
    id: 'p1',
    userId: '1',
    amount: 45.90,
    pointsEarned: 45,
    items: [
      { name: 'Hambúrguer Clássico', quantity: 1, price: 25.90 },
      { name: 'Batata Média', quantity: 1, price: 12.00 },
      { name: 'Refrigerante 350ml', quantity: 1, price: 8.00 }
    ],
    createdAt: '2024-10-20T12:30:00Z',
    storeName: 'Lanchonete Centro'
  },
  {
    id: 'p2',
    userId: '1',
    amount: 32.50,
    pointsEarned: 32,
    items: [
      { name: 'X-Bacon', quantity: 1, price: 28.50 },
      { name: 'Suco Natural', quantity: 1, price: 4.00 }
    ],
    createdAt: '2024-10-18T19:15:00Z',
    storeName: 'Lanchonete Centro'
  },
  {
    id: 'p3',
    userId: '1',
    amount: 73.00,
    pointsEarned: 73,
    items: [
      { name: 'Combo Premium', quantity: 2, price: 36.50 }
    ],
    createdAt: '2024-10-15T18:45:00Z',
    storeName: 'Lanchonete Centro'
  }
]

// ==================== TRANSAÇÕES DE PONTOS ====================
export const mockPointTransactions: PointTransaction[] = [
  {
    id: 't1',
    userId: '1',
    type: 'earn',
    points: 45,
    description: 'Compra no valor de R$ 45,90',
    createdAt: '2024-10-20T12:30:00Z',
    relatedId: 'p1'
  },
  {
    id: 't2',
    userId: '1',
    type: 'earn',
    points: 32,
    description: 'Compra no valor de R$ 32,50',
    createdAt: '2024-10-18T19:15:00Z',
    relatedId: 'p2'
  },
  {
    id: 't3',
    userId: '1',
    type: 'earn',
    points: 73,
    description: 'Compra no valor de R$ 73,00',
    createdAt: '2024-10-15T18:45:00Z',
    relatedId: 'p3'
  }
]

// ==================== RECOMPENSAS RESGATADAS ====================
export const mockRedeemedRewards: RedeemedReward[] = []

// ==================== HELPER FUNCTIONS ====================
export function getStorageKey(key: string): string {
  return `fidely_${key}`
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(getStorageKey(key))
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to storage:', error)
  }
}

// ==================== MIGRAÇÃO DE DADOS ====================
function migrateUsers(): void {
  const stored = localStorage.getItem(getStorageKey('users'))
  if (stored) {
    try {
      const users = JSON.parse(stored) as User[]
      let needsMigration = false

      // Verifica se algum usuário não tem os campos novos
      const migratedUsers = users.map(user => {
        if (!user.role || !user.status) {
          needsMigration = true
          return {
            ...user,
            role: user.cpf === '12345678909' ? 'admin' : 'user',
            status: 'active'
          } as User
        }
        return user
      })

      // Adiciona usuário admin se não existir
      const hasAdmin = migratedUsers.some(u => u.role === 'admin')
      if (!hasAdmin) {
        const adminUser = mockUsers.find(u => u.role === 'admin')
        if (adminUser) {
          migratedUsers.push(adminUser)
          needsMigration = true
        }
      }

      if (needsMigration) {
        saveToStorage('users', migratedUsers)
        console.log('✅ Usuários migrados com sucesso!')
      }
    } catch (error) {
      console.error('Erro na migração, reinicializando usuários:', error)
      saveToStorage('users', mockUsers)
    }
  }
}

// ==================== INICIALIZAÇÃO ====================
export function initializeMockData(): void {
  // Carrega dados do localStorage ou usa os padrões
  if (!localStorage.getItem(getStorageKey('users'))) {
    saveToStorage('users', mockUsers)
  } else {
    // Migra usuários existentes para adicionar novos campos
    migrateUsers()
  }
  
  if (!localStorage.getItem(getStorageKey('rewards'))) {
    saveToStorage('rewards', mockRewards)
  }
  if (!localStorage.getItem(getStorageKey('purchases'))) {
    saveToStorage('purchases', mockPurchases)
  }
  if (!localStorage.getItem(getStorageKey('pointTransactions'))) {
    saveToStorage('pointTransactions', mockPointTransactions)
  }
  if (!localStorage.getItem(getStorageKey('redeemedRewards'))) {
    saveToStorage('redeemedRewards', mockRedeemedRewards)
  }
}

