import { ref, watch, onMounted } from 'vue'

/**
 * Composable para gerenciar o Dark Mode
 * Persiste a preferência do usuário no localStorage
 */
export function useDarkMode() {
  const isDark = ref(false)
  const STORAGE_KEY = 'fidely-dark-mode'

  // Carrega preferência salva
  const loadPreference = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      isDark.value = saved === 'true'
    } else {
      // Se não houver preferência salva, usa a preferência do sistema
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  // Salva preferência
  const savePreference = (value: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(value))
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
  }

  // Aplica a classe 'dark' no elemento HTML
  const applyDarkMode = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Watch para aplicar mudanças
  watch(isDark, (newValue) => {
    applyDarkMode(newValue)
    savePreference(newValue)
  }, { immediate: true })

  // Carrega preferência ao montar
  onMounted(() => {
    loadPreference()
    applyDarkMode(isDark.value)
  })

  return {
    isDark,
    toggleDarkMode
  }
}


