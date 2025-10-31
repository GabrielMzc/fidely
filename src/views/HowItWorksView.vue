<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-card">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <router-link 
            to="/" 
            class="flex items-center gap-3 text-primary-600 dark:text-primary-400"
          >
            <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              F+
            </div>
            <span class="text-2xl font-bold">Fidely+</span>
          </router-link>

          <div class="flex items-center gap-3">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <SunIcon v-if="isDark" class="w-6 h-6 text-yellow-500" />
              <MoonIcon v-else class="w-6 h-6 text-gray-600" />
            </button>
            
            <router-link v-if="!isAuthenticated" to="/login">
              <BaseButton variant="primary">
                Entrar
              </BaseButton>
            </router-link>
            <router-link v-else to="/dashboard">
              <BaseButton variant="primary">
                Ir para Dashboard
              </BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Hero Section -->
      <div class="text-center mb-20 animate-fade-in">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
          <SparklesIcon class="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Como Funciona o Fidely+
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Ganhe pontos em cada compra e troque por recompensas incríveis. É simples, rápido e vantajoso!
        </p>
      </div>

      <!-- Passos -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
        <div 
          v-for="(step, index) in steps"
          :key="index"
          class="relative animate-slide-up"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <BaseCard hover class="text-center h-full">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full text-white text-2xl font-bold mb-4">
              {{ index + 1 }}
            </div>
            <component :is="step.icon" class="w-12 h-12 mx-auto mb-4 text-primary-600 dark:text-primary-400" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {{ step.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ step.description }}
            </p>
          </BaseCard>

          <!-- Arrow -->
          <div v-if="index < steps.length - 1" class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
            <ArrowRightIcon class="w-8 h-8 text-primary-400 dark:text-primary-600" />
          </div>
        </div>
      </div>

      <!-- Vantagens -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Por que usar o Fidely+?
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Vantagens exclusivas para nossos clientes fiéis
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BaseCard 
            v-for="(benefit, index) in benefits"
            :key="index"
            hover
            class="text-center"
          >
            <div :class="['inline-flex items-center justify-center w-16 h-16 rounded-full mb-6', benefit.bgColor]">
              <component :is="benefit.icon" :class="['w-8 h-8', benefit.iconColor]" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {{ benefit.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ benefit.description }}
            </p>
          </BaseCard>
        </div>
      </div>

      <!-- Regras de Pontuação -->
      <div class="mb-20">
        <BaseCard class="max-w-4xl mx-auto">
          <template #header>
            <div class="flex items-center gap-3">
              <CalculatorIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Regras de Pontuação
              </h2>
            </div>
          </template>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircleIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white mb-2">Como ganhar pontos</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-2">
                  A cada R$ 1,00 gasto, você ganha <strong class="text-primary-600 dark:text-primary-400">1 ponto</strong>.
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Exemplo: Compra de R$ 45,90 = 45 pontos
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <GiftIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white mb-2">Resgatando recompensas</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-2">
                  Use seus pontos para resgatar recompensas incríveis no catálogo.
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  As recompensas têm validade após o resgate, fique atento!
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <ClockIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white mb-2">Validade dos pontos</h4>
                <p class="text-gray-600 dark:text-gray-400">
                  Seus pontos <strong>não expiram</strong>! Acumule e use quando quiser.
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- FAQ -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Perguntas Frequentes
          </h2>
        </div>

        <div class="max-w-3xl mx-auto space-y-4">
          <div 
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <h4 class="font-semibold text-left text-gray-900 dark:text-white">
                {{ faq.question }}
              </h4>
              <ChevronDownIcon 
                :class="[
                  'w-5 h-5 text-gray-400 transition-transform',
                  openFaqIndex === index ? 'transform rotate-180' : ''
                ]"
              />
            </button>
            
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform -translate-y-2 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform -translate-y-2 opacity-0"
            >
              <div v-if="openFaqIndex === index" class="px-6 pb-4 text-gray-600 dark:text-gray-400">
                {{ faq.answer }}
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- CTA Final -->
      <div class="text-center">
        <BaseCard class="max-w-2xl mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 border-none">
          <div class="text-white py-8">
            <h2 class="text-3xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p class="text-primary-100 mb-8 text-lg">
              Cadastre-se agora e comece a acumular pontos em suas compras!
            </p>
            <div class="flex gap-4 justify-center">
              <router-link to="/register">
                <BaseButton variant="secondary" size="lg">
                  Criar Conta Grátis
                </BaseButton>
              </router-link>
              <router-link to="/login">
                <BaseButton variant="outline" size="lg" class="!text-white !border-white hover:!bg-white/10">
                  Já tenho conta
                </BaseButton>
              </router-link>
            </div>
          </div>
        </BaseCard>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-dark-border mt-20 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 Fidely+. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  SparklesIcon,
  UserPlusIcon,
  ShoppingBagIcon,
  GiftIcon,
  BoltIcon,
  ShieldCheckIcon,
  HeartIcon,
  CheckCircleIcon,
  ClockIcon,
  CalculatorIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuth } from '@/composables/useAuth'

const { isDark, toggleDarkMode } = useDarkMode()
const { isAuthenticated } = useAuth()

const openFaqIndex = ref<number | null>(null)

const steps = [
  {
    icon: UserPlusIcon,
    title: 'Cadastre-se',
    description: 'Crie sua conta gratuitamente com seu CPF'
  },
  {
    icon: ShoppingBagIcon,
    title: 'Faça compras',
    description: 'Identifique-se pelo CPF em cada compra'
  },
  {
    icon: SparklesIcon,
    title: 'Ganhe pontos',
    description: 'Acumule 1 ponto a cada R$ 1,00 gasto'
  },
  {
    icon: GiftIcon,
    title: 'Troque por prêmios',
    description: 'Resgate recompensas incríveis com seus pontos'
  }
]

const benefits = [
  {
    icon: BoltIcon,
    title: 'Rápido e Fácil',
    description: 'Sistema simples e intuitivo. Ganhe pontos automaticamente em cada compra.',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-600 dark:text-primary-400'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Seguro e Confiável',
    description: 'Seus dados protegidos com criptografia de ponta e total privacidade.',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    icon: HeartIcon,
    title: 'Recompensas Exclusivas',
    description: 'Acesso a promoções e recompensas disponíveis apenas para membros.',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400'
  }
]

const faqs = [
  {
    question: 'Como faço para me cadastrar?',
    answer: 'É muito simples! Clique em "Criar Conta", preencha seus dados (nome, CPF, email, telefone e senha) e pronto! Você já pode começar a acumular pontos.'
  },
  {
    question: 'Como acumulo pontos?',
    answer: 'A cada compra na lanchonete, informe seu CPF no caixa. Você ganhará automaticamente 1 ponto para cada R$ 1,00 gasto. Os pontos são creditados instantaneamente na sua conta.'
  },
  {
    question: 'Os pontos têm validade?',
    answer: 'Não! Seus pontos não expiram. Você pode acumular e usar quando quiser, sem pressa.'
  },
  {
    question: 'Como resgato minhas recompensas?',
    answer: 'Acesse o catálogo de recompensas no app, escolha a que deseja e clique em "Resgatar". Um QR Code será gerado. Apresente esse código no caixa da lanchonete para usar sua recompensa.'
  },
  {
    question: 'As recompensas resgatadas têm prazo de validade?',
    answer: 'Sim, cada recompensa tem um prazo específico após o resgate (geralmente de 15 a 60 dias). Você pode ver a data de validade no detalhes da recompensa.'
  },
  {
    question: 'Posso transferir pontos para outra pessoa?',
    answer: 'Não, os pontos são pessoais e intransferíveis. Cada CPF tem sua própria conta e pontuação.'
  },
  {
    question: 'E se eu perder meu celular?',
    answer: 'Não se preocupe! Seus pontos e recompensas estão salvos na nuvem. Basta fazer login em outro dispositivo com seu CPF e senha.'
  },
  {
    question: 'Posso usar o Fidely+ em todas as unidades?',
    answer: 'Sim! Seu cadastro é válido em todas as unidades participantes da rede.'
  }
]

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}
</script>

