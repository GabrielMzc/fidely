<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link 
            to="/dashboard" 
            class="flex items-center gap-2 text-primary-600 dark:text-primary-400"
          >
            <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              F+
            </div>
            <span class="text-xl font-bold hidden sm:inline">Fidely+</span>
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <router-link
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              class="nav-link"
              :class="{ 'nav-link-active': isActive(item.path) }"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.label }}</span>
            </router-link>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <!-- Points Display -->
            <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <SparklesIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span class="font-bold text-primary-700 dark:text-primary-300">
                {{ userPoints }} pts
              </span>
            </div>

            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              <SunIcon v-if="isDark" class="w-6 h-6 text-yellow-500" />
              <MoonIcon v-else class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>

            <!-- Profile Menu -->
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {{ userInitials }}
                </div>
              </MenuButton>

              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-border focus:outline-none">
                  <div class="p-3 border-b border-gray-200 dark:border-dark-border">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ user?.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {{ user?.email }}
                    </p>
                  </div>
                  
                  <div class="p-1">
                    <MenuItem v-slot="{ active }">
                      <router-link
                        to="/profile"
                        :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300']"
                      >
                        <UserCircleIcon class="w-5 h-5" />
                        Meu Perfil
                      </router-link>
                    </MenuItem>

                    <!-- Admin Panel Link - Only for admins -->
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <router-link
                        to="/admin/dashboard"
                        :class="[active ? 'bg-orange-50 dark:bg-orange-900/20' : '', 'flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-orange-600 dark:text-orange-400 font-semibold']"
                      >
                        <CogIcon class="w-5 h-5" />
                        Painel Admin
                      </router-link>
                    </MenuItem>
                    
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleLogout"
                        :class="[active ? 'bg-red-50 dark:bg-red-900/20' : '', 'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 dark:text-red-400']"
                      >
                        <ArrowRightOnRectangleIcon class="w-5 h-5" />
                        Sair
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>

            <!-- Mobile Menu Button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <XMarkIcon v-else class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <nav v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-dark-border">
            <router-link
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': isActive(item.path) }"
              @click="mobileMenuOpen = false"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.label }}</span>
            </router-link>

            <!-- Admin Panel Link - Mobile - Only for admins -->
            <router-link
              v-if="authStore.isAdmin"
              to="/admin/dashboard"
              class="mobile-nav-link bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-semibold border-t border-b border-orange-200 dark:border-orange-800 my-2"
              @click="mobileMenuOpen = false"
            >
              <CogIcon class="w-5 h-5" />
              <span>Painel Admin</span>
            </router-link>
            
            <!-- Points Display Mobile -->
            <div class="sm:hidden flex items-center justify-center gap-2 mt-4 mx-4 px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <SparklesIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span class="font-bold text-primary-700 dark:text-primary-300">
                {{ userPoints }} pontos
              </span>
            </div>
          </nav>
        </transition>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <!-- Toast Notifications -->
    <ToastNotifications />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { 
  HomeIcon, 
  GiftIcon, 
  TicketIcon,
  UserCircleIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  CogIcon
} from '@heroicons/vue/24/outline'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/authStore'
import ToastNotifications from '@/components/ToastNotifications.vue'

const route = useRoute()
const router = useRouter()
const { isDark, toggleDarkMode } = useDarkMode()
const { user, points: userPoints, logout } = useAuth()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { label: 'Recompensas', path: '/rewards', icon: GiftIcon },
  { label: 'Minhas Recompensas', path: '/my-rewards', icon: TicketIcon }
]

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const isActive = (path: string) => {
  return route.path === path
}

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium;
}

.nav-link-active {
  @apply bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300;
}

.mobile-nav-link {
  @apply flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium;
}

.mobile-nav-link-active {
  @apply bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300;
}
</style>

