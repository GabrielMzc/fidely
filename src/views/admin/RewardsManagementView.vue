<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Gerenciar Recompensas
      </h1>
      <button
        @click="openCreateModal"
        class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg"
      >
        <PlusIcon class="w-5 h-5" />
        Nova Recompensa
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="rewards"
      :loading="loading"
      searchable
      paginated
    >
      <template #cell-available="{ value }">
        <span
          class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="value ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'"
        >
          {{ value ? 'Disponível' : 'Indisponível' }}
        </span>
      </template>

      <template #row-actions="{ row }">
        <div class="flex gap-2">
          <button @click="editReward(row)" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
            <PencilIcon class="w-4 h-4" />
          </button>
          <button @click="toggleAvailability(row)" class="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg">
            <component :is="row.available ? EyeSlashIcon : EyeIcon" class="w-4 h-4" />
          </button>
          <button @click="confirmDelete(row)" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Form Modal -->
    <FormModal
      v-model="showModal"
      :title="editingReward ? 'Editar Recompensa' : 'Nova Recompensa'"
      :loading="submitting"
      @submit="handleSubmit"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
          <input v-model="form.name" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pontos</label>
            <input v-model.number="form.pointsCost" type="number" min="1" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Validade (dias)</label>
            <input v-model.number="form.validityDays" type="number" min="1" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
          <select v-model="form.category" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
            <option value="combo">Combo</option>
            <option value="beverage">Bebida</option>
            <option value="snack">Lanche</option>
            <option value="discount">Desconto</option>
            <option value="special">Especial</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL da Imagem</label>
          <input v-model="form.imageUrl" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
        </div>
      </div>
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useNotifications } from '@/composables/useNotifications'
import DataTable from '@/components/admin/DataTable.vue'
import FormModal from '@/components/admin/FormModal.vue'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import type { Reward } from '@/types'

const adminStore = useAdminStore()
const rewardsStore = useRewardsStore()
const { showNotification } = useNotifications()

const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const editingReward = ref<Reward | null>(null)

const form = ref({
  name: '',
  description: '',
  pointsCost: 0,
  validityDays: 30,
  category: 'combo' as any,
  imageUrl: '',
  available: true,
  terms: ''
})

const rewards = computed(() => rewardsStore.rewards)

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'pointsCost', label: 'Pontos', align: 'center' as const },
  { key: 'category', label: 'Categoria' },
  { key: 'validityDays', label: 'Validade', format: (v: number) => `${v} dias` },
  { key: 'available', label: 'Status' }
]

const loadRewards = async () => {
  loading.value = true
  try {
    await rewardsStore.fetchRewards()
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingReward.value = null
  form.value = { name: '', description: '', pointsCost: 0, validityDays: 30, category: 'combo', imageUrl: '', available: true, terms: '' }
  showModal.value = true
}

const editReward = (reward: Reward) => {
  editingReward.value = reward
  form.value = { ...reward, terms: reward.terms || '' }
  showModal.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editingReward.value) {
      await adminStore.updateReward(editingReward.value.id, form.value)
      showNotification({ type: 'success', title: 'Sucesso', message: 'Recompensa atualizada' })
    } else {
      await adminStore.createReward(form.value)
      showNotification({ type: 'success', title: 'Sucesso', message: 'Recompensa criada' })
    }
    showModal.value = false
    await loadRewards()
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  } finally {
    submitting.value = false
  }
}

const toggleAvailability = async (reward: Reward) => {
  try {
    await adminStore.updateReward(reward.id, { available: !reward.available })
    showNotification({ type: 'success', title: 'Sucesso', message: 'Status atualizado' })
    await loadRewards()
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  }
}

const confirmDelete = (reward: Reward) => {
  if (confirm(`Deletar ${reward.name}?`)) {
    deleteReward(reward)
  }
}

const deleteReward = async (reward: Reward) => {
  try {
    await adminStore.deleteReward(reward.id)
    showNotification({ type: 'success', title: 'Sucesso', message: 'Recompensa deletada' })
    await loadRewards()
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  }
}

onMounted(() => loadRewards())
</script>

