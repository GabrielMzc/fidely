import { ref } from 'vue'

/**
 * Composable para sistema de notificações toast
 * Exibe mensagens temporárias para o usuário
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface ToastNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration: number
}

const notifications = ref<ToastNotification[]>([])

export function useNotifications() {
  const show = (
    type: NotificationType,
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    
    const notification: ToastNotification = {
      id,
      type,
      title,
      message,
      duration
    }

    notifications.value.push(notification)

    // Remove automaticamente após a duração
    setTimeout(() => {
      remove(id)
    }, duration)

    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (title: string, message: string, duration?: number) => {
    return show('success', title, message, duration)
  }

  const error = (title: string, message: string, duration?: number) => {
    return show('error', title, message, duration)
  }

  const warning = (title: string, message: string, duration?: number) => {
    return show('warning', title, message, duration)
  }

  const info = (title: string, message: string, duration?: number) => {
    return show('info', title, message, duration)
  }

  const clear = () => {
    notifications.value = []
  }

  // Função helper para usar com objeto
  const showNotification = (options: {
    type: NotificationType
    title: string
    message: string
    duration?: number
  }) => {
    return show(options.type, options.title, options.message, options.duration)
  }

  return {
    notifications,
    show,
    showNotification,
    remove,
    success,
    error,
    warning,
    info,
    clear
  }
}


