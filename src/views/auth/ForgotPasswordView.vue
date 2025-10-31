<template>
  <div class="animate-fade-in">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
        <KeyIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Recuperar senha
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Digite seu CPF para receber instruções de recuperação
      </p>
    </div>

    <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-5">
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

      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        full-width
        :loading="loading"
      >
        Enviar instruções
      </BaseButton>
    </form>

    <div v-else class="text-center space-y-4">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full">
        <CheckCircleIcon class="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      
      <div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Instruções enviadas!
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Verifique seu email e siga as instruções para redefinir sua senha.
        </p>
      </div>

      <BaseButton
        variant="outline"
        size="md"
        full-width
        @click="submitted = false"
      >
        Enviar novamente
      </BaseButton>
    </div>

    <div class="mt-6 text-center">
      <router-link
        to="/login"
        class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center gap-1"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Voltar para o login
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { KeyIcon, IdentificationIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import { useNotifications } from '@/composables/useNotifications'

const { validators, validateField: validate, errors } = useFormValidation()
const { success, error: showError } = useNotifications()

const loading = ref(false)
const submitted = ref(false)

const formData = reactive({
  cpf: ''
})

const fieldRules = {
  cpf: [validators.required(), validators.cpf()]
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
  validateField('cpf')
  
  if (errors.cpf) return

  loading.value = true

  try {
    // Simula envio de email (em produção, chamaria uma API real)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    submitted.value = true
    success('Email enviado!', 'Verifique sua caixa de entrada')
  } catch (err: any) {
    showError('Erro', 'Não foi possível enviar as instruções. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script>

