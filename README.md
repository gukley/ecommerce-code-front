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
8. [👨‍💻 Desenvolvedor](#-desenvolvedor)  
9. [📷 Capturas de Tela](#-capturas-de-tela)  
10. [📚 Licença](#-licença)

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
- [Vue.js 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Font Awesome](https://fontawesome.com/)
- [Toastify](https://apvarun.github.io/toastify-js/)
- [Stripe JS](https://stripe.com/docs/js)

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
git clone https://github.com/gukley/projeto-ecommerce-code.git
cd projeto-ecommerce-code

2️⃣ Instalar dependências
npm install

3️⃣ Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto com base no .env.example:

VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=sua_chave_publica_aqui

4️⃣ Executar em modo de desenvolvimento

npm run dev

5️⃣ Gerar build para produção

npm run build


🧩 Estrutura do Projeto
projeto-ecommerce-code/
├── public/
├── src/
│   ├── assets/              # Imagens e ícones
│   ├── components/          # Componentes reutilizáveis
│   ├── views/               # Telas principais (Login, Produtos, Checkout, Admin etc.)
│   ├── router/              # Configuração de rotas
│   ├── stores/              # Estados globais (Pinia)
│   ├── services/            # Comunicação com a API (Axios)
│   ├── App.vue
│   └── main.js
├── .env.example
├── package.json
└── vite.config.js


✨ Funcionalidades Principais

👤 Usuários

Cadastro e login com autenticação JWT.

Perfis com informações pessoais, endereços e histórico de pedidos.

Três tipos de acesso: admin, moderator, client.

🛍️ Produtos

Listagem, busca e filtragem por categoria.

Adição ao carrinho com atualização em tempo real.

Exibição de detalhes e cálculo de subtotal.

💳 Checkout e Pagamentos

Seleção de endereço e método de pagamento.

Integração com Stripe para pagamentos simulados.

Tela de confirmação e resumo final do pedido.

⚙️ Painel Administrativo

CRUD de produtos, categorias, usuários, cupons e pedidos.

Interface moderna e responsiva.

Controle de acesso restrito a administradores e moderadores.


🐳 Uso com Docker

O ambiente back-end utilizado no desenvolvimento foi executado via Docker Compose, contendo:

Container para o FastAPI (API principal)

Container para o PostgreSQL

Container para o Stripe CLI (modo de testes)

Exemplo de inicialização:

docker-compose up -d

O front-end pode ser executado localmente com npm run dev, enquanto o back-end roda dentro dos containers Docker.

👨‍💻 Desenvolvedor
Gustavo Kley