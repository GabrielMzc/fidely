import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

/**
 * Composable para gerenciar autenticação
 * Facilita o uso do authStore em componentes
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const points = computed(() => authStore.user?.points || 0)

  const login = async (cpf: string, password: string) => {
    try {
      await authStore.login({ cpf, password })
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const register = async (data: any) => {
    try {
      await authStore.register(data)
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    await authStore.logout()
    router.push('/login')
  }

  const updateProfile = async (data: Partial<any>) => {
    try {
      await authStore.updateProfile(data)
    } catch (error) {
      throw error
    }
  }

  return {
    isAuthenticated,
    user,
    points,
    login,
    register,
    logout,
    updateProfile
  }
}


