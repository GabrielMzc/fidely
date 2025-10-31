<template>
  <div class="space-y-1">
    <router-link
      v-for="item in items"
      :key="item.name"
      :to="item.to"
      @click="$emit('navigate')"
      class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
      :class="[
        isActive(item.to) 
          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
      ]"
    >
      <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
      <span>{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Component } from 'vue'

interface NavigationItem {
  name: string
  to: string
  icon: Component
}

defineProps<{
  items: NavigationItem[]
}>()

defineEmits<{
  (e: 'navigate'): void
}>()

const route = useRoute()

const isActive = (to: string) => {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>

