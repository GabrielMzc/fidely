<template>
  <div class="animate-fade-in space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Catálogo de Recompensas
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Você tem <strong class="text-primary-600 dark:text-primary-400">{{ userPoints }} pontos</strong> disponíveis
      </p>
    </div>

    <!-- Filtros -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectedCategory = category.value"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            selectedCategory === category.value
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-border hover:border-primary-500'
          ]"
        >
          <span class="mr-2">{{ category.icon }}</span>
          {{ category.label }}
        </button>
      </div>

      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <FunnelIcon class="w-5 h-5" />
        {{ filteredRewards.length }} recompensas
      </div>
    </div>

    <!-- Grid de Recompensas -->
    <div v-if="!loading && filteredRewards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="reward in filteredRewards"
        :key="reward.id"
        :padding="false"
        hover
        clickable
        @click="openRewardModal(reward)"
        class="overflow-hidden"
      >
        <!-- Imagem -->
        <div class="relative h-48 overflow-hidden">
          <img 
            :src="reward.imageUrl" 
            :alt="reward.name"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div class="absolute top-3 right-3">
            <BaseBadge 
              :variant="getCategoryVariant(reward.category)" 
              size="sm"
              rounded
            >
              {{ getCategoryLabel(reward.category) }}
            </BaseBadge>
          </div>
        </div>

        <!-- Conteúdo -->
        <div class="p-5">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {{ reward.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {{ reward.description }}
          </p>

          <!-- Pontos e Ação -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <SparklesIcon class="w-5 h-5 text-primary-500" />
              <span class="text-lg font-bold text-gray-900 dark:text-white">
                {{ reward.pointsCost }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">pontos</span>
            </div>

            <div v-if="reward.canRedeem">
              <CheckCircleIcon class="w-6 h-6 text-green-500" />
            </div>
            <div v-else class="text-xs text-gray-500 dark:text-gray-400">
              Faltam {{ reward.pointsCost - userPoints }}
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && filteredRewards.length === 0" class="text-center py-16">
      <GiftIcon class="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Nenhuma recompensa encontrada
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Tente selecionar outra categoria
      </p>
      <BaseButton variant="outline" @click="selectedCategory = 'all'">
        Ver todas as recompensas
      </BaseButton>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" text="Carregando recompensas..." />

    <!-- Modal de Detalhes -->
    <BaseModal
      v-model="showModal"
      title="Detalhes da Recompensa"
      size="lg"
    >
      <div v-if="selectedReward" class="space-y-6">
        <!-- Imagem -->
        <img 
          :src="selectedReward.imageUrl" 
          :alt="selectedReward.name"
          class="w-full h-64 object-cover rounded-lg"
        />

        <!-- Info -->
        <div>
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ selectedReward.name }}
              </h3>
              <BaseBadge 
                :variant="getCategoryVariant(selectedReward.category)"
                size="md"
              >
                {{ getCategoryLabel(selectedReward.category) }}
              </BaseBadge>
            </div>
            <div class="text-right">
              <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                <SparklesIcon class="w-6 h-6" />
                <span class="text-3xl font-bold">{{ selectedReward.pointsCost }}</span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">pontos</p>
            </div>
          </div>

          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ selectedReward.description }}
          </p>

          <!-- Detalhes Adicionais -->
          <div class="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 space-y-3">
            <div class="flex items-center gap-3 text-sm">
              <CalendarIcon class="w-5 h-5 text-gray-400" />
              <span class="text-gray-700 dark:text-gray-300">
                Válido por <strong>{{ selectedReward.validityDays }} dias</strong> após o resgate
              </span>
            </div>
            <div v-if="selectedReward.terms" class="flex items-start gap-3 text-sm">
              <InformationCircleIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-600 dark:text-gray-400">
                {{ selectedReward.terms }}
              </span>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="flex gap-3">
          <BaseButton
            v-if="selectedReward.canRedeem"
            variant="primary"
            size="lg"
            full-width
            :loading="redeeming"
            @click="handleRedeem"
          >
            Resgatar por {{ selectedReward.pointsCost }} pontos
          </BaseButton>
          <div v-else class="w-full">
            <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
              <ExclamationTriangleIcon class="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <p class="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Pontos insuficientes
              </p>
              <p class="text-xs text-yellow-700 dark:text-yellow-400">
                Você precisa de mais {{ selectedReward.pointsCost - userPoints }} pontos
              </p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="ghost" @click="showModal = false">
          Fechar
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  GiftIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  FunnelIcon,
  CalendarIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAuth } from '@/composables/useAuth'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useNotifications } from '@/composables/useNotifications'
import type { Reward } from '@/types'

const router = useRouter()
const { points: userPoints } = useAuth()
const rewardsStore = useRewardsStore()
const { success, error: showError } = useNotifications()

const loading = ref(true)
const selectedCategory = ref<string>('all')
const showModal = ref(false)
const selectedReward = ref<(Reward & { canRedeem?: boolean }) | null>(null)
const redeeming = ref(false)

const categories = [
  { value: 'all', label: 'Todas', icon: '🎁' },
  { value: 'combo', label: 'Combos', icon: '🍔' },
  { value: 'beverage', label: 'Bebidas', icon: '🥤' },
  { value: 'snack', label: 'Lanches', icon: '🍟' },
  { value: 'discount', label: 'Descontos', icon: '💰' },
  { value: 'special', label: 'Especiais', icon: '⭐' }
]

const filteredRewards = computed(() => {
  if (selectedCategory.value === 'all') {
    return rewardsStore.availableRewards
  }
  return rewardsStore.availableRewards.filter(
    r => r.category === selectedCategory.value
  )
})

const getCategoryLabel = (category: string) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : category
}

const getCategoryVariant = (category: string): any => {
  const variants: Record<string, string> = {
    combo: 'primary',
    beverage: 'info',
    snack: 'warning',
    discount: 'success',
    special: 'secondary'
  }
  return variants[category] || 'gray'
}

const openRewardModal = (reward: Reward & { canRedeem?: boolean }) => {
  selectedReward.value = reward
  showModal.value = true
}

const handleRedeem = async () => {
  if (!selectedReward.value) return

  redeeming.value = true

  try {
    await rewardsStore.redeemReward(selectedReward.value.id)
    
    success(
      'Recompensa resgatada!',
      `${selectedReward.value.name} foi adicionada às suas recompensas`
    )
    
    showModal.value = false
    
    // Pequeno delay antes de redirecionar
    setTimeout(() => {
      router.push('/my-rewards')
    }, 1000)
  } catch (err: any) {
    showError('Erro ao resgatar', err.message)
  } finally {
    redeeming.value = false
  }
}

onMounted(async () => {
  try {
    await rewardsStore.fetchRewards()
  } catch (error) {
    console.error('Erro ao carregar recompensas:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

