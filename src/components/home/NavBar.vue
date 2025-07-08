<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3">
    <div class="container-fluid d-flex align-items-center">
      <!-- Logo -->
      <a class="navbar-brand fw-bold fs-3" href="#">
        <span class="text-gradient">GGTECH</span>
      </a>

      <!-- Navegação -->
      <div class="d-flex align-items-center gap-3 ms-5">
        <a class="nav-link text-white" href="#">Home</a>
        <a class="nav-link text-white" href="#">Produtos</a>
        <a class="nav-link text-white" href="#">Categorias</a>
      </div>

      <!-- Barra de busca -->
      <form class="d-flex ms-auto me-4 flex-grow-1" style="max-width: 400px;">
        <input
          class="form-control bg-dark text-white border-secondary"
          type="search"
          placeholder="🔍 Buscar produtos..."
          aria-label="Search"
        />
      </form>

      <!-- Ícones -->
      <div class="d-flex align-items-center gap-4">
        <!-- Carrinho com badge -->
        <div class="position-relative">
          <i class="bi bi-cart3 text-white fs-4"></i>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-purple">
            1
          </span>
        </div>

        <!-- Usuário -->
        <i class="bi bi-person text-white fs-4"></i>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #a362ff, #00ffe1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-purple {
  background-color: #a362ff;
}
</style>
