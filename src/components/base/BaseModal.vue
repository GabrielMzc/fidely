<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        
        <!-- Modal Container -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              :class="modalClasses"
              @click.stop
            >
              <!-- Header -->
              <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
                <slot name="header">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ title }}
                  </h3>
                </slot>
                <button
                  v-if="closable"
                  type="button"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  @click="close"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>
              
              <!-- Body -->
              <div :class="bodyClasses">
                <slot />
              </div>
              
              <!-- Footer -->
              <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
  padding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
  padding: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }
  return sizes[props.size]
})

const modalClasses = computed(() => [
  'relative w-full bg-white dark:bg-dark-card rounded-2xl shadow-2xl',
  sizeClasses.value
])

const bodyClasses = computed(() => 
  props.padding ? 'p-6' : ''
)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}
</script>


