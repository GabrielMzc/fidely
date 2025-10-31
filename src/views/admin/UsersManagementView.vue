<template>
  <!-- Mobile-First Users Management -->
  <div class="space-y-4 sm:space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Gerenciar Usuários
        </h1>
        <p class="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Total: {{ users.length }} usuários
        </p>
      </div>

      <button
        @click="openAssignPointsModal(null)"
        class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <SparklesIcon class="w-5 h-5" />
        Atribuir Pontos
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatsCard
        label="Usuários Ativos"
        :value="activeUsers.length"
        :icon="CheckCircleIcon"
        variant="success"
      />
      <StatsCard
        label="Usuários Inativos"
        :value="inactiveUsers.length"
        :icon="XCircleIcon"
        variant="warning"
      />
      <StatsCard
        label="Usuários Bloqueados"
        :value="blockedUsers.length"
        :icon="LockClosedIcon"
        variant="danger"
      />
    </div>

    <!-- Data Table -->
    <DataTable
      :columns="columns"
      :data="users"
      :loading="loading"
      searchable
      paginated
      :per-page="10"
    >
      <template #actions>
        <button
          @click="loadUsers"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowPathIcon class="w-4 h-4" />
          Atualizar
        </button>
      </template>

      <template #cell-status="{ value }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="{
            'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400': value === 'active',
            'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400': value === 'inactive',
            'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400': value === 'blocked'
          }"
        >
          {{ statusLabels[value as keyof typeof statusLabels] }}
        </span>
      </template>

      <template #cell-role="{ value }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="{
            'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400': value === 'admin',
            'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400': value === 'user'
          }"
        >
          {{ roleLabels[value as keyof typeof roleLabels] }}
        </span>
      </template>

      <template #row-actions="{ row }">
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="openAssignPointsModal(row)"
            class="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Atribuir Pontos"
          >
            <SparklesIcon class="w-4 h-4" />
          </button>
          
          <button
            v-if="row.status !== 'blocked'"
            @click="blockUser(row)"
            class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Bloquear"
          >
            <LockClosedIcon class="w-4 h-4" />
          </button>

          <button
            v-else
            @click="unblockUser(row)"
            class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Desbloquear"
          >
            <LockOpenIcon class="w-4 h-4" />
          </button>

          <button
            @click="confirmDeleteUser(row)"
            class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Deletar"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </template>

      <!-- Mobile Card Layout -->
      <template #mobile-row="{ row }">
        <div class="space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                <UserIcon class="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ row.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatCPF(row.cpf) }}</p>
              </div>
            </div>
            <div class="flex gap-1">
              <span
                class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400': row.status === 'active',
                  'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400': row.status === 'inactive',
                  'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400': row.status === 'blocked'
                }"
              >
                {{ statusLabels[row.status as keyof typeof statusLabels] }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Email:</span>
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ row.email }}</p>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Pontos:</span>
              <p class="font-medium text-orange-600 dark:text-orange-400">{{ row.points }}</p>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-gray-200 dark:border-slate-700">
            <button
              @click="openAssignPointsModal(row)"
              class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg"
            >
              <SparklesIcon class="w-4 h-4" />
              Pontos
            </button>
            <button
              v-if="row.status !== 'blocked'"
              @click="blockUser(row)"
              class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg"
            >
              <LockClosedIcon class="w-4 h-4" />
              Bloquear
            </button>
            <button
              v-else
              @click="unblockUser(row)"
              class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <LockOpenIcon class="w-4 h-4" />
              Desbloquear
            </button>
          </div>
        </div>
      </template>
    </DataTable>

    <!-- Assign Points Modal -->
    <FormModal
      v-model="showAssignPointsModal"
      title="Atribuir Pontos"
      submit-label="Atribuir"
      :loading="submitting"
      @submit="handleAssignPoints"
    >
      <div class="space-y-4">
        <div v-if="selectedUser">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Usuário Selecionado
          </label>
          <div class="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <p class="font-medium text-gray-900 dark:text-white">{{ selectedUser.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pontos atuais: {{ selectedUser.points }}</p>
          </div>
        </div>

        <div v-else>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selecionar Usuário
          </label>
          <select
            v-model="pointsForm.userId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Selecione um usuário</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} - {{ user.points }} pontos
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="pointsForm.type = 'credit'"
              class="px-4 py-2 rounded-lg border-2 transition-colors"
              :class="pointsForm.type === 'credit' 
                ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300'"
            >
              Crédito
            </button>
            <button
              type="button"
              @click="pointsForm.type = 'debit'"
              class="px-4 py-2 rounded-lg border-2 transition-colors"
              :class="pointsForm.type === 'debit' 
                ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
                : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300'"
            >
              Débito
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantidade de Pontos
          </label>
          <input
            v-model.number="pointsForm.points"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Motivo
          </label>
          <textarea
            v-model="pointsForm.reason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
          ></textarea>
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
import StatsCard from '@/components/admin/StatsCard.vue'
import FormModal from '@/components/admin/FormModal.vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  SparklesIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import type { User } from '@/types'

const adminStore = useAdminStore()
const authStore = useAuthStore()
const { showNotification } = useNotifications()

const loading = ref(false)
const submitting = ref(false)
const showAssignPointsModal = ref(false)
const selectedUser = ref<User | null>(null)

const pointsForm = ref({
  userId: '',
  type: 'credit' as 'credit' | 'debit',
  points: 0,
  reason: ''
})

const users = computed(() => adminStore.users)
const activeUsers = computed(() => adminStore.activeUsers)
const inactiveUsers = computed(() => adminStore.inactiveUsers)
const blockedUsers = computed(() => adminStore.blockedUsers)

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'cpf', label: 'CPF', format: (v: string) => formatCPF(v) },
  { key: 'email', label: 'Email' },
  { key: 'points', label: 'Pontos', align: 'center' as const },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Função' }
]

const statusLabels = {
  active: 'Ativo',
  inactive: 'Inativo',
  blocked: 'Bloqueado'
}

const roleLabels = {
  user: 'Usuário',
  admin: 'Admin'
}

const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const loadUsers = async () => {
  loading.value = true
  try {
    await adminStore.fetchUsers()
  } catch (error: any) {
    showNotification({
      type: 'error',
      title: 'Erro',
      message: error.message || 'Erro ao carregar usuários'
    })
  } finally {
    loading.value = false
  }
}

const openAssignPointsModal = (user: User | null) => {
  selectedUser.value = user
  pointsForm.value = {
    userId: user?.id || '',
    type: 'credit',
    points: 0,
    reason: ''
  }
  showAssignPointsModal.value = true
}

const handleAssignPoints = async () => {
  if (!pointsForm.value.userId || pointsForm.value.points <= 0 || !pointsForm.value.reason) {
    showNotification({
      type: 'error',
      title: 'Erro',
      message: 'Preencha todos os campos'
    })
    return
  }

  submitting.value = true
  try {
    await adminStore.assignPoints({
      ...pointsForm.value,
      assignedBy: authStore.user!.id
    })

    showNotification({
      type: 'success',
      title: 'Sucesso',
      message: 'Pontos atribuídos com sucesso'
    })

    showAssignPointsModal.value = false
    await loadUsers()
  } catch (error: any) {
    showNotification({
      type: 'error',
      title: 'Erro',
      message: error.message || 'Erro ao atribuir pontos'
    })
  } finally {
    submitting.value = false
  }
}

const blockUser = async (user: User) => {
  try {
    await adminStore.blockUser(user.id)
    showNotification({
      type: 'success',
      title: 'Sucesso',
      message: `${user.name} foi bloqueado`
    })
  } catch (error: any) {
    showNotification({
      type: 'error',
      title: 'Erro',
      message: error.message || 'Erro ao bloquear usuário'
    })
  }
}

const unblockUser = async (user: User) => {
  try {
    await adminStore.unblockUser(user.id)
    showNotification({
      type: 'success',
      title: 'Sucesso',
      message: `${user.name} foi desbloqueado`
    })
  } catch (error: any) {
    showNotification({
      type: 'error',
      title: 'Erro',
      message: error.message || 'Erro ao desbloquear usuário'
    })
  }
}

const confirmDeleteUser = (user: User) => {
  if (confirm(`Tem certeza que deseja deletar ${user.name}? Esta ação não pode ser desfeita.`)) {
    deleteUser(user)
  }
}

const deleteUser = async (user: User) => {
  try {
    await adminStore.deleteUser(user.id)
    showNotification({
      type: 'success',
      title: 'Sucesso',
      message: `${user.name} foi deletado`
    })
  } catch (error: any) {
    showNotification({
      type: 'error',
      title: 'Erro',
      message: error.message || 'Erro ao deletar usuário'
    })
  }
}

onMounted(() => {
  loadUsers()
})
</script>

