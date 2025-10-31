<template>
  <!-- Mobile-First Stats Card -->
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-slate-700">
    <!-- Icon & Value (Mobile: stacked, Desktop: row) -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div class="flex items-center gap-3">
        <!-- Icon -->
        <div 
          class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          :class="iconBgClass"
        >
          <component :is="icon" class="w-6 h-6" :class="iconColorClass" />
        </div>
        
        <!-- Mobile: Label next to icon -->
        <div class="sm:hidden">
          <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ label }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            {{ formattedValue }}
          </p>
        </div>
      </div>

      <!-- Desktop: Value top right -->
      <div class="hidden sm:block text-right">
        <p class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          {{ formattedValue }}
        </p>
      </div>
    </div>

    <!-- Desktop: Label below icon -->
    <div class="hidden sm:block mt-3">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
        {{ label }}
      </p>
    </div>

    <!-- Trend (optional) -->
    <div v-if="trend" class="flex items-center gap-1.5 mt-3 sm:mt-4">
      <ArrowTrendingUpIcon 
        v-if="trend.direction === 'up'" 
        class="w-4 h-4 text-green-600 dark:text-green-400" 
      />
      <ArrowTrendingDownIcon 
        v-else 
        class="w-4 h-4 text-red-600 dark:text-red-400" 
      />
      <span 
        class="text-xs sm:text-sm font-medium"
        :class="trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
      >
        {{ trend.value }}
      </span>
      <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {{ trend.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/vue/24/outline'

interface Trend {
  direction: 'up' | 'down'
  value: string
  label: string
}

interface Props {
  label: string
  value: number | string
  icon: Component
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  trend?: Trend
  formatType?: 'number' | 'currency' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  formatType: 'number'
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  
  switch (props.formatType) {
    case 'currency':
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(props.value)
    case 'percentage':
      return `${props.value}%`
    default:
      return new Intl.NumberFormat('pt-BR').format(props.value)
  }
})

const iconBgClass = computed(() => {
  const variants = {
    primary: 'bg-orange-100 dark:bg-orange-900/20',
    success: 'bg-green-100 dark:bg-green-900/20',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20',
    danger: 'bg-red-100 dark:bg-red-900/20',
    info: 'bg-blue-100 dark:bg-blue-900/20'
  }
  return variants[props.variant]
})

const iconColorClass = computed(() => {
  const variants = {
    primary: 'text-orange-600 dark:text-orange-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400'
  }
  return variants[props.variant]
})
</script>

