# 🛍️ Minha Loja - E-commerce Platform

Uma plataforma de e-commerce moderna desenvolvida com **Next.js 16**, **React 19**, **TypeScript** e **Tailwind CSS**. Inclui painel administrativo completo para gerenciamento de produtos e pedidos.

## ✨ Principais Funcionalidades

- 🏪 **Catálogo de Produtos** - Visualize todos os produtos com filtros e buscas
- 🛒 **Carrinho de Compras** - Adicione/remova produtos e gerencie quantidades
- 💳 **Sistema de Checkout** - Fluxo seguro de compra com confirmação
- 👨‍💼 **Painel Administrativo** - Gerenciar produtos, pedidos e estoque
- 📧 **Notificações por Email** - Confirmações de pedido via email
- 💾 **Banco de Dados** - SQLite com Prisma ORM
- 📱 **Responsivo** - Design otimizado para desktop e mobile
- 🔒 **Type-Safe** - Código TypeScript para maior segurança

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/GiovanniDSouza/-MY-STORE.git
cd minha-loja
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
npx prisma migrate dev
```

4. **Crie dados iniciais (opcional)**
```bash
npm run create-ethereal
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador. A página será recarregada conforme você faz alterações.

<img width="721" height="725" alt="image" src="https://github.com/user-attachments/assets/2d8c1f89-167f-48b7-8500-526e20cab0c9" />

<img width="752" height="465" alt="image" src="https://github.com/user-attachments/assets/fa110e5e-5632-4e75-9601-811e18d94bbc" />

<img width="630" height="659" alt="image" src="https://github.com/user-attachments/assets/74f5691d-6f58-458a-9d45-4afa16739a90" />


## 📦 Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Next.js** | 16.3.0 | Framework React com SSR/SSG |
| **React** | 19.2.8 | Biblioteca UI |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Estilização |
| **Prisma** | 7.9.1 | ORM e gerenciador de banco |
| **SQLite** | - | Banco de dados |
| **Nodemailer** | 6.9.4 | Envio de emails |
| **ESLint** | 9 | Linting e code quality |

## 📁 Estrutura do Projeto

```
minha-loja/
├── app/
│   ├── api/                 # API Routes (Next.js)
│   │   ├── admin/          # Rotas administrativas
│   │   ├── checkout/       # Processamento de checkout
│   │   └── products/       # CRUD de produtos
│   ├── admin/              # Páginas do admin
│   ├── checkout/           # Fluxo de checkout
│   ├── carrinho/           # Página do carrinho
│   ├── produtos/           # Páginas de produtos
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Home page
│   └── globals.css         # Estilos globais
├── prisma/
│   ├── schema.prisma       # Definição do banco
│   └── migrations/         # Histórico de migrações
├── src/
│   ├── components/         # Componentes React reutilizáveis
│   ├── data/              # Dados e configurações
│   └── lib/               # Utilitários e helpers
├── public/                 # Arquivos estáticos
├── scripts/               # Scripts de setup
├── package.json           # Dependências do projeto
├── tsconfig.json          # Configuração TypeScript
├── next.config.ts         # Configuração Next.js
└── middleware.ts          # Middlewares Next.js
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor em desenvolvimento

# Produção
npm run build        # Compila o projeto
npm start           # Inicia servidor em produção

# Banco de dados
npx prisma studio  # Interface visual para o banco

# Qualidade
npm run lint        # Verifica problemas com ESLint

# Dados
npm run create-ethereal  # Cria dados de teste
```

## 📚 API Endpoints

### Produtos
- `GET /api/products` - Lista todos os produtos
- `GET /api/products/:id` - Obtém produto específico
- `POST /api/admin/products` - Cria novo produto (admin)
- `PUT /api/admin/products/:id` - Atualiza produto (admin)
- `DELETE /api/admin/products/:id` - Deleta produto (admin)

### Pedidos
- `GET /api/admin/orders` - Lista pedidos (admin)
- `GET /api/admin/orders/:id` - Detalhes do pedido (admin)
- `POST /api/checkout` - Processa pedido

## 🗄️ Banco de Dados

O projeto usa **Prisma** com **SQLite**. Os modelos incluem:

- **Products** - Catálogo de produtos
- **Orders** - Pedidos realizados
- **OrderItems** - Itens de cada pedido
- **Migrations** - Histórico de mudanças no banco

## 🚢 Deploy

### Vercel (Recomendado)
1. Faça push do código para GitHub
2. Conecte seu repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático a cada push

### Outras plataformas
Consulte a [documentação do Next.js sobre deploy](https://nextjs.org/docs/app/building-your-application/deploying)

## 📧 Configuração de Email

O projeto usa **Nodemailer** para enviar confirmações. Configure as variáveis de ambiente:

```env
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## 🔐 Segurança

- ✓ Type-safe com TypeScript
- ✓ Validação de dados nas API routes
- ✓ Proteção contra SQL Injection (Prisma)
- ✓ CORS configurado
- ✓ Middleware de segurança

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se encontrar problemas, abra uma [issue no GitHub](https://github.com/GiovanniDSouza/-MY-STORE/issues).

---

**Desenvolvido com ❤️ usando Next.js**
