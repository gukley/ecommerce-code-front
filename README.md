# 🛒 GGTECH — Sistema de E-commerce

Este repositório contém o **Front-end** do sistema **GGTECH**, desenvolvido como parte do **Trabalho de Conclusão de Curso (TCC)** no curso de **Análise e Desenvolvimento de Sistemas**.  
O **GGTECH** é um sistema de e-commerce voltado à venda de **peças de computadores, periféricos e acessórios tecnológicos**, com autenticação de usuários, painel administrativo e integração com **pagamentos via Stripe**.

---

## 📘 Sumário

1. [📖 Descrição do Projeto](#-descrição-do-projeto)  
2. [🧠 Objetivos](#-objetivos)  
3. [🧱 Tecnologias Utilizadas](#-tecnologias-utilizadas)  
4. [⚙️ Configuração do Projeto](#️-configuração-do-projeto)  
5. [🧩 Estrutura do Projeto](#-estrutura-do-projeto)  
6. [✨ Funcionalidades Principais](#-funcionalidades-principais)  
7. [🐳 Uso com Docker](#-uso-com-docker)  
8. [📋 Requisitos do Sistema](#-requisitos-do-sistema)  
9. [🚀 Scripts Disponíveis](#-scripts-disponíveis)  
10. [📷 Capturas de Tela](#-capturas-de-tela)  
11. [📚 Licença](#-licença)  
12. [👨‍💻 Desenvolvedor](#-desenvolvedor)

---

## 📖 Descrição do Projeto

O **GGTECH** é uma aplicação web completa de e-commerce que permite a usuários navegar por produtos, adicionar itens ao carrinho, realizar pagamentos e acompanhar seus pedidos.  
O sistema também possui um **painel administrativo** onde administradores e moderadores podem gerenciar produtos, categorias, cupons, usuários e pedidos.

O front-end foi desenvolvido em **Vue.js 3 (Vite)** e consome uma **API RESTful** executada localmente via **Docker**, com suporte a banco de dados PostgreSQL e integração com **Stripe** para simulação de pagamentos online.

---

## 🧠 Objetivos

- Criar uma aplicação web moderna e responsiva para simular um e-commerce real.  
- Implementar autenticação com múltiplos perfis de usuário (`admin`, `moderator`, `client`).  
- Utilizar containers Docker para rodar o ambiente de desenvolvimento local.  
- Integrar pagamentos com o **Stripe API**.  
- Demonstrar conhecimentos adquiridos em desenvolvimento web, integração de sistemas e boas práticas de UX/UI.

---

## 🧱 Tecnologias Utilizadas

### 🖥️ Front-end
- [Vue.js 3](https://vuejs.org/) — Framework JavaScript reativo
- [Vite](https://vitejs.dev/) — Build tool e dev server
- [Bootstrap 5](https://getbootstrap.com/) — Framework CSS
- [Bootstrap Icons](https://icons.getbootstrap.com/) — Biblioteca de ícones
- [Vue Router](https://router.vuejs.org/) — Roteamento SPA
- [Pinia](https://pinia.vuejs.org/) — Gerenciamento de estado
- [Axios](https://axios-http.com/) — Cliente HTTP
- [Vue Toastification](https://vue-toastification.maronato.dev/) — Notificações toast
- [Stripe JS](https://stripe.com/docs/js) — Integração de pagamentos
- [ApexCharts](https://apexcharts.com/) — Gráficos e visualizações
- [jsPDF](https://github.com/parallax/jsPDF) — Geração de PDFs
- [Swiper](https://swiperjs.com/) — Carrossel de imagens

### ⚙️ Back-end (API utilizada)
- **FastAPI (Python)** — Executada via Docker localmente  
- **PostgreSQL** — Banco de dados  
- **JWT Authentication** — Autenticação de usuários  
- **Stripe** — Processamento de pagamentos  

🔸 A API utilizada foi executada localmente via containers Docker, conectada ao front-end do GGTECH.
O backend foi amplamente customizado, incluindo a criação e aprimoramento de endpoints, integração com o Stripe para pagamentos, além de ajustes de autenticação, autorização e controle de acesso.
A comunicação entre o front-end e a API é feita via requisições HTTP autenticadas com Bearer Token.
---

## ⚙️ Configuração do Projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/gukley/TCC-ecommerce-Front-end.git
cd TCC=ecommerce-Front-end
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=sua_chave_publica_aqui
```

### 4️⃣ Executar em modo de desenvolvimento
```bash
npm run dev
```

### 5️⃣ Gerar build para produção
```bash
npm run build
```

---

## 🧩 Estrutura do Projeto

```
projeto-ecommerce-code/
├── public/                   # Arquivos estáticos (imagens, ícones)
├── src/
│   ├── assets/              # Imagens, ícones e recursos estáticos
│   ├── components/          # Componentes reutilizáveis Vue
│   │   ├── Admin/           # Componentes do painel administrativo
│   │   ├── Cart/            # Componentes do carrinho e wishlist
│   │   ├── Checkout/        # Componentes do processo de checkout
│   │   ├── Common/          # Componentes comuns (pagination, theme toggle)
│   │   ├── home/            # Componentes da página inicial
│   │   └── Profile/          # Componentes do perfil do usuário
│   ├── layouts/             # Layouts de páginas (AdminLayout)
│   ├── views/               # Telas principais (rotas)
│   │   ├── admin/           # Views do painel administrativo
│   │   ├── Auth/            # Views de autenticação
│   │   ├── cart/            # Views do carrinho e checkout
│   │   └── home/            # Views da área pública
│   ├── router/              # Configuração de rotas e guards
│   ├── stores/              # Estados globais (Pinia stores)
│   ├── services/            # Comunicação com a API (Axios)
│   ├── styles/              # Estilos globais e temas
│   ├── App.vue              # Componente raiz
│   └── main.js              # Ponto de entrada da aplicação
├── .env.development         # Variáveis de ambiente (desenvolvimento)
├── .env.production          # Variáveis de ambiente (produção)
├── package.json             # Dependências e scripts
└── vite.config.js          # Configuração do Vite
```


## ✨ Funcionalidades Principais

### 👤 **Área do Usuário**

- **Autenticação e Autorização**
  - Cadastro e login com autenticação JWT
  - Recuperação de senha
  - Três níveis de acesso: `admin`, `moderator`, `client`
  - Controle de sessão e refresh token

- **Perfil do Usuário**
  - Gerenciamento de dados pessoais
  - Cadastro e edição de múltiplos endereços
  - Histórico completo de pedidos
  - Visualização e aplicação de cupons de desconto
  - Lista de favoritos (wishlist)

### 🛍️ **Catálogo de Produtos**

- **Navegação e Busca**
  - Listagem de produtos com paginação
  - Busca por nome e descrição
  - Filtragem por categoria
  - Visualização de detalhes do produto
  - Exibição de imagens, preços e estoque

- **Carrinho de Compras**
  - Adição e remoção de produtos
  - Atualização de quantidades em tempo real
  - Cálculo automático de subtotal
  - Persistência de dados (localStorage + API)
  - Sincronização entre sessões

- **Favoritos (Wishlist)**
  - Adicionar/remover produtos dos favoritos
  - Drawer lateral para visualização rápida
  - Adicionar favoritos diretamente ao carrinho

### 💳 **Checkout e Pagamentos**

- **Processo de Compra**
  - Seleção de endereço de entrega
  - Cálculo automático de frete
  - Aplicação de cupons de desconto
  - Seleção de método de pagamento
  - Integração com **Stripe** para pagamentos com cartão
  - Confirmação e resumo do pedido

- **Gestão de Pedidos**
  - Acompanhamento de status do pedido
  - Cancelamento de pedidos (quando permitido)
  - Histórico completo de compras

### ⚙️ **Painel Administrativo**

- **Dashboard**
  - Visão geral de vendas, pedidos e produtos
  - Gráficos e métricas em tempo real
  - Estatísticas de clientes e receita
  - Cards informativos com indicadores principais

- **Gerenciamento de Produtos**
  - CRUD completo de produtos
  - Upload de imagens
  - Controle de estoque
  - Aplicação de descontos
  - Busca e filtros avançados

- **Gerenciamento de Categorias**
  - CRUD de categorias
  - Upload de imagens de categoria
  - Visualização de produtos por categoria

- **Gerenciamento de Pedidos**
  - Visualização de todos os pedidos
  - Alteração de status (Pendente, Processando, Enviado, Entregue, Cancelado)
  - Filtros por status, período e ID
  - Exportação de pedidos em CSV
  - Geração de PDF de pedidos
  - Atualização em massa de status
  - Visualização detalhada de cada pedido

- **Gerenciamento de Cupons**
  - Criação e edição de cupons de desconto
  - Definição de percentual e validade
  - Controle de ativação/desativação

- **Gerenciamento de Usuários**
  - Criação de moderadores (apenas admin)
  - Visualização de clientes
  - Controle de permissões por role

- **Dashboard Financeiro**
  - Receita mensal
  - Pagamentos processados e cancelados
  - Gráficos de receita ao longo do tempo
  - Tabela detalhada de pagamentos

- **Recursos Adicionais**
  - Interface moderna e responsiva
  - Controle de acesso baseado em roles
  - Busca e filtros em todas as seções
  - Exportação de dados (CSV/PDF)


## 🐳 Uso com Docker

O ambiente back-end utilizado no desenvolvimento foi executado via Docker Compose, contendo:

- **Container para o FastAPI** (API principal)
- **Container para o PostgreSQL** (Banco de dados)
- **Container para o Stripe CLI** (modo de testes)

### Exemplo de inicialização:

```bash
docker-compose up -d
```

O front-end pode ser executado localmente com `npm run dev`, enquanto o back-end roda dentro dos containers Docker.

---

## 📋 Requisitos do Sistema

### Requisitos Mínimos
- **Node.js**: versão 18.x ou superior
- **npm**: versão 9.x ou superior
- **Navegador**: Chrome, Firefox, Edge ou Safari (versões recentes)

### Dependências Principais
- Vue.js 3.5+
- Vite 7.0+
- Bootstrap 5.3+
- Pinia 3.0+
- Axios 1.10+

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Gera build otimizado para produção
npm run preview      # Preview do build de produção
```

---


## 📚 Licença

Este projeto foi desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) no curso de **Análise e Desenvolvimento de Sistemas**.

Todos os direitos reservados ao autor.

---

## 👨‍💻 Desenvolvedor

**Gustavo Kley**

Desenvolvido como projeto de TCC - Análise e Desenvolvimento de Sistemas