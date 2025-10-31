<template>
  <!-- Mobile-First Data Table -->
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
    <!-- Search & Actions (Mobile-First) -->
    <div v-if="searchable || $slots.actions" class="p-4 border-b border-gray-200 dark:border-slate-700">
      <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <!-- Search -->
        <div v-if="searchable" class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <!-- Actions Slot -->
        <div v-if="$slots.actions" class="flex-shrink-0">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Mobile: Cards View -->
    <div class="block sm:hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>

      <div v-else-if="filteredData.length === 0" class="p-8 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ emptyMessage }}</p>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-slate-700">
        <div
          v-for="(row, index) in paginatedData"
          :key="index"
          class="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <slot name="mobile-row" :row="row" :index="index">
            <!-- Default mobile card layout -->
            <div class="space-y-2">
              <div v-for="column in columns" :key="column.key" class="flex justify-between items-start">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {{ column.label }}:
                </span>
                <span class="text-sm text-gray-900 dark:text-white font-medium ml-2 text-right">
                  {{ getCellValue(row, column) }}
                </span>
              </div>
              <div v-if="$slots.actions" class="pt-2 border-t border-gray-200 dark:border-slate-700">
                <slot name="row-actions" :row="row" />
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Desktop: Table View -->
    <div class="hidden sm:block overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-slate-900/50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              :class="column.align ? `text-${column.align}` : 'text-left'"
            >
              {{ column.label }}
            </th>
            <th v-if="$slots['row-actions']" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
          <tr v-if="loading">
            <td :colspan="columns.length + ($slots['row-actions'] ? 1 : 0)" class="px-6 py-8 text-center">
              <div class="flex flex-col items-center gap-2">
                <div class="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Carregando...</p>
              </div>
            </td>
          </tr>

          <tr v-else-if="filteredData.length === 0">
            <td :colspan="columns.length + ($slots['row-actions'] ? 1 : 0)" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {{ emptyMessage }}
            </td>
          </tr>

          <tr
            v-else
            v-for="(row, index) in paginatedData"
            :key="index"
            class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
              :class="column.align ? `text-${column.align}` : 'text-left'"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="getCellValue(row, column)">
                {{ getCellValue(row, column) }}
              </slot>
            </td>
            <td v-if="$slots['row-actions']" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="row-actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginated && filteredData.length > 0" class="px-4 py-3 border-t border-gray-200 dark:border-slate-700">
      <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <!-- Info -->
        <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
          Mostrando 
          <span class="font-medium">{{ startIndex + 1 }}</span>
          até 
          <span class="font-medium">{{ Math.min(endIndex, filteredData.length) }}</span>
          de 
          <span class="font-medium">{{ filteredData.length }}</span>
          resultados
        </p>

        <!-- Pagination Buttons -->
        <div class="flex items-center justify-center sm:justify-end gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === 1 
              ? 'border-gray-300 dark:border-slate-600 text-gray-400 dark:text-gray-500' 
              : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'"
          >
            Anterior
          </button>

          <span class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === totalPages 
              ? 'border-gray-300 dark:border-slate-600 text-gray-400 dark:text-gray-500' 
              : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface Column {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any) => string
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  searchable?: boolean
  paginated?: boolean
  perPage?: number
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: true,
  paginated: true,
  perPage: 10,
  emptyMessage: 'Nenhum registro encontrado'
})

const searchQuery = ref('')
const currentPage = ref(1)

const filteredData = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.data

  const query = searchQuery.value.toLowerCase()
  return props.data.filter(row => {
    return props.columns.some(column => {
      const value = getCellValue(row, column)
      return String(value).toLowerCase().includes(query)
    })
  })
})

const totalPages = computed(() => {
  if (!props.paginated) return 1
  return Math.ceil(filteredData.value.length / props.perPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * props.perPage
})

const endIndex = computed(() => {
  return startIndex.value + props.perPage
})

const paginatedData = computed(() => {
  if (!props.paginated) return filteredData.value
  return filteredData.value.slice(startIndex.value, endIndex.value)
})

const getCellValue = (row: any, column: Column) => {
  const value = row[column.key]
  return column.format ? column.format(value) : value
}
</script>

