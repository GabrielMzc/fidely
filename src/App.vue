<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- Global Toast Notifications -->
    <ToastNotifications />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuthStore } from '@/stores/authStore'
import ToastNotifications from '@/components/ToastNotifications.vue'

const { isDark } = useDarkMode()
const authStore = useAuthStore()

// ⚠️ AUTO-LOGIN PARA TESTES ⚠️
// Loga automaticamente com o usuário de teste
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    try {
      await authStore.login({ 
        cpf: '11144477735', // CPF sem formatação
        password: 'teste123' 
      })
      console.log('✅ Auto-login realizado para testes')
    } catch (error) {
      console.log('⚠️ Erro no auto-login:', error)
    }
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

