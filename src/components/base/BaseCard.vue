<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
      </slot>
    </div>
    
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  padding?: boolean
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: true,
  hover: false,
  clickable: false
})

const baseClasses = 'bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border transition-all duration-200'

const hoverClasses = computed(() => 
  props.hover ? 'hover:shadow-hover hover:-translate-y-1' : 'shadow-soft'
)

const clickableClasses = computed(() => 
  props.clickable ? 'cursor-pointer' : ''
)

const cardClasses = computed(() => [
  baseClasses,
  hoverClasses.value,
  clickableClasses.value
])

const bodyClasses = computed(() => 
  props.padding ? 'p-6' : ''
)
</script>


