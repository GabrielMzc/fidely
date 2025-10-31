# 📚 Guia de Desenvolvimento - Fidely+

## Índice
- [Arquitetura e Padrões](#arquitetura-e-padrões)
- [Composables](#composables)
- [Stores Pinia](#stores-pinia)
- [Componentes](#componentes)
- [API e Mock Data](#api-e-mock-data)
- [Validação de Formulários](#validação-de-formulários)
- [Estilização](#estilização)
- [Boas Práticas](#boas-práticas)

---

## 🏗 Arquitetura e Padrões

### Estrutura em Camadas

```
Views → Composables → Stores → API Service → Data Layer
```

### Separação de Responsabilidades

#### Views
- **Responsabilidade**: Apresentação e estrutura da página
- **Não deve**: Conter lógica de negócio complexa
- **Deve**: Usar composables e stores

#### Composables
- **Responsabilidade**: Lógica reutilizável de UI
- **Exemplo**: `useAuth()`, `useDarkMode()`, `useNotifications()`
- **Retorna**: Estado reativo e funções

#### Stores
- **Responsabilidade**: Gerenciamento de estado global
- **Acessa**: API Services
- **Persiste**: Dados críticos no localStorage

#### API Service
- **Responsabilidade**: Comunicação com "backend"
- **Simula**: Delays de rede e respostas reais
- **Validações**: Regras de negócio

---

## 🔧 Composables

### useDarkMode

```typescript
const { isDark, toggleDarkMode } = useDarkMode()

// isDark: ref<boolean> - Estado do dark mode
// toggleDarkMode: () => void - Alterna tema
```

**Features:**
- Persiste preferência no localStorage
- Aplica classe 'dark' no HTML
- Detecta preferência do sistema

### useAuth

```typescript
const { 
  isAuthenticated, 
  user, 
  points,
  login, 
  register, 
  logout 
} = useAuth()

// isAuthenticated: ComputedRef<boolean>
// user: ComputedRef<User | null>
// points: ComputedRef<number>
// login: (cpf: string, password: string) => Promise<void>
```

**Features:**
- Gerencia sessão do usuário
- Redireciona automaticamente
- Integra com authStore

### useNotifications

```typescript
const { 
  notifications, 
  success, 
  error, 
  warning, 
  info 
} = useNotifications()

success('Título', 'Mensagem', 5000)
error('Erro', 'Descrição do erro')
```

**Features:**
- Toast notifications temporárias
- 4 tipos (success, error, warning, info)
- Auto-dismiss configurável
- Componente global `ToastNotifications.vue`

### useFormValidation

```typescript
const { 
  validators, 
  validateField, 
  validateForm,
  errors 
} = useFormValidation()

const rules = {
  email: [validators.required(), validators.email()],
  cpf: [validators.required(), validators.cpf()]
}

validateForm(formData, rules)
```

**Validadores Disponíveis:**
- `required()` - Campo obrigatório
- `email()` - Email válido
- `cpf()` - CPF válido com dígitos verificadores
- `phone()` - Telefone (10-11 dígitos)
- `minLength(n)` - Mínimo de caracteres
- `maxLength(n)` - Máximo de caracteres
- `match(value, field)` - Comparar campos
- `pattern(regex)` - Regex customizado

---

## 📦 Stores Pinia

### authStore

**Estado:**
```typescript
{
  user: User | null,
  token: string | null,
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `login(credentials)` - Autentica usuário
- `register(data)` - Registra novo usuário
- `logout()` - Desloga usuário
- `updateProfile(updates)` - Atualiza perfil
- `updateUserPoints(points)` - Atualiza pontos
- `loadFromStorage()` - Carrega do localStorage

**Getters:**
- `isAuthenticated` - Se está autenticado
- `userPoints` - Pontos do usuário

### rewardsStore

**Estado:**
```typescript
{
  rewards: Reward[],
  redeemedRewards: RedeemedReward[],
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `fetchRewards()` - Busca catálogo
- `redeemReward(id)` - Resgata recompensa
- `fetchRedeemedRewards()` - Busca resgates do usuário
- `getRewardById(id)` - Busca recompensa específica

**Getters:**
- `availableRewards` - Recompensas com flag canRedeem
- `activeRewards` - Recompensas ativas
- `usedRewards` - Recompensas usadas
- `expiredRewards` - Recompensas expiradas
- `rewardsByCategory` - Agrupadas por categoria

### historyStore

**Estado:**
```typescript
{
  pointTransactions: PointTransaction[],
  purchases: Purchase[],
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `fetchPointTransactions()` - Histórico de pontos
- `fetchPurchases()` - Histórico de compras
- `fetchAll()` - Busca tudo em paralelo

**Getters:**
- `totalPointsEarned` - Total ganho
- `totalPointsRedeemed` - Total resgatado
- `totalSpent` - Total gasto em R$
- `recentTransactions` - Últimas 10
- `recentPurchases` - Últimas 5

---

## 🎨 Componentes

### BaseButton

```vue
<BaseButton
  variant="primary"
  size="md"
  :loading="false"
  full-width
  @click="handleClick"
>
  Texto do Botão
</BaseButton>
```

**Props:**
- `variant`: primary | secondary | outline | ghost | danger
- `size`: sm | md | lg
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `icon`: Component (Heroicon)
- `iconPosition`: left | right

### BaseInput

```vue
<BaseInput
  v-model="value"
  label="Email"
  type="email"
  placeholder="seu@email.com"
  :error="errors.email"
  hint="Digite um email válido"
  :icon-left="EnvelopeIcon"
  required
/>
```

**Props:**
- `modelValue`: string | number
- `label`: string
- `type`: string (padrão: text)
- `placeholder`: string
- `error`: string
- `hint`: string
- `disabled`: boolean
- `required`: boolean
- `iconLeft`: Component
- `iconRight`: Component

### BaseCard

```vue
<BaseCard title="Título" hover clickable>
  <template #header>
    <!-- Header customizado -->
  </template>
  
  <!-- Conteúdo principal -->
  
  <template #footer>
    <!-- Footer customizado -->
  </template>
</BaseCard>
```

**Props:**
- `title`: string
- `padding`: boolean (padrão: true)
- `hover`: boolean - Efeito hover
- `clickable`: boolean - Cursor pointer

### BaseModal

```vue
<BaseModal
  v-model="showModal"
  title="Título"
  size="md"
  :closable="true"
  :close-on-backdrop="true"
>
  <!-- Conteúdo -->
  
  <template #footer>
    <BaseButton @click="showModal = false">
      Fechar
    </BaseButton>
  </template>
</BaseModal>
```

**Props:**
- `modelValue`: boolean
- `title`: string
- `size`: sm | md | lg | xl | full
- `closable`: boolean
- `closeOnBackdrop`: boolean
- `padding`: boolean

### BaseBadge

```vue
<BaseBadge variant="success" size="sm" rounded>
  Ativo
</BaseBadge>
```

**Props:**
- `variant`: primary | secondary | success | warning | danger | info | gray
- `size`: sm | md | lg
- `rounded`: boolean

---

## 🔌 API e Mock Data

### Estrutura

```typescript
// mockData.ts
export const mockUsers: User[] = [...]
export const mockRewards: Reward[] = [...]
export const mockPurchases: Purchase[] = [...]

export function loadFromStorage<T>(key: string, defaultValue: T): T
export function saveToStorage<T>(key: string, data: T): void

// apiService.ts
export const authApi = {
  login(credentials): Promise<ApiResponse<{user, token}>>
  register(data): Promise<ApiResponse<{user, token}>>
  updateProfile(userId, updates): Promise<ApiResponse<User>>
}

export const rewardsApi = {
  getAll(): Promise<ApiResponse<Reward[]>>
  redeem(userId, rewardId): Promise<ApiResponse<RedeemedReward>>
  getRedeemed(userId): Promise<ApiResponse<RedeemedReward[]>>
}
```

### Padrão de Response

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
```

### Simulando Delay

```typescript
const delay = () => new Promise(resolve => 
  setTimeout(resolve, Math.random() * 300 + 200)
)
```

### Persistência

Todos os dados são persistidos no `localStorage` com prefixo `fidely_`:

- `fidely_users`
- `fidely_rewards`
- `fidely_purchases`
- `fidely_pointTransactions`
- `fidely_redeemedRewards`
- `fidely_auth_token`
- `fidely_user`
- `fidely_dark_mode`

---

## ✅ Validação de Formulários

### Exemplo Completo

```typescript
import { useFormValidation } from '@/composables/useFormValidation'

const { validators, validateForm, errors } = useFormValidation()

const formData = reactive({
  name: '',
  email: '',
  cpf: '',
  password: '',
  confirmPassword: ''
})

const fieldRules = {
  name: [
    validators.required(),
    validators.minLength(3)
  ],
  email: [
    validators.required(),
    validators.email()
  ],
  cpf: [
    validators.required(),
    validators.cpf()
  ],
  password: [
    validators.required(),
    validators.minLength(6)
  ],
  confirmPassword: [
    validators.required(),
    validators.match(formData.password, 'senha')
  ]
}

const handleSubmit = () => {
  if (!validateForm(formData, fieldRules)) {
    return // Há erros
  }
  
  // Processar formulário
}
```

### Validação Individual

```typescript
const validateField = (field: string) => {
  const rules = fieldRules[field]
  validate(field, formData[field], rules)
}

// No template
<BaseInput
  v-model="formData.email"
  :error="errors.email"
  @blur="validateField('email')"
/>
```

---

## 🎨 Estilização

### Tailwind CSS

#### Classes Customizadas

```css
/* style.css */
@layer components {
  .nav-link {
    @apply flex items-center gap-2 px-4 py-2 rounded-lg 
           text-gray-700 dark:text-gray-300 
           hover:bg-gray-100 dark:hover:bg-gray-800 
           transition-colors font-medium;
  }
}
```

#### Dark Mode

Use a variante `dark:` para estilos no tema escuro:

```vue
<div class="bg-white dark:bg-dark-card text-gray-900 dark:text-white">
```

#### Cores Customizadas

Definidas em `tailwind.config.js`:

```javascript
colors: {
  primary: { 500: '#f97316', ... },
  dark: {
    bg: '#0f172a',
    card: '#1e293b',
    border: '#334155'
  }
}
```

### Animações

```vue
<div class="animate-fade-in">
  <!-- Fade in suave -->
</div>

<div class="animate-slide-up">
  <!-- Slide up com fade -->
</div>
```

### Transições Vue

```vue
<transition
  enter-active-class="transition duration-300 ease-out"
  enter-from-class="opacity-0 scale-95"
  enter-to-class="opacity-100 scale-100"
>
  <div v-if="show">...</div>
</transition>
```

---

## ✨ Boas Práticas

### 1. Componentes

```vue
<!-- ✅ BOM -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '@/types'

interface Props {
  user: User
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  save: [user: User]
}>()
</script>

<!-- ❌ EVITAR -->
<script>
export default {
  props: ['user', 'loading'], // Sem tipos
  data() { return { ... } } // Options API
}
</script>
```

### 2. Stores

```typescript
// ✅ BOM - Composition API
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  
  const isAuthenticated = computed(() => !!user.value)
  
  async function login(credentials: LoginCredentials) {
    // ...
  }
  
  return { user, isAuthenticated, login }
})

// ❌ EVITAR - Options API
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null }),
  getters: { isAuthenticated() { ... } },
  actions: { login() { ... } }
})
```

### 3. TypeScript

```typescript
// ✅ BOM - Tipos explícitos
const users = ref<User[]>([])
const loading = ref<boolean>(false)

async function fetchUsers(): Promise<void> {
  loading.value = true
  try {
    const response = await api.getUsers()
    users.value = response.data
  } finally {
    loading.value = false
  }
}

// ❌ EVITAR - any
const users = ref([]) as any
function fetchUsers(): any { ... }
```

### 4. Composables

```typescript
// ✅ BOM - Retorna objecto com nomes claros
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  
  return { count, increment }
}

// ❌ EVITAR - Retorna array
export function useCounter() {
  const count = ref(0)
  return [count, () => count.value++]
}
```

### 5. Nomenclatura

```typescript
// ✅ BOM
const isLoading = ref(false)
const hasError = ref(false)
const canSubmit = computed(() => ...)

function handleSubmit() { ... }
function fetchUsers() { ... }

// ❌ EVITAR
const loading = ref(false) // boolean deve ter prefixo is/has
const error = ref(false)
const submit = computed(() => ...) // não é verbo

function submit() { ... } // muito genérico
function get() { ... } // não diz o que faz
```

### 6. Imports

```typescript
// ✅ BOM - Agrupado e organizado
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserIcon, CheckIcon } from '@heroicons/vue/24/outline'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

import type { User } from '@/types'

// ❌ EVITAR - Desorganizado
import BaseButton from '@/components/base/BaseButton.vue'
import { ref } from 'vue'
import type { User } from '@/types'
import { useAuth } from '@/composables/useAuth'
```

### 7. Props vs Emits

```vue
<!-- ✅ BOM - Props down, Events up -->
<template>
  <BaseModal :show="showModal" @close="showModal = false">
    ...
  </BaseModal>
</template>

<!-- ❌ EVITAR - Mutar props diretamente -->
<script>
const props = defineProps<{ show: boolean }>()
props.show = false // ❌ NUNCA FAÇA ISSO
</script>
```

---

## 🧪 Testes (Futuro)

### Estrutura Recomendada

```
tests/
├── unit/
│   ├── components/
│   ├── composables/
│   └── stores/
├── integration/
│   └── flows/
└── e2e/
    └── scenarios/
```

### Exemplo de Teste

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/base/BaseButton.vue'

describe('BaseButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'primary' },
      slots: { default: 'Click me' }
    })
    
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('bg-primary-500')
  })
  
  it('emits click event', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

---

## 📚 Recursos

### Documentação Oficial
- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Ferramentas
- [Vue DevTools](https://devtools.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Heroicons](https://heroicons.com/)

---

<div align="center">

**📖 Mantenha este guia atualizado conforme o projeto evolui!**

</div>

