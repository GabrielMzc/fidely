<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Gerenciar Promoções
      </h1>
      <button
        @click="openCreateModal"
        class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg"
      >
        <PlusIcon class="w-5 h-5" />
        Nova Promoção
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="promotions"
      :loading="loading"
      searchable
      paginated
    >
      <template #cell-status="{ value }">
        <span
          class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="{
            'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400': value === 'active',
            'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400': value === 'scheduled',
            'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400': value === 'expired',
            'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400': value === 'cancelled'
          }"
        >
          {{ statusLabels[value as keyof typeof statusLabels] }}
        </span>
      </template>

      <template #row-actions="{ row }">
        <div class="flex gap-2">
          <button @click="editPromotion(row)" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
            <PencilIcon class="w-4 h-4" />
          </button>
          <button v-if="row.status === 'active'" @click="cancelPromotion(row)" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <XMarkIcon class="w-4 h-4" />
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
      :title="editingPromotion ? 'Editar Promoção' : 'Nova Promoção'"
      :loading="submitting"
      @submit="handleSubmit"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
          <select v-model="form.type" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
            <option value="bonus_points">Pontos Bônus</option>
            <option value="multiplier">Multiplicador</option>
            <option value="discount_reward">Desconto em Recompensa</option>
            <option value="free_points">Pontos Grátis</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor</label>
          <input v-model.number="form.value" type="number" min="1" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Pontos extras, multiplicador (2x, 3x) ou % de desconto</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Início</label>
            <input v-model="form.startDate" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Fim</label>
            <input v-model="form.endDate" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select v-model="form.status" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
            <option value="active">Ativa</option>
            <option value="scheduled">Agendada</option>
            <option value="expired">Expirada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </div>
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { useAuthStore } from '@/stores/authStore'
import { useNotifications } from '@/composables/useNotifications'
import DataTable from '@/components/admin/DataTable.vue'
import FormModal from '@/components/admin/FormModal.vue'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { Promotion } from '@/types'

const adminStore = useAdminStore()
const authStore = useAuthStore()
const { showNotification } = useNotifications()

const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const editingPromotion = ref<Promotion | null>(null)

const form = ref({
  title: '',
  description: '',
  type: 'bonus_points' as any,
  value: 0,
  startDate: '',
  endDate: '',
  status: 'active' as any,
  createdBy: ''
})

const promotions = computed(() => adminStore.promotions)

const columns = [
  { key: 'title', label: 'Título' },
  { key: 'type', label: 'Tipo', format: (v: string) => typeLabels[v as keyof typeof typeLabels] },
  { key: 'value', label: 'Valor' },
  { key: 'startDate', label: 'Início', format: (v: string) => new Date(v).toLocaleDateString('pt-BR') },
  { key: 'endDate', label: 'Fim', format: (v: string) => new Date(v).toLocaleDateString('pt-BR') },
  { key: 'status', label: 'Status' }
]

const statusLabels = { active: 'Ativa', scheduled: 'Agendada', expired: 'Expirada', cancelled: 'Cancelada' }
const typeLabels = { bonus_points: 'Pontos Bônus', multiplier: 'Multiplicador', discount_reward: 'Desconto', free_points: 'Pontos Grátis' }

const loadPromotions = async () => {
  loading.value = true
  try {
    await adminStore.fetchPromotions()
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingPromotion.value = null
  form.value = { title: '', description: '', type: 'bonus_points', value: 0, startDate: '', endDate: '', status: 'active', createdBy: authStore.user!.id }
  showModal.value = true
}

const editPromotion = (promotion: Promotion) => {
  editingPromotion.value = promotion
  form.value = { ...promotion }
  showModal.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    form.value.createdBy = authStore.user!.id
    if (editingPromotion.value) {
      await adminStore.updatePromotion(editingPromotion.value.id, form.value)
      showNotification({ type: 'success', title: 'Sucesso', message: 'Promoção atualizada' })
    } else {
      await adminStore.createPromotion(form.value)
      showNotification({ type: 'success', title: 'Sucesso', message: 'Promoção criada' })
    }
    showModal.value = false
    await loadPromotions()
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  } finally {
    submitting.value = false
  }
}

const cancelPromotion = async (promotion: Promotion) => {
  try {
    await adminStore.cancelPromotion(promotion.id)
    showNotification({ type: 'success', title: 'Sucesso', message: 'Promoção cancelada' })
    await loadPromotions()
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  }
}

const confirmDelete = (promotion: Promotion) => {
  if (confirm(`Deletar ${promotion.title}?`)) {
    deletePromotion(promotion)
  }
}

const deletePromotion = async (promotion: Promotion) => {
  try {
    await adminStore.deletePromotion(promotion.id)
    showNotification({ type: 'success', title: 'Sucesso', message: 'Promoção deletada' })
    await loadPromotions()
  } catch (error: any) {
    showNotification({ type: 'error', title: 'Erro', message: error.message })
  }
}

onMounted(() => loadPromotions())
</script>

