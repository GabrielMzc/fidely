<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-card flex items-center justify-center p-4">
    <!-- Logo/Brand -->
    <div class="absolute top-8 left-8">
      <router-link 
        to="/" 
        class="flex items-center gap-3 text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity"
      >
        <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          F+
        </div>
        <span class="text-2xl font-bold">Fidely+</span>
      </router-link>
    </div>

    <!-- Dark Mode Toggle -->
    <button
      @click="toggleDarkMode"
      class="absolute top-8 right-8 p-2 rounded-lg bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      <SunIcon v-if="isDark" class="w-6 h-6 text-yellow-500" />
      <MoonIcon v-else class="w-6 h-6 text-gray-600" />
    </button>

    <!-- Content Container -->
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-dark-border">
        <router-view />
      </div>

      <!-- Footer Links -->
      <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <router-link 
          to="/how-it-works" 
          class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Como funciona?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { isDark, toggleDarkMode } = useDarkMode()
</script>

