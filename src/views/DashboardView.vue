<template>
  <div class="animate-fade-in space-y-8">
    <!-- Welcome Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Olá, {{ userName }}! 👋
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Acompanhe seus pontos e histórico de fidelidade
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Pontos Atuais -->
      <BaseCard hover class="relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-primary-600/20 rounded-full blur-3xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <SparklesIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <BaseBadge variant="success" size="sm">Ativo</BaseBadge>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Pontos Disponíveis</p>
          <p class="text-4xl font-bold text-gray-900 dark:text-white">{{ userPoints }}</p>
          <p class="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <ArrowTrendingUpIcon class="w-4 h-4" />
            +{{ recentPointsEarned }} este mês
          </p>
        </div>
      </BaseCard>

      <!-- Total Ganho -->
      <BaseCard hover>
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <TrophyIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Acumulado</p>
        <p class="text-4xl font-bold text-gray-900 dark:text-white">{{ totalEarned }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">pontos ganhos</p>
      </BaseCard>

      <!-- Recompensas Resgatadas -->
      <BaseCard hover>
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
            <GiftIcon class="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Recompensas Resgatadas</p>
        <p class="text-4xl font-bold text-gray-900 dark:text-white">{{ totalRedeemed }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">este mês</p>
      </BaseCard>
    </div>

    <!-- Próxima Recompensa -->
    <BaseCard v-if="nextReward">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FireIcon class="w-5 h-5 text-primary-500" />
            Próxima Recompensa
          </h2>
        </div>
      </template>

      <div class="flex flex-col md:flex-row gap-6 items-center">
        <img 
          :src="nextReward.imageUrl" 
          :alt="nextReward.name"
          class="w-full md:w-48 h-32 object-cover rounded-lg"
        />
        
        <div class="flex-1 w-full">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ nextReward.name }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ nextReward.description }}
          </p>
          
          <div class="space-y-3">
            <div>
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-600 dark:text-gray-400">
                  {{ userPoints }} / {{ nextReward.pointsCost }} pontos
                </span>
                <span class="font-semibold text-primary-600 dark:text-primary-400">
                  {{ progressPercentage }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
                ></div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <BaseButton
                v-if="canRedeemNext"
                variant="primary"
                @click="goToRewards"
              >
                Resgatar Agora
              </BaseButton>
              <p v-else class="text-sm text-gray-600 dark:text-gray-400">
                Faltam apenas <strong class="text-primary-600 dark:text-primary-400">{{ pointsNeeded }} pontos</strong> para resgatar!
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Tabs: Histórico de Pontos e Compras -->
    <div>
      <div class="border-b border-gray-200 dark:border-dark-border mb-6">
        <nav class="flex gap-6">
          <button
            @click="activeTab = 'points'"
            :class="[
              'pb-4 border-b-2 font-medium transition-colors',
              activeTab === 'points'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            ]"
          >
            Histórico de Pontos
          </button>
          <button
            @click="activeTab = 'purchases'"
            :class="[
              'pb-4 border-b-2 font-medium transition-colors',
              activeTab === 'purchases'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            ]"
          >
            Histórico de Compras
          </button>
        </nav>
      </div>

      <!-- Histórico de Pontos -->
      <div v-if="activeTab === 'points'">
        <BaseCard v-if="recentTransactions.length > 0" :padding="false">
          <div class="divide-y divide-gray-200 dark:divide-dark-border">
            <div
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div 
                    :class="[
                      'p-2 rounded-lg',
                      transaction.type === 'earn' 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    ]"
                  >
                    <ArrowUpIcon 
                      v-if="transaction.type === 'earn'"
                      class="w-5 h-5 text-green-600 dark:text-green-400"
                    />
                    <ArrowDownIcon 
                      v-else
                      class="w-5 h-5 text-red-600 dark:text-red-400"
                    />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ transaction.description }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(transaction.createdAt) }}
                    </p>
                  </div>
                </div>
                <div 
                  :class="[
                    'font-bold text-lg',
                    transaction.type === 'earn' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  ]"
                >
                  {{ transaction.type === 'earn' ? '+' : '-' }}{{ transaction.points }}
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
        <div v-else class="text-center py-12">
          <ClockIcon class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">Nenhuma transação ainda</p>
        </div>
      </div>

      <!-- Histórico de Compras -->
      <div v-if="activeTab === 'purchases'">
        <div v-if="recentPurchases.length > 0" class="space-y-4">
          <BaseCard 
            v-for="purchase in recentPurchases"
            :key="purchase.id"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ purchase.storeName }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(purchase.createdAt) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900 dark:text-white">
                  R$ {{ purchase.amount.toFixed(2) }}
                </p>
                <BaseBadge variant="success" size="sm">
                  +{{ purchase.pointsEarned }} pts
                </BaseBadge>
              </div>
            </div>
            
            <div class="space-y-2">
              <div
                v-for="(item, index) in purchase.items"
                :key="index"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-600 dark:text-gray-400">
                  {{ item.quantity }}x {{ item.name }}
                </span>
                <span class="font-medium text-gray-900 dark:text-white">
                  R$ {{ item.price.toFixed(2) }}
                </span>
              </div>
            </div>
          </BaseCard>
        </div>
        <div v-else class="text-center py-12">
          <ShoppingBagIcon class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">Nenhuma compra registrada</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Carregando dados..." />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  SparklesIcon, 
  TrophyIcon, 
  GiftIcon, 
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAuth } from '@/composables/useAuth'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useHistoryStore } from '@/stores/historyStore'

const router = useRouter()
const { user, points: userPoints } = useAuth()
const rewardsStore = useRewardsStore()
const historyStore = useHistoryStore()

const loading = ref(true)
const activeTab = ref<'points' | 'purchases'>('points')

const userName = computed(() => user.value?.name.split(' ')[0] || 'Usuário')

const nextReward = computed(() => {
  const affordable = rewardsStore.availableRewards
    .filter(r => r.pointsCost > userPoints.value)
    .sort((a, b) => a.pointsCost - b.pointsCost)
  return affordable[0]
})

const canRedeemNext = computed(() => {
  if (!nextReward.value) return false
  return userPoints.value >= nextReward.value.pointsCost
})

const pointsNeeded = computed(() => {
  if (!nextReward.value) return 0
  return Math.max(0, nextReward.value.pointsCost - userPoints.value)
})

const progressPercentage = computed(() => {
  if (!nextReward.value) return 0
  return Math.round((userPoints.value / nextReward.value.pointsCost) * 100)
})

const totalEarned = computed(() => historyStore.totalPointsEarned)
const totalRedeemed = computed(() => historyStore.totalPointsRedeemed)

const recentPointsEarned = computed(() => {
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  
  return historyStore.pointTransactions
    .filter(t => t.type === 'earn' && new Date(t.createdAt) >= thisMonth)
    .reduce((sum, t) => sum + t.points, 0)
})

const recentTransactions = computed(() => historyStore.recentTransactions)
const recentPurchases = computed(() => historyStore.recentPurchases)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `${days} dias atrás`
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const goToRewards = () => {
  router.push('/rewards')
}

onMounted(async () => {
  try {
    await Promise.all([
      rewardsStore.fetchRewards(),
      historyStore.fetchAll()
    ])
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>

