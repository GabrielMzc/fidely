# 🎁 Fidely+ - Sistema de Fidelidade para Lanchonetes

<div align="center">

![Fidely+ Logo](https://img.shields.io/badge/Fidely+-Sistema%20de%20Fidelidade-f97316?style=for-the-badge&logo=gift)

**Sistema moderno de fidelidade onde usuários acumulam pontos por compras e podem trocá-los por recompensas**

[![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883?style=flat&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.1-ffd859?style=flat)](https://pinia.vuejs.org/)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#-arquitetura)
- [Dados de Teste](#-dados-de-teste)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🚀 Sobre o Projeto

**Fidely+** é uma aplicação web completa de sistema de fidelidade desenvolvida especificamente para lanchonetes. O sistema permite que clientes acumulem pontos a cada compra realizada e troquem esses pontos por recompensas exclusivas.

### ✨ Destaques

- 🎨 **Design Moderno**: Interface limpa e intuitiva com Tailwind CSS
- 🌓 **Dark Mode**: Suporte completo a tema escuro com preferência persistente
- 📱 **Mobile-First**: Desenvolvido com abordagem mobile-first para excelente UX em qualquer dispositivo
- ⚡ **Performance**: Otimizado com Vue 3 Composition API e JIT do Tailwind
- 🔐 **Seguro**: Validação robusta de dados e controle de acesso baseado em roles (RBAC)
- 🎯 **UX Otimizada**: Fluxos intuitivos e feedback visual constante
- 👨‍💼 **Painel Admin**: Sistema completo de gerenciamento administrativo

---

## 🎯 Funcionalidades

### 👤 Painel do Cliente

#### Autenticação
- ✅ Login com CPF e senha
- ✅ Cadastro de novos usuários
- ✅ Recuperação de senha
- ✅ Persistência de sessão

#### Dashboard
- ✅ Visualização de pontos disponíveis
- ✅ Próxima recompensa sugerida com barra de progresso
- ✅ Histórico completo de pontos (ganhos e resgatados)
- ✅ Histórico de compras com detalhes

#### Catálogo de Recompensas
- ✅ Grid visual com todas as recompensas
- ✅ Filtros por categoria (Combos, Bebidas, Lanches, Descontos, Especiais)
- ✅ Indicação clara de recompensas disponíveis
- ✅ Modal detalhado com informações completas
- ✅ Sistema de resgate de recompensas

#### Minhas Recompensas
- ✅ Listagem de recompensas ativas, usadas e expiradas
- ✅ Geração automática de QR Code único para cada recompensa
- ✅ Código alfanumérico para apresentação manual
- ✅ Sistema de validade com alertas visuais
- ✅ Indicadores de status (Ativa, Usada, Expirada)

#### Perfil do Usuário
- ✅ Visualização e edição de dados cadastrais
- ✅ Configurações de preferências (notificações, dark mode)
- ✅ Estatísticas de uso
- ✅ Logout seguro

#### Como Funciona
- ✅ Página explicativa completa
- ✅ Passo a passo visual
- ✅ FAQ interativa
- ✅ Regras de pontuação claras

### 👨‍💼 Painel Administrativo

#### Dashboard Administrativo
- ✅ Estatísticas em tempo real (usuários, pontos, promoções)
- ✅ Usuários recentes cadastrados
- ✅ Recompensas mais populares
- ✅ Transações recentes de pontos

#### Gerenciamento de Usuários
- ✅ Listagem completa com busca e filtros
- ✅ Visualizar status (Ativo, Inativo, Bloqueado)
- ✅ Atribuir pontos manualmente (crédito/débito)
- ✅ Bloquear/Desbloquear usuários
- ✅ Deletar usuários
- ✅ Histórico detalhado por usuário

#### Gerenciamento de Recompensas
- ✅ CRUD completo de recompensas
- ✅ Configurar pontos, validade, categoria
- ✅ Upload de imagens
- ✅ Toggle de disponibilidade
- ✅ Definir termos e condições

#### Gerenciamento de Promoções
- ✅ Criar promoções de múltiplos tipos:
  - Pontos bônus em compras
  - Multiplicadores (2x, 3x pontos)
  - Descontos em recompensas
  - Pontos grátis para usuários
- ✅ Agendamento com data início/fim
- ✅ Status (Ativa, Agendada, Expirada, Cancelada)
- ✅ Edição e cancelamento

#### Relatórios e Analytics
- ✅ Relatório de pontos (ganhos, resgatados, saldo)
- ✅ Relatório de recompensas (por categoria, mais populares)
- ✅ Relatório de usuários (novos, ativos, top 10)
- ✅ Exportação de dados

#### Configurações do Sistema
- ✅ Taxa de conversão R$ → Pontos
- ✅ Validade padrão de recompensas
- ✅ Notificações por email
- ✅ Ações administrativas (cache, backup)

### 🔐 Controle de Acesso (RBAC)
- ✅ Role-based authentication
- ✅ Guards de rota automáticos
- ✅ Separação cliente/admin
- ✅ Logs de auditoria

---

## 🛠 Tecnologias

### Core
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem
- **[Vite](https://vitejs.dev/)** - Build tool ultrarrápida

### Estilização
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Heroicons](https://heroicons.com/)** - Ícones SVG bonitos

### Estado e Roteamento
- **[Pinia](https://pinia.vuejs.org/)** - Store de estado para Vue 3
- **[Vue Router](https://router.vuejs.org/)** - Roteamento oficial do Vue

### Utilitários
- **[Headless UI](https://headlessui.com/)** - Componentes acessíveis sem estilo
- **[QRCode](https://github.com/soldair/node-qrcode)** - Geração de QR Codes

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

Verificar versões instaladas:

```bash
node --version  # v18.0.0 ou superior
npm --version   # 9.0.0 ou superior
```

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd fidely
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em **http://localhost:3000**

---

## 💻 Uso

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção otimizado
npm run preview      # Preview do build de produção

# Linting
npm run lint         # Executa ESLint
```

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# O build estará na pasta /dist
# Para servir localmente:
npm run preview
```

---

## 📁 Estrutura do Projeto

```
fidely/
├── public/                 # Arquivos públicos estáticos
├── src/
│   ├── api/               # Camada de API e dados mockados
│   │   ├── apiService.ts  # Serviços de API simulada
│   │   └── mockData.ts    # Dados de exemplo
│   │
│   ├── assets/            # Assets estáticos (imagens, fontes)
│   │
│   ├── components/        # Componentes Vue reutilizáveis
│   │   ├── base/         # Componentes base (Button, Input, Card, etc)
│   │   ├── LoadingSpinner.vue
│   │   └── ToastNotifications.vue
│   │
│   ├── composables/       # Composables Vue (lógica reutilizável)
│   │   ├── useAuth.ts
│   │   ├── useDarkMode.ts
│   │   ├── useFormValidation.ts
│   │   └── useNotifications.ts
│   │
│   ├── layouts/           # Layouts da aplicação
│   │   ├── AuthLayout.vue
│   │   └── MainLayout.vue
│   │
│   ├── router/            # Configuração de rotas
│   │   └── index.ts
│   │
│   ├── stores/            # Pinia stores (gerenciamento de estado)
│   │   ├── authStore.ts
│   │   ├── rewardsStore.ts
│   │   └── historyStore.ts
│   │
│   ├── types/             # Definições TypeScript
│   │   └── index.ts
│   │
│   ├── views/             # Páginas da aplicação
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   └── ForgotPasswordView.vue
│   │   ├── DashboardView.vue
│   │   ├── RewardsView.vue
│   │   ├── MyRewardsView.vue
│   │   ├── ProfileView.vue
│   │   └── HowItWorksView.vue
│   │
│   ├── App.vue            # Componente raiz
│   ├── main.ts            # Entry point
│   └── style.css          # Estilos globais
│
├── index.html             # HTML principal
├── package.json           # Dependências e scripts
├── tailwind.config.js     # Configuração do Tailwind
├── tsconfig.json          # Configuração do TypeScript
├── vite.config.ts         # Configuração do Vite
└── README.md              # Este arquivo
```

---

## 🏗 Arquitetura

### Camadas da Aplicação

```
┌─────────────────────────────────────┐
│         Views (Páginas)             │
├─────────────────────────────────────┤
│      Layouts & Components           │
├─────────────────────────────────────┤
│    Composables (Lógica de UI)      │
├─────────────────────────────────────┤
│      Stores (Estado Global)         │
├─────────────────────────────────────┤
│      API Service (Backend Mock)     │
├─────────────────────────────────────┤
│      LocalStorage (Persistência)    │
└─────────────────────────────────────┘
```

### Fluxo de Dados

1. **View** dispara uma ação (ex: login)
2. **Composable** processa a lógica de UI
3. **Store** gerencia o estado e chama a API
4. **API Service** simula requisição ao backend
5. **Mock Data** retorna dados do localStorage
6. Dados fluem de volta atualizando a UI

### Gerenciamento de Estado (Pinia)

- **authStore**: Autenticação, usuário logado e controle de roles
- **rewardsStore**: Catálogo e recompensas resgatadas
- **historyStore**: Histórico de pontos e compras
- **adminStore**: Gerenciamento administrativo completo

---

## 🧪 Dados de Teste

### Usuários Pré-cadastrados

#### 👤 Usuário Cliente 1
- **CPF**: `111.444.777-35`
- **Senha**: qualquer senha
- **Pontos**: 150
- **Nome**: João Silva
- **Role**: User

#### 👤 Usuário Cliente 2
- **CPF**: `529.982.247-25`
- **Senha**: qualquer senha
- **Pontos**: 450
- **Nome**: Maria Santos
- **Role**: User

#### 👨‍💼 Administrador
- **CPF**: `123.456.789-09`
- **Senha**: qualquer senha
- **Pontos**: 0
- **Nome**: Administrador
- **Role**: Admin
- **Acesso**: Painel administrativo completo

### Recompensas Disponíveis

- **Combo Clássico Grátis** - 100 pontos
- **Batata Grande Grátis** - 50 pontos
- **Refrigerante 600ml Grátis** - 30 pontos
- **10% de Desconto** - 80 pontos
- **Combo Premium** - 200 pontos
- E mais...

### Regra de Pontuação

```
R$ 1,00 gasto = 1 ponto
```

**Exemplo**: Uma compra de R$ 45,90 gera **45 pontos**

---

## 🎨 Design System

### Paleta de Cores

#### Light Mode
- **Primary**: Laranja (#f97316) - Vibrante e apetitoso
- **Secondary**: Vermelho (#ef4444) - Destaque e ações
- **Accent**: Verde (#10b981) - Sucesso e confirmações

#### Dark Mode
- **Background**: Slate escuro (#0f172a)
- **Card**: Slate médio (#1e293b)
- **Border**: Slate claro (#334155)

### Componentes Base

Todos os componentes seguem um design system consistente:

- **BaseButton**: Variantes (primary, secondary, outline, ghost, danger)
- **BaseInput**: Com ícones, validação e estados
- **BaseCard**: Com hover, padding e slots customizáveis
- **BaseModal**: Responsivo com backdrop e animações
- **BaseBadge**: Para indicadores e status

---

## 🗺 Roadmap

### ✅ Fase 1 - MVP (Concluída)
- [x] Sistema de autenticação
- [x] Dashboard com pontos
- [x] Catálogo de recompensas
- [x] Sistema de resgate com QR Code
- [x] Perfil do usuário
- [x] Dark mode

### 🔄 Fase 2 - Melhorias (Futuro)
- [ ] Integração com backend real
- [ ] Sistema de notificações push
- [ ] Gamificação (níveis, badges)
- [ ] Histórico de escaneamento de QR Codes
- [ ] Programa de indicação (ganhe pontos indicando amigos)
- [ ] Promoções sazonais

### 🚀 Fase 3 - Expansão (Futuro)
- [ ] App mobile nativo (React Native)
- [ ] Sistema de PDV integrado
- [ ] Analytics e relatórios
- [ ] Multi-tenancy (várias lanchonetes)
- [ ] Programa de cashback

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para type safety
- Siga o style guide do Vue 3
- Mantenha componentes pequenos e reutilizáveis
- Comente código complexo
- Escreva commits descritivos

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ seguindo as melhores práticas de desenvolvimento moderno.

---

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato.

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

</div>

