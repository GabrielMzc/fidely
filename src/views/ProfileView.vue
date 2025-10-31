<template>
  <div class="animate-fade-in space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Meu Perfil
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Gerencie suas informações e preferências
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <BaseCard>
          <!-- Avatar -->
          <div class="text-center mb-6">
            <div class="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
              {{ userInitials }}
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ user?.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Membro desde {{ memberSince }}
            </p>
          </div>

          <!-- Stats -->
          <div class="space-y-3 pt-6 border-t border-gray-200 dark:border-dark-border">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Pontos</span>
              <span class="font-bold text-primary-600 dark:text-primary-400">
                {{ user?.points }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Recompensas</span>
              <span class="font-bold text-gray-900 dark:text-white">
                {{ totalRewards }}
              </span>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Informações Pessoais -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Informações Pessoais
              </h2>
              <BaseButton
                v-if="!editingProfile"
                variant="outline"
                size="sm"
                @click="startEditProfile"
              >
                <PencilIcon class="w-4 h-4 mr-2" />
                Editar
              </BaseButton>
            </div>
          </template>

          <form v-if="editingProfile" @submit.prevent="saveProfile" class="space-y-4">
            <BaseInput
              v-model="profileForm.name"
              label="Nome completo"
              :error="profileErrors.name"
              required
            />

            <BaseInput
              v-model="profileForm.email"
              label="Email"
              type="email"
              :error="profileErrors.email"
              required
            />

            <BaseInput
              v-model="profileForm.phone"
              label="Telefone"
              type="tel"
              :error="profileErrors.phone"
              @input="formatPhone"
              required
            />

            <div class="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <InformationCircleIcon class="w-5 h-5" />
                <span>CPF não pode ser alterado por segurança</span>
              </div>
              <p class="text-sm font-mono font-semibold text-gray-900 dark:text-white mt-2">
                {{ formatCPF(user?.cpf || '') }}
              </p>
            </div>

            <div class="flex gap-3">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="savingProfile"
              >
                Salvar Alterações
              </BaseButton>
              <BaseButton
                type="button"
                variant="ghost"
                @click="cancelEditProfile"
              >
                Cancelar
              </BaseButton>
            </div>
          </form>

          <div v-else class="space-y-4">
            <div>
              <label class="text-sm text-gray-500 dark:text-gray-400">Nome</label>
              <p class="font-medium text-gray-900 dark:text-white">{{ user?.name }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500 dark:text-gray-400">CPF</label>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatCPF(user?.cpf || '') }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500 dark:text-gray-400">Email</label>
              <p class="font-medium text-gray-900 dark:text-white">{{ user?.email }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500 dark:text-gray-400">Telefone</label>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatPhoneDisplay(user?.phone || '') }}</p>
            </div>
          </div>
        </BaseCard>

        <!-- Preferências -->
        <BaseCard>
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Preferências
            </h2>
          </template>

          <div class="space-y-4">
            <!-- Dark Mode -->
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                  <MoonIcon v-if="isDark" class="w-5 h-5 text-yellow-500" />
                  <SunIcon v-else class="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Modo Escuro</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Tema escuro para a interface</p>
                </div>
              </div>
              <button
                @click="toggleDarkMode"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  isDark ? 'bg-primary-600' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <!-- Notificações -->
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                  <BellIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Notificações</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Receber notificações de pontos e recompensas</p>
                </div>
              </div>
              <button
                @click="toggleNotifications"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  notificationsEnabled ? 'bg-primary-600' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <!-- Email Notifications -->
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                  <EnvelopeIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Notificações por Email</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Receber novidades por email</p>
                </div>
              </div>
              <button
                @click="toggleEmailNotifications"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  emailNotificationsEnabled ? 'bg-primary-600' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>
        </BaseCard>

        <!-- Zona de Perigo -->
        <BaseCard>
          <template #header>
            <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">
              Zona de Perigo
            </h2>
          </template>

          <div class="space-y-4">
            <div class="flex items-start justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Sair da conta</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Você será desconectado do sistema
                </p>
              </div>
              <BaseButton variant="danger" size="sm" @click="handleLogout">
                <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" />
                Sair
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { 
  PencilIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useAuth } from '@/composables/useAuth'
import { useDarkMode } from '@/composables/useDarkMode'
import { useNotifications } from '@/composables/useNotifications'
import { useRewardsStore } from '@/stores/rewardsStore'

const { user, logout, updateProfile } = useAuth()
const { isDark, toggleDarkMode } = useDarkMode()
const { success, error: showError } = useNotifications()
const rewardsStore = useRewardsStore()

const editingProfile = ref(false)
const savingProfile = ref(false)

const profileForm = reactive({
  name: '',
  email: '',
  phone: ''
})

const profileErrors = reactive({
  name: '',
  email: '',
  phone: ''
})

const notificationsEnabled = ref(user.value?.preferences.notifications ?? true)
const emailNotificationsEnabled = ref(user.value?.preferences.emailNotifications ?? true)

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const memberSince = computed(() => {
  if (!user.value?.createdAt) return ''
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

const totalRewards = computed(() => rewardsStore.redeemedRewards.length)

const formatCPF = (cpf: string) => {
  if (!cpf) return ''
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatPhoneDisplay = (phone: string) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

const formatPhone = () => {
  let phone = profileForm.phone.replace(/\D/g, '')
  if (phone.length <= 11) {
    phone = phone.replace(/(\d{2})(\d)/, '($1) $2')
    phone = phone.replace(/(\d{5})(\d)/, '$1-$2')
    profileForm.phone = phone
  }
}

const startEditProfile = () => {
  if (user.value) {
    profileForm.name = user.value.name
    profileForm.email = user.value.email
    profileForm.phone = formatPhoneDisplay(user.value.phone)
  }
  editingProfile.value = true
}

const cancelEditProfile = () => {
  editingProfile.value = false
  Object.keys(profileErrors).forEach(key => {
    profileErrors[key as keyof typeof profileErrors] = ''
  })
}

const saveProfile = async () => {
  // Reset errors
  Object.keys(profileErrors).forEach(key => {
    profileErrors[key as keyof typeof profileErrors] = ''
  })

  // Validações básicas
  if (!profileForm.name) {
    profileErrors.name = 'Nome é obrigatório'
    return
  }
  if (!profileForm.email) {
    profileErrors.email = 'Email é obrigatório'
    return
  }
  if (!profileForm.phone) {
    profileErrors.phone = 'Telefone é obrigatório'
    return
  }

  savingProfile.value = true

  try {
    const phoneClean = profileForm.phone.replace(/\D/g, '')
    
    await updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: phoneClean
    })

    success('Perfil atualizado!', 'Suas informações foram salvas com sucesso')
    editingProfile.value = false
  } catch (err: any) {
    showError('Erro ao salvar', err.message)
  } finally {
    savingProfile.value = false
  }
}

const toggleNotifications = async () => {
  notificationsEnabled.value = !notificationsEnabled.value
  try {
    await updateProfile({
      preferences: {
        ...user.value?.preferences,
        notifications: notificationsEnabled.value
      }
    })
    success('Preferência atualizada', 'Configuração de notificações salva')
  } catch (err: any) {
    showError('Erro', 'Não foi possível atualizar a preferência')
    notificationsEnabled.value = !notificationsEnabled.value
  }
}

const toggleEmailNotifications = async () => {
  emailNotificationsEnabled.value = !emailNotificationsEnabled.value
  try {
    await updateProfile({
      preferences: {
        ...user.value?.preferences,
        emailNotifications: emailNotificationsEnabled.value
      }
    })
    success('Preferência atualizada', 'Configuração de emails salva')
  } catch (err: any) {
    showError('Erro', 'Não foi possível atualizar a preferência')
    emailNotificationsEnabled.value = !emailNotificationsEnabled.value
  }
}

const handleLogout = async () => {
  await logout()
}
</script>

