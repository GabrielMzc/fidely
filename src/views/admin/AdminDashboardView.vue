<template>
  <!-- Mobile-First Admin Dashboard -->
  <div class="space-y-4 sm:space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard Administrativo
      </h1>
      <p class="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        Visão geral do sistema Fidely+
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-32 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
    </div>

    <!-- Stats Cards -->
    <div v-else-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        label="Total de Usuários"
        :value="stats.totalUsers"
        :icon="UsersIcon"
        variant="primary"
      />
      <StatsCard
        label="Usuários Ativos"
        :value="stats.activeUsers"
        :icon="CheckCircleIcon"
        variant="success"
      />
      <StatsCard
        label="Pontos em Circulação"
        :value="stats.totalPoints"
        :icon="SparklesIcon"
        variant="warning"
        format-type="number"
      />
      <StatsCard
        label="Promoções Ativas"
        :value="stats.activePromotions"
        :icon="GiftIcon"
        variant="info"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Recent Users -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Usuários Recentes
          </h2>
          <router-link
            to="/admin/users"
            class="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
          >
            Ver todos
          </router-link>
        </div>

        <div v-if="stats && stats.recentUsers.length > 0" class="space-y-3">
          <div
            v-for="user in stats.recentUsers"
            :key="user.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                <UserIcon class="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ user.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ formatCPF(user.cpf) }}
                </p>
              </div>
            </div>
            <div class="text-right flex-shrink-0 ml-3">
              <p class="text-sm font-bold text-orange-600 dark:text-orange-400">
                {{ user.points }} pts
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(user.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Nenhum usuário recente
        </div>
      </div>

      <!-- Popular Rewards -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Recompensas Populares
          </h2>
          <router-link
            to="/admin/rewards"
            class="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
          >
            Ver todas
          </router-link>
        </div>

        <div v-if="stats && stats.popularRewards.length > 0" class="space-y-3">
          <div
            v-for="item in stats.popularRewards"
            :key="item.reward.id"
            class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50"
          >
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
              <GiftIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ item.reward.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ item.totalRedemptions }} resgates
              </p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-bold text-orange-600 dark:text-orange-400">
                {{ item.reward.pointsCost }} pts
              </p>
            </div>
          </div>
        </div>

        <div v-else class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Nenhuma recompensa resgatada ainda
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Transações Recentes
      </h2>

      <div v-if="stats && stats.recentTransactions.length > 0" class="space-y-2">
        <div
          v-for="transaction in stats.recentTransactions"
          :key="transaction.id"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="transaction.type === 'earn' 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'"
            >
              <ArrowUpIcon v-if="transaction.type === 'earn'" class="w-4 h-4 text-green-600 dark:text-green-400" />
              <ArrowDownIcon v-else class="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ transaction.description }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(transaction.createdAt) }}
              </p>
            </div>
          </div>
          <div class="flex-shrink-0 ml-3">
            <p 
              class="text-sm font-bold"
              :class="transaction.type === 'earn' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'"
            >
              {{ transaction.type === 'earn' ? '+' : '-' }}{{ transaction.points }} pts
            </p>
          </div>
        </div>
      </div>

      <div v-else class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Nenhuma transação recente
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { useNotifications } from '@/composables/useNotifications'
import StatsCard from '@/components/admin/StatsCard.vue'
import {
  UsersIcon,
  CheckCircleIcon,
  SparklesIcon,
  GiftIcon,
  UserIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'
import type { AdminDashboardStats } from '@/types'

const adminStore = useAdminStore()
const { showNotification } = useNotifications()

const loading = ref(true)
const stats = ref<AdminDashboardStats | null>(null)

const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}

const loadDashboard = async () => {
  loading.value = true
  try {
    stats.value = await adminStore.fetchDashboardStats()
  } catch (error: any) {
    showNotification({
      type: 'error',
      title: 'Erro',
      message: error.message || 'Erro ao carregar estatísticas'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

