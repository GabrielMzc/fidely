/**
 * Vue Router - Configuração de Rotas
 * Define todas as rotas da aplicação e guards de navegação
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// ==================== LAYOUTS ====================
const AuthLayout = () => import('@/layouts/AuthLayout.vue')
const MainLayout = () => import('@/layouts/MainLayout.vue')

// ==================== PÁGINAS DE AUTENTICAÇÃO ====================
const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const ForgotPasswordView = () => import('@/views/auth/ForgotPasswordView.vue')

// ==================== PÁGINAS PRINCIPAIS ====================
const DashboardView = () => import('@/views/DashboardView.vue')
const RewardsView = () => import('@/views/RewardsView.vue')
const MyRewardsView = () => import('@/views/MyRewardsView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const HowItWorksView = () => import('@/views/HowItWorksView.vue')

// ==================== PÁGINAS ADMINISTRATIVAS ====================
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const AdminDashboardView = () => import('@/views/admin/AdminDashboardView.vue')
const UsersManagementView = () => import('@/views/admin/UsersManagementView.vue')
const RewardsManagementView = () => import('@/views/admin/RewardsManagementView.vue')
const PromotionsManagementView = () => import('@/views/admin/PromotionsManagementView.vue')

// ==================== DEFINIÇÃO DE ROTAS ====================
const routes: RouteRecordRaw[] = [
  // Redirect raiz para login
  {
    path: '/',
    redirect: '/login'
  },

  // Rotas de Autenticação (sem layout principal)
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { requiresGuest: true, title: 'Login' }
      },
      {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { requiresGuest: true, title: 'Cadastro' }
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView,
        meta: { requiresGuest: true, title: 'Recuperar Senha' }
      }
    ]
  },

  // Rotas Principais (com layout e navegação)
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' }
      },
      {
        path: '/rewards',
        name: 'rewards',
        component: RewardsView,
        meta: { title: 'Recompensas' }
      },
      {
        path: '/my-rewards',
        name: 'my-rewards',
        component: MyRewardsView,
        meta: { title: 'Minhas Recompensas' }
      },
      {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { title: 'Perfil' }
      }
    ]
  },

  // Rota Como Funciona (acessível sem autenticação)
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: HowItWorksView,
    meta: { title: 'Como Funciona' }
  },

  // Rotas Administrativas
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: AdminDashboardView,
        meta: { title: 'Dashboard Administrativo' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UsersManagementView,
        meta: { title: 'Gerenciar Usuários' }
      },
      {
        path: 'rewards',
        name: 'admin-rewards',
        component: RewardsManagementView,
        meta: { title: 'Gerenciar Recompensas' }
      },
      {
        path: 'promotions',
        name: 'admin-promotions',
        component: PromotionsManagementView,
        meta: { title: 'Gerenciar Promoções' }
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('@/views/admin/ReportsView.vue'),
        meta: { title: 'Relatórios' }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/views/admin/SettingsView.vue'),
        meta: { title: 'Configurações' }
      }
    ]
  },

  // 404 - Página não encontrada
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// ==================== CRIAÇÃO DO ROUTER ====================
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// ==================== GUARDS DE NAVEGAÇÃO ====================
router.beforeEach((to, from, next) => {
  // Atualiza título da página
  document.title = to.meta.title 
    ? `${to.meta.title} | Fidely+` 
    : 'Fidely+ | Sistema de Fidelidade'

  const authStore = useAuthStore()

  // Guard de autenticação
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Guard de admin - verifica se rota requer admin e se usuário é admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'dashboard' })
    return
  }

  // Guard de guest (páginas de login/registro)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redireciona admin para dashboard admin, usuário comum para dashboard normal
    next({ name: authStore.isAdmin ? 'admin-dashboard' : 'dashboard' })
    return
  }

  next()
})

export default router

