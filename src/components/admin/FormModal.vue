<template>
  <!-- Mobile-First Form Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="translate-y-full sm:translate-y-0 sm:scale-95 opacity-0"
          enter-to-class="translate-y-0 sm:scale-100 opacity-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="translate-y-0 sm:scale-100 opacity-100"
          leave-to-class="translate-y-full sm:translate-y-0 sm:scale-95 opacity-0"
        >
          <div
            v-if="modelValue"
            class="w-full sm:max-w-lg bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] sm:max-h-[85vh] flex flex-col"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <button
                @click="close"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div class="flex flex-col-reverse sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
              <button
                @click="close"
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="$emit('submit')"
                :disabled="loading"
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 dark:disabled:bg-orange-800 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ submitLabel }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
  title: string
  submitLabel?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  submitLabel: 'Salvar',
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit'): void
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>

