<template>
  <div class="space-y-4 sm:space-y-6">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
      Relatórios
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        @click="generateReport('points')"
        class="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
      >
        <ChartBarIcon class="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
        <h3 class="font-bold text-gray-900 dark:text-white mb-1">Relatório de Pontos</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Análise de pontos ganhos e resgatados</p>
      </button>

      <button
        @click="generateReport('rewards')"
        class="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
      >
        <GiftIcon class="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
        <h3 class="font-bold text-gray-900 dark:text-white mb-1">Relatório de Recompensas</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Recompensas mais resgatadas e tendências</p>
      </button>

      <button
        @click="generateReport('users')"
        class="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
      >
        <UsersIcon class="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
        <h3 class="font-bold text-gray-900 dark:text-white mb-1">Relatório de Usuários</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Estatísticas e comportamento dos usuários</p>
      </button>
    </div>

    <div v-if="currentReport" class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ currentReport.type }}</h2>
      <pre class="text-sm bg-gray-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto">{{ JSON.stringify(currentReport.data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { useNotifications } from '@/composables/useNotifications'
import { ChartBarIcon, GiftIcon, UsersIcon } from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()
const { showNotification } = useNotifications()

const currentReport = ref<{ type: string; data: any } | null>(null)

const generateReport = async (type: 'points' | 'rewards' | 'users') => {
  try {
    let data
    switch (type) {
      case 'points':
        data = await adminStore.getPointsReport()
        break
      case 'rewards':
        data = await adminStore.getRewardsReport()
        break
      case 'users':
        data = await adminStore.getUsersReport()
        break
    }
    currentReport.value = {
      type: `Relatório de ${type === 'points' ? 'Pontos' : type === 'rewards' ? 'Recompensas' : 'Usuários'}`,
      data
    }
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  }
}
</script>

