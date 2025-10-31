<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md">
      <TransitionGroup
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="notificationClasses(notification.type)"
          class="p-4 rounded-lg shadow-lg backdrop-blur-sm flex items-start gap-3 min-w-[320px]"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <component :is="getIcon(notification.type)" class="w-6 h-6" />
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm">{{ notification.title }}</p>
            <p class="text-sm mt-0.5 opacity-90">{{ notification.message }}</p>
          </div>
          
          <!-- Close Button -->
          <button
            type="button"
            class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            @click="remove(notification.id)"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotifications, type NotificationType } from '@/composables/useNotifications'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/solid'

const { notifications, remove } = useNotifications()

const notificationClasses = (type: NotificationType) => {
  const classes = {
    success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
  }
  return classes[type]
}

const getIcon = (type: NotificationType) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[type]
}
</script>


