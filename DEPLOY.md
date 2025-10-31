# 🚀 Guia de Deploy - Fidely+

Este guia detalha como fazer o deploy da aplicação Fidely+ em diferentes plataformas.

---

## 📋 Índice

- [Build de Produção](#build-de-produção)
- [Deploy na Vercel](#deploy-na-vercel)
- [Deploy na Netlify](#deploy-na-netlify)
- [Deploy em Servidor Próprio](#deploy-em-servidor-próprio)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Otimizações](#otimizações)

---

## 🏗 Build de Produção

### Gerar Build

```bash
# Instalar dependências
npm install

# Gerar build otimizado
npm run build
```

O build será gerado na pasta `/dist` com:
- HTML, CSS e JS minificados
- Assets otimizados
- Code splitting automático
- Tree shaking aplicado

### Testar Build Localmente

```bash
npm run preview
```

Acesse: http://localhost:4173

---

## ☁️ Deploy na Vercel

### Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd fidely
vercel

# Deploy de produção
vercel --prod
```

### Via Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe o repositório `fidely`
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Clique em "Deploy"

### Configuração (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🌐 Deploy na Netlify

### Via CLI

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
cd fidely
netlify deploy

# Deploy de produção
netlify deploy --prod
```

### Via Dashboard

1. Acesse [netlify.com](https://netlify.com)
2. Faça login
3. Clique em "Add new site" → "Import an existing project"
4. Conecte com GitHub
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Clique em "Deploy site"

### Configuração (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🖥 Deploy em Servidor Próprio

### Requisitos
- Servidor Linux (Ubuntu/Debian)
- Node.js 18+ instalado
- Nginx ou Apache
- Domínio configurado (opcional)

### Passo 1: Preparar Build

```bash
# No seu computador local
npm run build

# Comprimir a pasta dist
tar -czf fidely-dist.tar.gz dist/
```

### Passo 2: Enviar para Servidor

```bash
# Via SCP
scp fidely-dist.tar.gz user@seu-servidor.com:/var/www/

# Via SFTP ou FTP também funciona
```

### Passo 3: Configurar Nginx

```bash
# No servidor
ssh user@seu-servidor.com

# Descomprimir
cd /var/www
tar -xzf fidely-dist.tar.gz

# Criar configuração do Nginx
sudo nano /etc/nginx/sites-available/fidely
```

**Configuração do Nginx:**

```nginx
server {
    listen 80;
    server_name fidely.seudominio.com;
    
    root /var/www/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Compressão Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level 6;
}
```

**Ativar site:**

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/fidely /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

### Passo 4: Configurar HTTPS (Opcional mas Recomendado)

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d fidely.seudominio.com

# Renovação automática já está configurada
```

---

## 🔐 Variáveis de Ambiente

### Para Produção com Backend Real

Crie um arquivo `.env.production`:

```env
# API Backend
VITE_API_URL=https://api.fidely.com
VITE_API_KEY=sua-chave-api

# Configurações
VITE_APP_MODE=production
VITE_DEBUG=false
VITE_STORAGE_PREFIX=fidely_
```

### Configurar na Vercel

```bash
vercel env add VITE_API_URL
# Digite o valor quando solicitado
```

Ou via Dashboard:
1. Projeto → Settings → Environment Variables
2. Adicione cada variável

### Configurar na Netlify

```bash
netlify env:set VITE_API_URL https://api.fidely.com
```

Ou via Dashboard:
1. Site settings → Environment variables
2. Adicione cada variável

---

## ⚡ Otimizações

### 1. Análise de Bundle

```bash
npm install -D rollup-plugin-visualizer

# Adicionar no vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer()
  ]
})

# Gerar relatório
npm run build
```

### 2. Pré-renderização (SSG)

Para páginas estáticas como "Como Funciona":

```bash
npm install -D vite-plugin-ssr

# Configurar no vite.config.ts
import ssr from 'vite-plugin-ssr/plugin'

export default defineConfig({
  plugins: [
    vue(),
    ssr()
  ]
})
```

### 3. PWA (Progressive Web App)

```bash
npm install -D vite-plugin-pwa

# Configurar no vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fidely+',
        short_name: 'Fidely',
        description: 'Sistema de Fidelidade',
        theme_color: '#f97316',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

### 4. Lazy Loading de Rotas

Já implementado! Todas as views usam lazy loading:

```typescript
const DashboardView = () => import('@/views/DashboardView.vue')
```

### 5. Otimização de Imagens

Use serviços de CDN para imagens:
- [Cloudinary](https://cloudinary.com)
- [imgix](https://imgix.com)
- [Cloudflare Images](https://www.cloudflare.com/products/cloudflare-images/)

---

## 📊 Monitoramento

### Analytics

#### Google Analytics

```bash
npm install vue-gtag-next

# main.ts
import VueGtag from 'vue-gtag-next'

app.use(VueGtag, {
  property: {
    id: 'G-XXXXXXXXXX'
  }
})
```

#### Vercel Analytics

Já incluído automaticamente em projetos Vercel!

### Error Tracking

#### Sentry

```bash
npm install @sentry/vue

# main.ts
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: 'https://xxx@xxx.ingest.sentry.io/xxx',
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router)
    })
  ],
  tracesSampleRate: 1.0
})
```

---

## 🔒 Checklist de Segurança

Antes do deploy:

- [ ] Remover console.logs de desenvolvimento
- [ ] Configurar CORS no backend
- [ ] Implementar rate limiting
- [ ] Validar todas as entradas no backend
- [ ] Usar HTTPS em produção
- [ ] Configurar Content Security Policy
- [ ] Atualizar dependências
- [ ] Revisar permissões de acesso
- [ ] Configurar backup automático
- [ ] Testar em diferentes navegadores

---

## 🧪 Testes Pré-Deploy

```bash
# Build de produção
npm run build

# Preview local
npm run preview

# Testar:
✓ Todas as páginas carregam
✓ Navegação funciona
✓ Dark mode funciona
✓ Formulários validam
✓ Toast notifications aparecem
✓ QR codes são gerados
✓ Responsividade OK
```

---

## 🆘 Troubleshooting

### Build Falha

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Rotas 404 em Produção

Certifique-se de que o servidor está configurado para redirecionar todas as rotas para `index.html` (SPA).

### Assets não Carregam

Verifique:
- Base path no `vite.config.ts`
- Caminhos relativos vs absolutos
- CORS se assets estão em CDN

### Performance Ruim

```bash
# Analisar bundle
npm run build -- --mode analyze

# Verificar:
- Bundle size
- Número de requests
- Cache headers
- Compressão Gzip/Brotli
```

---

## 📞 Suporte

Para problemas de deploy:
1. Verifique os logs de build
2. Consulte a documentação da plataforma
3. Abra uma issue no repositório

---

<div align="center">

**🚀 Bom Deploy!**

</div>

