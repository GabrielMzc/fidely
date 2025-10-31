<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="inputId" 
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="iconLeft" class="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="iconRight" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <component :is="iconRight" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  maxlength?: number
  iconLeft?: any
  iconRight?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

const baseClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0'

const stateClasses = computed(() => {
  if (props.error) {
    return 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:text-red-300'
  }
  return 'border-gray-300 dark:border-dark-border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-card'
})

const paddingClasses = computed(() => {
  const base = 'py-2.5'
  if (props.iconLeft && props.iconRight) return `${base} pl-10 pr-10`
  if (props.iconLeft) return `${base} pl-10 pr-3`
  if (props.iconRight) return `${base} pl-3 pr-10`
  return `${base} px-3`
})

const disabledClasses = computed(() => 
  props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''
)

const inputClasses = computed(() => [
  baseClasses,
  stateClasses.value,
  paddingClasses.value,
  disabledClasses.value
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>


