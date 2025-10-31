# ⚡ Quick Start - Fidely+

## 🚀 Começando em 3 Passos

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Iniciar servidor de desenvolvimento

```bash
npm run dev
```

### 3️⃣ Acessar a aplicação

Abra seu navegador em: **http://localhost:3000**

---

## 🔑 Dados de Login

### Usuário de Teste 1
```
CPF: 111.444.777-35
Senha: qualquer senha (sistema aceita qualquer senha para testes)
Pontos: 150
```

### Usuário de Teste 2
```
CPF: 529.982.247-25
Senha: qualquer senha
Pontos: 450
```

---

## 🧭 Navegação Rápida

### Após fazer login, você terá acesso a:

1. **Dashboard** (`/dashboard`)
   - Veja seus pontos atuais
   - Acompanhe histórico de transações
   - Veja próxima recompensa disponível

2. **Catálogo de Recompensas** (`/rewards`)
   - Navegue por todas as recompensas
   - Filtre por categoria
   - Resgate com seus pontos

3. **Minhas Recompensas** (`/my-rewards`)
   - Veja recompensas ativas
   - Gere QR Code para usar no caixa
   - Acompanhe validade

4. **Perfil** (`/profile`)
   - Edite suas informações
   - Configure preferências
   - Ative/desative dark mode

---

## 🎯 Testando o Fluxo Completo

### 1. Criar Nova Conta
```
1. Acesse /register
2. Preencha o formulário
3. Faça login com o CPF criado
```

### 2. Explorar Recompensas
```
1. Vá para /rewards
2. Clique em uma recompensa
3. Veja os detalhes no modal
```

### 3. Resgatar Recompensa
```
1. Escolha uma recompensa que você tenha pontos
2. Clique em "Resgatar"
3. Vá para "Minhas Recompensas"
4. Clique na recompensa para ver o QR Code
```

### 4. Ativar Dark Mode
```
1. Clique no ícone de lua/sol no header
   OU
2. Vá em Perfil → Preferências → Toggle Dark Mode
```

---

## 🛠 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento

# Build
npm run build        # Build de produção
npm run preview      # Preview do build

# Linting
npm run lint         # Verificar código
```

---

## 📊 Estrutura de Dados

### Regra de Pontuação
```
R$ 1,00 gasto = 1 ponto
```

### Recompensas Disponíveis
- Combo Clássico: **100 pontos**
- Batata Grande: **50 pontos**
- Refrigerante 600ml: **30 pontos**
- Desconto 10%: **80 pontos**
- Combo Premium: **200 pontos**
- E mais...

---

## 🎨 Features Para Testar

### ✅ Autenticação
- [x] Login
- [x] Cadastro
- [x] Recuperar senha (simulado)
- [x] Logout

### ✅ Dashboard
- [x] Cards de estatísticas
- [x] Próxima recompensa com barra de progresso
- [x] Histórico de pontos
- [x] Histórico de compras

### ✅ Recompensas
- [x] Filtros por categoria
- [x] Modal de detalhes
- [x] Sistema de resgate
- [x] Validação de pontos

### ✅ Minhas Recompensas
- [x] Tabs (Ativas, Usadas, Expiradas)
- [x] Geração de QR Code
- [x] Código alfanumérico
- [x] Indicadores de validade

### ✅ Perfil
- [x] Edição de dados
- [x] Preferências
- [x] Dark mode toggle
- [x] Notificações

### ✅ Geral
- [x] Dark mode completo
- [x] Responsivo (mobile, tablet, desktop)
- [x] Toast notifications
- [x] Loading states
- [x] Validação de formulários

---

## 🐛 Troubleshooting

### Porta 3000 já está em uso
```bash
# Use outra porta
npm run dev -- --port 3001
```

### Erro ao instalar dependências
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Dark mode não está funcionando
```bash
# Limpe o localStorage
localStorage.clear()
# Recarregue a página
```

### Dados mockados não aparecem
```bash
# Limpe o localStorage e recarregue
localStorage.clear()
location.reload()
```

---

## 📱 Testando Responsividade

### Chrome DevTools
1. Abra DevTools (F12)
2. Clique no ícone de dispositivos (Ctrl+Shift+M)
3. Teste diferentes resoluções:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080

---

## 🔥 Próximos Passos

Após testar a aplicação:

1. Leia o [README.md](README.md) completo
2. Explore o [GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md)
3. Entenda a arquitetura em `/src`
4. Personalize cores em `tailwind.config.js`
5. Adicione novas features!

---

## 💡 Dicas

### Performance
- Use Vue DevTools para debug
- Monitore o Network tab durante navegação
- Verifique console para warnings

### Desenvolvimento
- Hot reload está ativo
- Mudanças são refletidas instantaneamente
- TypeScript verifica tipos em tempo real

### Customização
- Cores: `tailwind.config.js`
- Rotas: `src/router/index.ts`
- Mock data: `src/api/mockData.ts`

---

<div align="center">

**🎉 Divirta-se explorando o Fidely+!**

Qualquer dúvida, consulte o README ou abra uma issue.

</div>

