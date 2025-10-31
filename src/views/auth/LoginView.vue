<template>
  <div class="animate-fade-in">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Bem-vindo de volta!
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Faça login para acessar seus pontos e recompensas
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <BaseInput
        v-model="formData.cpf"
        label="CPF"
        type="text"
        placeholder="000.000.000-00"
        :error="errors.cpf"
        :icon-left="UserIcon"
        required
        @input="formatCPF"
        @blur="validateField('cpf')"
      />

      <BaseInput
        v-model="formData.password"
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        :error="errors.password"
        :icon-left="LockClosedIcon"
        required
        @blur="validateField('password')"
      />

      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
            v-model="formData.remember"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Lembrar de mim
          </span>
        </label>

        <router-link
          to="/forgot-password"
          class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          Esqueceu a senha?
        </router-link>
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        full-width
        :loading="loading"
      >
        Entrar
      </BaseButton>
    </form>

    <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      Ainda não tem conta?
      <router-link
        to="/register"
        class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold ml-1"
      >
        Cadastre-se
      </router-link>
    </div>

    <!-- Demo Credentials -->
    <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <p class="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">
        📌 Dados para teste:
      </p>
      <div class="text-xs text-blue-800 dark:text-blue-400 space-y-1">
        <p><strong>CPF:</strong> 111.444.777-35</p>
        <p><strong>Senha:</strong> qualquer senha</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { UserIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useFormValidation } from '@/composables/useFormValidation'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { login } = useAuth()
const { validators, validateField: validate, errors } = useFormValidation()
const { success, error: showError } = useNotifications()

const loading = ref(false)

const formData = reactive({
  cpf: '',
  password: '',
  remember: false
})

const fieldRules = {
  cpf: [validators.required(), validators.cpf()],
  password: [validators.required(), validators.minLength(4)]
}

const formatCPF = () => {
  let cpf = formData.cpf.replace(/\D/g, '')
  if (cpf.length <= 11) {
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    formData.cpf = cpf
  }
}

const validateField = (field: keyof typeof formData) => {
  if (field in fieldRules) {
    const rules = fieldRules[field as keyof typeof fieldRules]
    validate(field, formData[field], rules)
  }
}

const handleSubmit = async () => {
  // Valida todos os campos
  let hasErrors = false
  Object.keys(fieldRules).forEach(field => {
    validateField(field as keyof typeof formData)
    if (errors[field]) hasErrors = true
  })

  if (hasErrors) return

  loading.value = true

  try {
    const cpfClean = formData.cpf.replace(/\D/g, '')
    await login(cpfClean, formData.password)
    
    success('Login realizado!', 'Bem-vindo de volta ao Fidely+')
    
    // Redireciona para o dashboard ou para a página que tentou acessar
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/dashboard')
  } catch (err: any) {
    showError('Erro ao fazer login', err.message || 'Verifique suas credenciais e tente novamente')
  } finally {
    loading.value = false
  }
}
</script>

