<template>
  <!-- Mobile-First Admin Layout -->
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Mobile Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-slate-800 shadow-sm lg:hidden">
      <div class="flex items-center justify-between px-4 py-3">
        <button 
          @click="toggleMobileMenu"
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>

        <h1 class="text-lg font-bold text-gray-900 dark:text-white">
          Admin Fidely+
        </h1>

        <button 
          @click="toggleDarkMode"
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <MoonIcon v-if="!darkMode" class="w-5 h-5" />
          <SunIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Mobile Navigation Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-30 bg-black/50 lg:hidden"
        @click="mobileMenuOpen = false"
      />
    </Transition>

    <!-- Mobile Sidebar -->
    <Transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside 
        v-if="mobileMenuOpen"
        class="fixed top-0 left-0 z-40 w-72 h-full bg-white dark:bg-slate-800 shadow-xl lg:hidden overflow-y-auto"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400">
              Fidely+ Admin
            </h2>
            <button 
              @click="mobileMenuOpen = false"
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <NavigationMenu :items="navigationItems" @navigate="mobileMenuOpen = false" />
          
          <!-- Back to Client Panel - Mobile -->
          <div class="px-4 mt-4">
            <router-link
              to="/dashboard"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              @click="mobileMenuOpen = false"
            >
              <HomeIcon class="w-5 h-5" />
              Voltar ao Painel Cliente
            </router-link>
          </div>
        </div>
      </aside>
    </Transition>

    <div class="lg:flex lg:h-screen">
      <!-- Desktop Sidebar -->
      <aside class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
        <!-- Logo -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400">
            Fidely+ Admin
          </h2>
          <button 
            @click="toggleDarkMode"
            class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <MoonIcon v-if="!darkMode" class="w-5 h-5" />
            <SunIcon v-else class="w-5 h-5" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-4">
          <NavigationMenu :items="navigationItems" />
        </nav>

        <!-- User Info & Actions -->
        <div class="border-t border-gray-200 dark:border-slate-700 p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <UserIcon class="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ user?.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Administrador
              </p>
            </div>
          </div>

          <!-- Back to Client Panel -->
          <router-link
            to="/dashboard"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 mb-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <HomeIcon class="w-4 h-4" />
            Painel Cliente
          </router-link>

          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 lg:ml-64">
        <div class="p-4 sm:p-6 lg:p-8">
          <!-- Page Content -->
          <router-view />
        </div>

        <!-- Mobile Bottom Navigation for quick actions -->
        <nav class="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 lg:hidden">
          <div class="grid grid-cols-4 gap-1 p-2">
            <router-link
              v-for="item in quickActions"
              :key="item.name"
              :to="item.to"
              class="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              active-class="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="text-xs font-medium">{{ item.name }}</span>
            </router-link>
          </div>
        </nav>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDarkMode } from '@/composables/useDarkMode'
import NavigationMenu from '@/components/admin/NavigationMenu.vue'
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UsersIcon,
  GiftIcon,
  SparklesIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const { isDark: darkMode, toggleDarkMode } = useDarkMode()

const user = computed(() => authStore.user)
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const navigationItems = [
  {
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Usuários',
    to: '/admin/users',
    icon: UsersIcon
  },
  {
    name: 'Recompensas',
    to: '/admin/rewards',
    icon: GiftIcon
  },
  {
    name: 'Promoções',
    to: '/admin/promotions',
    icon: SparklesIcon
  },
  {
    name: 'Relatórios',
    to: '/admin/reports',
    icon: ChartBarIcon
  },
  {
    name: 'Configurações',
    to: '/admin/settings',
    icon: CogIcon
  }
]

const quickActions = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: HomeIcon },
  { name: 'Usuários', to: '/admin/users', icon: UsersIcon },
  { name: 'Recompensas', to: '/admin/rewards', icon: GiftIcon },
  { name: 'Promoções', to: '/admin/promotions', icon: SparklesIcon }
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

