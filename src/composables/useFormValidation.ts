import { ref, reactive } from 'vue'

/**
 * Composable para validação de formulários
 * Fornece validadores comuns e gerenciamento de erros
 */

export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

export interface FieldRules {
  [fieldName: string]: ValidationRule[]
}

export function useFormValidation() {
  const errors = reactive<Record<string, string>>({})
  const isValidating = ref(false)

  // Validadores comuns
  const validators = {
    required: (message = 'Este campo é obrigatório'): ValidationRule => ({
      validate: (value: any) => {
        if (typeof value === 'string') return value.trim().length > 0
        if (Array.isArray(value)) return value.length > 0
        return value !== null && value !== undefined
      },
      message
    }),

    email: (message = 'Email inválido'): ValidationRule => ({
      validate: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)
      },
      message
    }),

    cpf: (message = 'CPF inválido'): ValidationRule => ({
      validate: (value: string) => {
        const cpf = value.replace(/[^\d]/g, '')
        if (cpf.length !== 11) return false
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false
        
        // Valida primeiro dígito verificador
        let sum = 0
        for (let i = 0; i < 9; i++) {
          sum += parseInt(cpf.charAt(i)) * (10 - i)
        }
        let digit = 11 - (sum % 11)
        if (digit >= 10) digit = 0
        if (digit !== parseInt(cpf.charAt(9))) return false
        
        // Valida segundo dígito verificador
        sum = 0
        for (let i = 0; i < 10; i++) {
          sum += parseInt(cpf.charAt(i)) * (11 - i)
        }
        digit = 11 - (sum % 11)
        if (digit >= 10) digit = 0
        if (digit !== parseInt(cpf.charAt(10))) return false
        
        return true
      },
      message
    }),

    phone: (message = 'Telefone inválido'): ValidationRule => ({
      validate: (value: string) => {
        const phone = value.replace(/[^\d]/g, '')
        return phone.length >= 10 && phone.length <= 11
      },
      message
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      validate: (value: string) => value.length >= min,
      message: message || `Mínimo de ${min} caracteres`
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
      validate: (value: string) => value.length <= max,
      message: message || `Máximo de ${max} caracteres`
    }),

    match: (otherValue: any, fieldName: string, message?: string): ValidationRule => ({
      validate: (value: any) => value === otherValue,
      message: message || `Deve ser igual ao campo ${fieldName}`
    }),

    pattern: (regex: RegExp, message = 'Formato inválido'): ValidationRule => ({
      validate: (value: string) => regex.test(value),
      message
    })
  }

  // Valida um campo específico
  const validateField = (fieldName: string, value: any, rules: ValidationRule[]): boolean => {
    delete errors[fieldName]

    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors[fieldName] = rule.message
        return false
      }
    }

    return true
  }

  // Valida todos os campos
  const validateForm = (formData: Record<string, any>, fieldRules: FieldRules): boolean => {
    isValidating.value = true
    
    // Limpa erros anteriores
    Object.keys(errors).forEach(key => delete errors[key])

    let isValid = true

    for (const [fieldName, rules] of Object.entries(fieldRules)) {
      const value = formData[fieldName]
      if (!validateField(fieldName, value, rules)) {
        isValid = false
      }
    }

    isValidating.value = false
    return isValid
  }

  // Limpa erros
  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const clearError = (fieldName: string) => {
    delete errors[fieldName]
  }

  const setError = (fieldName: string, message: string) => {
    errors[fieldName] = message
  }

  const hasError = (fieldName: string): boolean => {
    return fieldName in errors
  }

  const getError = (fieldName: string): string | undefined => {
    return errors[fieldName]
  }

  return {
    errors,
    isValidating,
    validators,
    validateField,
    validateForm,
    clearErrors,
    clearError,
    setError,
    hasError,
    getError
  }
}


