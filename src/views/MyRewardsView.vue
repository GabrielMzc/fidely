<template>
  <div class="animate-fade-in space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Minhas Recompensas
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Apresente o QR Code na lanchonete para usar suas recompensas
      </p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-dark-border">
      <nav class="flex gap-6">
        <button
          @click="activeTab = 'active'"
          :class="[
            'pb-4 border-b-2 font-medium transition-colors flex items-center gap-2',
            activeTab === 'active'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          ]"
        >
          <TicketIcon class="w-5 h-5" />
          Ativas
          <BaseBadge v-if="activeRewards.length > 0" variant="primary" size="sm" rounded>
            {{ activeRewards.length }}
          </BaseBadge>
        </button>
        <button
          @click="activeTab = 'used'"
          :class="[
            'pb-4 border-b-2 font-medium transition-colors flex items-center gap-2',
            activeTab === 'used'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          ]"
        >
          <CheckCircleIcon class="w-5 h-5" />
          Usadas
        </button>
        <button
          @click="activeTab = 'expired'"
          :class="[
            'pb-4 border-b-2 font-medium transition-colors flex items-center gap-2',
            activeTab === 'expired'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          ]"
        >
          <ClockIcon class="w-5 h-5" />
          Expiradas
        </button>
      </nav>
    </div>

    <!-- Recompensas Ativas -->
    <div v-if="activeTab === 'active'">
      <div v-if="activeRewards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseCard
          v-for="redeemedReward in activeRewards"
          :key="redeemedReward.id"
          :padding="false"
          hover
          clickable
          @click="openQRModal(redeemedReward)"
          class="overflow-hidden"
        >
          <!-- Imagem -->
          <div class="relative h-40">
            <img 
              :src="redeemedReward.reward.imageUrl" 
              :alt="redeemedReward.reward.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-3 right-3">
              <BaseBadge variant="success" size="sm" rounded>
                Ativa
              </BaseBadge>
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {{ redeemedReward.reward.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Código: <span class="font-mono font-semibold">{{ redeemedReward.code }}</span>
            </p>

            <!-- Validade -->
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <CalendarIcon class="w-4 h-4" />
                Expira em
              </div>
              <span :class="getExpiryClass(redeemedReward.expiresAt)">
                {{ formatExpiryDate(redeemedReward.expiresAt) }}
              </span>
            </div>
          </div>
        </BaseCard>
      </div>

      <div v-else class="text-center py-16">
        <TicketIcon class="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma recompensa ativa
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Visite o catálogo e resgate suas primeiras recompensas
        </p>
        <BaseButton variant="primary" @click="goToRewards">
          Ver Catálogo
        </BaseButton>
      </div>
    </div>

    <!-- Recompensas Usadas -->
    <div v-if="activeTab === 'used'">
      <div v-if="usedRewards.length > 0" class="space-y-4">
        <BaseCard
          v-for="redeemedReward in usedRewards"
          :key="redeemedReward.id"
        >
          <div class="flex items-start gap-4">
            <img 
              :src="redeemedReward.reward.imageUrl" 
              :alt="redeemedReward.reward.name"
              class="w-24 h-24 object-cover rounded-lg opacity-60"
            />
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ redeemedReward.reward.name }}
                </h3>
                <BaseBadge variant="gray" size="sm">
                  Usada
                </BaseBadge>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Código: {{ redeemedReward.code }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Resgatada em {{ formatDate(redeemedReward.redeemedAt) }}
                <span v-if="redeemedReward.usedAt">
                  • Usada em {{ formatDate(redeemedReward.usedAt) }}
                </span>
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <div v-else class="text-center py-16">
        <CheckCircleIcon class="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">
          Nenhuma recompensa usada ainda
        </p>
      </div>
    </div>

    <!-- Recompensas Expiradas -->
    <div v-if="activeTab === 'expired'">
      <div v-if="expiredRewards.length > 0" class="space-y-4">
        <BaseCard
          v-for="redeemedReward in expiredRewards"
          :key="redeemedReward.id"
        >
          <div class="flex items-start gap-4">
            <img 
              :src="redeemedReward.reward.imageUrl" 
              :alt="redeemedReward.reward.name"
              class="w-24 h-24 object-cover rounded-lg opacity-50 grayscale"
            />
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ redeemedReward.reward.name }}
                </h3>
                <BaseBadge variant="danger" size="sm">
                  Expirada
                </BaseBadge>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Código: {{ redeemedReward.code }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Resgatada em {{ formatDate(redeemedReward.redeemedAt) }}
                • Expirou em {{ formatDate(redeemedReward.expiresAt) }}
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <div v-else class="text-center py-16">
        <ClockIcon class="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">
          Nenhuma recompensa expirada
        </p>
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" text="Carregando recompensas..." />

    <!-- Modal QR Code -->
    <BaseModal
      v-model="showQRModal"
      :title="selectedRedeemedReward?.reward.name"
      size="md"
    >
      <div v-if="selectedRedeemedReward" class="space-y-6">
        <!-- QR Code -->
        <div class="bg-white dark:bg-white p-6 rounded-xl flex items-center justify-center">
          <img 
            :src="selectedRedeemedReward.qrCode" 
            alt="QR Code"
            class="w-64 h-64"
          />
        </div>

        <!-- Código -->
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Código da recompensa
          </p>
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-dark-bg rounded-lg">
            <span class="text-2xl font-mono font-bold text-gray-900 dark:text-white">
              {{ selectedRedeemedReward.code }}
            </span>
            <button
              @click="copyCode(selectedRedeemedReward.code)"
              class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Copiar código"
            >
              <DocumentDuplicateIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Instruções -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div class="flex gap-3">
            <InformationCircleIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-blue-800 dark:text-blue-300">
              <p class="font-semibold mb-2">Como usar:</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>Apresente este QR Code ou código no caixa</li>
                <li>Aguarde a validação</li>
                <li>Aproveite sua recompensa!</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Validade -->
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <CalendarIcon class="w-5 h-5" />
            <span class="text-sm">Válido até</span>
          </div>
          <span :class="['font-semibold text-sm', getExpiryClass(selectedRedeemedReward.expiresAt)]">
            {{ formatFullDate(selectedRedeemedReward.expiresAt) }}
          </span>
        </div>

        <!-- Termos -->
        <div v-if="selectedRedeemedReward.reward.terms" class="text-xs text-gray-500 dark:text-gray-400">
          <p class="font-semibold mb-1">Termos e condições:</p>
          <p>{{ selectedRedeemedReward.reward.terms }}</p>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="ghost" @click="showQRModal = false">
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
  TicketIcon, 
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useNotifications } from '@/composables/useNotifications'
import type { RedeemedReward } from '@/types'

const router = useRouter()
const rewardsStore = useRewardsStore()
const { success } = useNotifications()

const loading = ref(true)
const activeTab = ref<'active' | 'used' | 'expired'>('active')
const showQRModal = ref(false)
const selectedRedeemedReward = ref<RedeemedReward | null>(null)

const activeRewards = computed(() => rewardsStore.activeRewards)
const usedRewards = computed(() => rewardsStore.usedRewards)
const expiredRewards = computed(() => rewardsStore.expiredRewards)

const openQRModal = (reward: RedeemedReward) => {
  selectedRedeemedReward.value = reward
  showQRModal.value = true
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    success('Código copiado!', 'O código foi copiado para a área de transferência')
  } catch (err) {
    console.error('Erro ao copiar código:', err)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric'
  })
}

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatExpiryDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  
  if (days < 0) return 'Expirada'
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Amanhã'
  if (days <= 7) return `${days} dias`
  
  return formatDate(dateString)
}

const getExpiryClass = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  
  if (days < 0) return 'text-red-600 dark:text-red-400 font-semibold'
  if (days <= 3) return 'text-yellow-600 dark:text-yellow-400 font-semibold'
  return 'text-green-600 dark:text-green-400 font-semibold'
}

const goToRewards = () => {
  router.push('/rewards')
}

onMounted(async () => {
  try {
    await rewardsStore.fetchRedeemedRewards()
  } catch (error) {
    console.error('Erro ao carregar recompensas:', error)
  } finally {
    loading.value = false
  }
})
</script>

