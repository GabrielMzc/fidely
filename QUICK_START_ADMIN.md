# 🚀 Início Rápido - Fidely+ Admin

## ⚡ Acesso Rápido

### 1️⃣ Instalar e Rodar

```bash
cd fidely
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## 👥 Usuários de Teste

### 👨‍💼 **ADMINISTRADOR** (Acesso ao Painel Admin)

```
CPF: 123.456.789-09
Senha: (qualquer senha)
```

**Após login, será redirecionado para:** `/admin/dashboard`

**Funcionalidades:**
- ✅ Dashboard administrativo completo
- ✅ Gerenciar usuários e atribuir pontos
- ✅ Criar e editar recompensas
- ✅ Criar e gerenciar promoções
- ✅ Visualizar relatórios
- ✅ Configurações do sistema

---

### 👤 **USUÁRIO COMUM** (Acesso ao Painel Cliente)

**Usuário 1:**
```
CPF: 111.444.777-35
Senha: (qualquer senha)
Pontos: 150
```

**Usuário 2:**
```
CPF: 529.982.247-25
Senha: (qualquer senha)
Pontos: 450
```

**Após login, será redirecionado para:** `/dashboard`

**Funcionalidades:**
- ✅ Ver pontos e histórico
- ✅ Resgatar recompensas
- ✅ Ver recompensas resgatadas com QR Code
- ✅ Editar perfil

---

## 🎯 Fluxos de Teste

### 🔥 Teste 1: Login como Admin

1. Acesse **http://localhost:5173**
2. Faça login com CPF: `123.456.789-09`
3. Explore o painel administrativo:
   - Dashboard com estatísticas
   - Gerenciamento de usuários
   - Criação de promoções
   - Relatórios

### 🔥 Teste 2: Gerenciar Usuários

1. Login como admin
2. Navegue para **Admin > Usuários**
3. Tente:
   - ✅ Buscar usuários
   - ✅ Atribuir pontos (crédito/débito)
   - ✅ Bloquear/desbloquear usuário
   - ✅ Ver estatísticas

### 🔥 Teste 3: Criar Promoção

1. Login como admin
2. Navegue para **Admin > Promoções**
3. Clique em **Nova Promoção**
4. Preencha:
   - Título: "Black Friday 2x Pontos"
   - Tipo: Multiplicador
   - Valor: 2
   - Datas de início/fim
5. Salve e veja a promoção ativa

### 🔥 Teste 4: Criar Recompensa

1. Login como admin
2. Navegue para **Admin > Recompensas**
3. Clique em **Nova Recompensa**
4. Preencha os dados
5. Salve e veja no catálogo

### 🔥 Teste 5: Experiência do Cliente

1. Faça logout (ou abra aba anônima)
2. Login como usuário: `111.444.777-35`
3. Veja seus pontos no dashboard
4. Resgate uma recompensa
5. Veja o QR Code gerado em **Minhas Recompensas**

### 🔥 Teste 6: Mobile First

1. Abra DevTools (F12)
2. Ative modo responsivo (Ctrl+Shift+M)
3. Teste em:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)
4. Note as diferenças:
   - Menu hambúrguer no mobile
   - Bottom nav no mobile
   - Sidebar fixa no desktop
   - Cards vs tabelas

---

## 📱 Testando Mobile

### Chrome DevTools

1. **F12** para abrir DevTools
2. **Ctrl+Shift+M** para modo responsivo
3. Selecione dispositivo ou insira dimensões customizadas

### Dispositivos Recomendados

```
📱 iPhone SE:        375 x 667
📱 iPhone 12 Pro:    390 x 844
📱 Pixel 5:          393 x 851
📱 iPad:             768 x 1024
📱 iPad Pro:         1024 x 1366
💻 Desktop:          1920 x 1080
```

---

## 🔑 Rotas Principais

### Cliente (Requer Role: User)
```
/login                  - Login
/register               - Cadastro
/dashboard              - Dashboard do cliente
/rewards                - Catálogo de recompensas
/my-rewards             - Minhas recompensas
/profile                - Perfil do usuário
/how-it-works           - Como funciona
```

### Admin (Requer Role: Admin)
```
/admin/dashboard        - Dashboard administrativo
/admin/users            - Gerenciar usuários
/admin/rewards          - Gerenciar recompensas
/admin/promotions       - Gerenciar promoções
/admin/reports          - Relatórios
/admin/settings         - Configurações
```

---

## 🐛 Troubleshooting

### Problema: "CPF não encontrado"

**Causa:** Tentando fazer login com CPF não cadastrado

**Solução:** Use um dos CPFs de teste:
- Admin: `123.456.789-09`
- User 1: `111.444.777-35`
- User 2: `529.982.247-25`

### Problema: "Acesso negado ao admin"

**Causa:** Tentando acessar `/admin` com usuário comum

**Solução:** Faça login com o CPF admin: `123.456.789-09`

### Problema: Dados não aparecem

**Solução:** Limpe o localStorage e recarregue:

```javascript
// No console do browser (F12)
Object.keys(localStorage)
  .filter(key => key.startsWith('fidely_'))
  .forEach(key => localStorage.removeItem(key))

window.location.reload()
```

### Problema: Layout quebrado

**Solução:** Limpe cache e rebuilde:

```bash
rm -rf node_modules/.vite
npm run dev
```

### Problema: Não consigo fazer logout

**Solução:** 
- Clique no botão de logout (desktop: sidebar, mobile: menu)
- Ou acesse diretamente: `/login`

---

## 🎨 Componentes Admin Principais

### StatsCard
```vue
<StatsCard
  label="Total de Usuários"
  :value="150"
  :icon="UsersIcon"
  variant="primary"
/>
```

### DataTable
```vue
<DataTable
  :columns="columns"
  :data="users"
  :loading="loading"
  searchable
  paginated
>
  <template #cell-status="{ value }">
    <Badge :variant="value" />
  </template>
  
  <template #row-actions="{ row }">
    <Button @click="edit(row)">Editar</Button>
  </template>
</DataTable>
```

### FormModal
```vue
<FormModal
  v-model="showModal"
  title="Nova Promoção"
  @submit="handleSubmit"
>
  <!-- Form fields -->
</FormModal>
```

---

## 📊 Estrutura de Dados

### localStorage Keys

```javascript
fidely_users               // Usuários cadastrados
fidely_rewards             // Catálogo de recompensas
fidely_promotions          // Promoções ativas
fidely_pointTransactions   // Transações de pontos
fidely_redeemedRewards     // Recompensas resgatadas
fidely_manualPointsAssignments // Atribuições manuais
fidely_purchases           // Histórico de compras
fidely_auth_token          // Token de autenticação
fidely_user                // Usuário logado
```

### Inspecionar Dados

```javascript
// No console do browser
console.log('Users:', JSON.parse(localStorage.getItem('fidely_users')))
console.log('Current User:', JSON.parse(localStorage.getItem('fidely_user')))
console.log('Promotions:', JSON.parse(localStorage.getItem('fidely_promotions')))
```

---

## 🔄 Reset do Sistema

Para começar do zero:

```javascript
// No console do browser (F12)
localStorage.clear()
window.location.reload()
```

Ou pelo código:

```bash
# Para e reinicie o servidor
Ctrl+C
npm run dev
```

---

## 📝 Checklist de Funcionalidades

### Admin
- [ ] Login como admin
- [ ] Ver dashboard com estatísticas
- [ ] Listar usuários
- [ ] Atribuir pontos a um usuário
- [ ] Bloquear/desbloquear usuário
- [ ] Criar nova recompensa
- [ ] Editar recompensa existente
- [ ] Criar nova promoção
- [ ] Ver relatório de pontos
- [ ] Ver relatório de recompensas
- [ ] Testar responsividade mobile

### Cliente
- [ ] Fazer cadastro novo
- [ ] Login como cliente
- [ ] Ver pontos no dashboard
- [ ] Filtrar recompensas por categoria
- [ ] Resgatar uma recompensa
- [ ] Ver QR Code da recompensa
- [ ] Editar perfil
- [ ] Toggle dark mode
- [ ] Fazer logout

---

## 🎓 Próximos Passos

### Para Desenvolvimento
1. Explorar código em `src/views/admin/`
2. Ver componentes em `src/components/admin/`
3. Entender stores em `src/stores/adminStore.ts`
4. Ler documentação completa em `ADMIN.md`

### Para Produção
1. Implementar backend real (Node.js + Express)
2. Conectar banco de dados (PostgreSQL)
3. Adicionar autenticação JWT
4. Implementar upload de imagens real
5. Configurar CI/CD
6. Deploy em servidor

---

## 📞 Documentação Adicional

- **ADMIN.md** - Documentação completa do painel admin
- **MOBILE_FIRST.md** - Guia de desenvolvimento mobile-first
- **README.md** - Documentação geral do projeto
- **GUIA_DESENVOLVIMENTO.md** - Guia técnico detalhado

---

## ✅ Tudo Funcionando?

Se você conseguiu:
- ✅ Fazer login como admin
- ✅ Ver o dashboard administrativo
- ✅ Gerenciar usuários e atribuir pontos
- ✅ Criar promoções e recompensas
- ✅ Visualizar relatórios
- ✅ Testar em mobile e desktop

**🎉 Parabéns! O sistema está 100% funcional!**

---

**Desenvolvido com ❤️ usando Vue 3 + TypeScript + Tailwind CSS**

**Dúvidas?** Consulte a documentação completa em `ADMIN.md`

