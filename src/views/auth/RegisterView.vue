<template>
  <div class="animate-fade-in">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Criar conta
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Junte-se ao Fidely+ e comece a acumular pontos
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        v-model="formData.name"
        label="Nome completo"
        type="text"
        placeholder="Seu nome"
        :error="errors.name"
        :icon-left="UserIcon"
        required
        @blur="validateField('name')"
      />

      <BaseInput
        v-model="formData.cpf"
        label="CPF"
        type="text"
        placeholder="000.000.000-00"
        :error="errors.cpf"
        :icon-left="IdentificationIcon"
        required
        @input="formatCPF"
        @blur="validateField('cpf')"
      />

      <BaseInput
        v-model="formData.email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        :error="errors.email"
        :icon-left="EnvelopeIcon"
        required
        @blur="validateField('email')"
      />

      <BaseInput
        v-model="formData.phone"
        label="Telefone"
        type="tel"
        placeholder="(00) 00000-0000"
        :error="errors.phone"
        :icon-left="PhoneIcon"
        required
        @input="formatPhone"
        @blur="validateField('phone')"
      />

      <BaseInput
        v-model="formData.password"
        label="Senha"
        type="password"
        placeholder="Mínimo 6 caracteres"
        :error="errors.password"
        :icon-left="LockClosedIcon"
        required
        @blur="validateField('password')"
      />

      <BaseInput
        v-model="formData.confirmPassword"
        label="Confirmar senha"
        type="password"
        placeholder="Digite a senha novamente"
        :error="errors.confirmPassword"
        :icon-left="LockClosedIcon"
        required
        @blur="validateField('confirmPassword')"
      />

      <label class="flex items-start">
        <input
          v-model="formData.acceptTerms"
          type="checkbox"
          class="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          required
        />
        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          Aceito os 
          <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">termos de uso</a>
          e 
          <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">política de privacidade</a>
        </span>
      </label>

      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        full-width
        :loading="loading"
      >
        Cadastrar
      </BaseButton>
    </form>

    <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      Já tem uma conta?
      <router-link
        to="/login"
        class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold ml-1"
      >
        Fazer login
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  UserIcon, 
  IdentificationIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon 
} from '@heroicons/vue/24/outline'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useFormValidation } from '@/composables/useFormValidation'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { register } = useAuth()
const { validators, validateField: validate, errors } = useFormValidation()
const { success, error: showError } = useNotifications()

const loading = ref(false)

const formData = reactive({
  name: '',
  cpf: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const fieldRules = {
  name: [validators.required(), validators.minLength(3)],
  cpf: [validators.required(), validators.cpf()],
  email: [validators.required(), validators.email()],
  phone: [validators.required(), validators.phone()],
  password: [validators.required(), validators.minLength(6)],
  confirmPassword: [
    validators.required(),
    validators.match(formData.password, 'senha', 'As senhas não coincidem')
  ]
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

const formatPhone = () => {
  let phone = formData.phone.replace(/\D/g, '')
  if (phone.length <= 11) {
    phone = phone.replace(/(\d{2})(\d)/, '($1) $2')
    phone = phone.replace(/(\d{5})(\d)/, '$1-$2')
    formData.phone = phone
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

  if (!formData.acceptTerms) {
    showError('Erro', 'Você precisa aceitar os termos de uso')
    return
  }

  loading.value = true

  try {
    const cpfClean = formData.cpf.replace(/\D/g, '')
    const phoneClean = formData.phone.replace(/\D/g, '')

    await register({
      name: formData.name,
      cpf: cpfClean,
      email: formData.email,
      phone: phoneClean,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    })
    
    success('Cadastro realizado!', 'Bem-vindo ao Fidely+')
    router.push('/dashboard')
  } catch (err: any) {
    showError('Erro ao cadastrar', err.message || 'Tente novamente mais tarde')
  } finally {
    loading.value = false
  }
}
</script>

