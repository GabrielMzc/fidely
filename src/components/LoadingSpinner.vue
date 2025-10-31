<template>
  <div :class="containerClasses">
    <div :class="spinnerClasses">
      <div class="spinner-border"></div>
    </div>
    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullScreen: false
})

const containerClasses = computed(() => {
  if (props.fullScreen) {
    return 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm z-50'
  }
  return 'flex flex-col items-center justify-center py-8'
})

const spinnerClasses = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
  return `${sizes[props.size]} relative`
})

const textClasses = computed(() => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  return `${sizes[props.size]} mt-4 text-gray-600 dark:text-gray-400 font-medium`
})
</script>

<style scoped>
.spinner-border {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(249, 115, 22, 0.2);
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>


