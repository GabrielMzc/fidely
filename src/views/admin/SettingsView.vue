<template>
  <div class="space-y-4 sm:space-y-6">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
      Configurações do Sistema
    </h1>

    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Configurações Gerais</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Taxa de Conversão</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">R$ 1,00 = 1 ponto</p>
          </div>
          <button class="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg">
            Editar
          </button>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Validade Padrão</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">30 dias após o resgate</p>
          </div>
          <button class="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg">
            Editar
          </button>
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Notificações por Email</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Avisos automáticos para usuários</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Ações do Sistema</h2>
      
      <div class="space-y-3">
        <button class="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Limpar Cache</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Remove dados temporários</p>
          </div>
          <ArrowPathIcon class="w-5 h-5 text-gray-400" />
        </button>

        <button class="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Exportar Dados</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Baixar backup completo</p>
          </div>
          <ArrowDownTrayIcon class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
</script>

