<template> 
  <section class="hero-section text-white py-5 d-flex align-items-center"> 
    <div class="container position-relative z-index-1"> 
      <div class="row justify-content-center text-center"> 
        <div class="col-lg-10 col-xl-9"> 
          <!-- Banner de desconto -->
          <div class="hero-discount-banner mb-3 animate-fade-up" style="animation-delay: 0.1s;">
            <span class="discount-badge">🎉 SUPER OFERTA: 20% OFF em GPUs selecionadas! <router-link to="/produtos" class="see-offers-link">Ver ofertas</router-link></span>
          </div>

          <div class="badge-new-gen mb-4 px-4 py-2 fw-medium animate-fade-up" style="animation-delay: 0.2s;"> 
            🚀 NOVA GERAÇÃO DISPONÍVEL
          </div> 

          <h1 class="display-3 fw-bold mb-4 main-heading animate-fade-up" style="animation-delay: 0.4s;"> <span class="text-gradient-main">EVOLUA SEU</span><br />
            <span class="text-secondary-highlight">SETUP GAMER</span>
          </h1>

          <p class="hero-description mt-4 fs-5 animate-fade-up" style="max-width: 700px; margin: 0 auto; animation-delay: 0.6s;"> 
            Escolha sua máquina ideal com os melhores periféricos e acessórios gamers.
          </p>

          <!-- Produtos em destaque lado a lado -->
          <div class="hero-featured-products-row d-flex flex-wrap justify-content-center gap-4 my-4 animate-fade-up" style="animation-delay: 0.7s;">
            <div class="hero-featured-product" style="max-width: 420px;">
              <div class="featured-product-card d-flex align-items-center p-3">
                <img src="@/assets/5060rtx.jpg" alt="Placa de Vídeo RTX 5060" class="featured-product-img me-3" />
                <div class="text-start">
                  <div class="featured-product-title">Placa de Vídeo RTX 5060 8GB</div>
                  <div class="featured-product-prices">
                    <span class="old-price">R$ 4.750</span>
                    <span class="new-price ms-2">R$ 4.300</span>
                  </div>
                  <router-link to="/produtos" class="btn btn-featured-buy mt-2">Comprar Agora</router-link>
                </div>
              </div>
            </div>
            <div class="hero-featured-product" style="max-width: 420px;">
              <div class="featured-product-card d-flex align-items-center p-3">
                <img src="@/assets/watercooler categoria.jpeg" alt="Water Cooler Kalkan" class="featured-product-img me-3" />
                <div class="text-start">
                  <div class="featured-product-title">Water Cooler Kalkan Iota</div>
                  <div class="featured-product-prices">
                    <span class="old-price">R$ 260</span>
                    <span class="new-price ms-2">R$ 230</span>
                  </div>
                  <router-link to="/produtos" class="btn btn-featured-buy mt-2">Comprar Agora</router-link>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-center gap-3 mt-4 animate-fade-up" style="animation-delay: 0.8s;"> 
            <router-link to="/produtos" class="btn btn-main-action px-5 py-3 fw-bold"> 
              ⚡ Explorar Produtos
            </router-link>
            <router-link to="/produtos" class="btn btn-outline-secondary-light px-5 py-3 fw-bold"> 
              Ver Ofertas
            </router-link>
          </div>

          <!-- Selos de confiança -->
          <div class="hero-trust d-flex justify-content-center gap-4 mt-4 animate-fade-up" style="animation-delay: 0.9s;">
            <span>✔️ Site 100% seguro</span>
            <span>🚚 Frete grátis acima de R$500</span>
            <span>💳 Parcele em até 10x</span>
          </div>
        </div>
      </div>
    </div>
  </section> 
</template>

<style scoped> 
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

* { 
  font-family: 'Rajdhani', sans-serif;
}

.hero-section { 
  background: linear-gradient(145deg, #1a1a2e, #0f1423),repeat;
  min-height: 85vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid rgba(163, 98, 255, 0.3);
}

/* pseudo-elementos pra efeito de particulas */
.hero-section::before,
.hero-section::after { 
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(80px); /* efeito de brilho */
  z-index: 0;
  animation: pulse 6s infinite ease-in-out alternate;
}

.hero-section::before { 
  width: 300px;
  height: 300px;
  background: #a362ff;
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.hero-section::after { 
  width: 400px;
  height: 400px;
  background: #00ffe1;
  bottom: 10%;
  right: 15%;
  animation-delay: 3s;
}

/* animaçao de pulso para pseudo elementos */
@keyframes pulse { 
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

/* pra garantir que o conteudo fique acima dos efeitos */
.z-index-1 { 
  z-index: 1;
}

/* Badge "NOVA GERAÇAO" */
.badge-new-gen {
  background: linear-gradient(90deg, #a362ff, #8f5fe8) !important;
  color: white;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  box-shadow: 0 0 15px rgba(163, 98, 255, 0.5); /* sombra mais brilhante */
  animation: fadeInDown 0.8s ease forwards;
}
/* Titulo principal */
.main-heading { 
  font-family: 'Orbitron', sans-serif;
  font-size: 3.8rem;
  line-height: 1.2;
  text-shadow: 0 0 25px rgba(255, 255, 255, 0.4);
  animation: fadeUp 1s ease-out forwards;
}

.text-gradient-main { 
  background: linear-gradient(to right, #a362ff, #00ffe1); 
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.text-secondary-highlight { 
  color: #00ffe1;
  filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.4));
}

.hero-description { 
  color: #c0c0d0;
  line-height: 1.7;
  font-weight: 400;
  animation: fadeUp 1s ease-out forwards;
}

/*botoes */
.btn-main-action { 
  background: linear-gradient(90deg, #a362ff, #8f5fe8);
  color: #fff;
  border: 2px solid #cbb6ff;
  font-size: 1.15rem;
  border-radius: 50px;
  box-shadow: 0 4px 16px rgba(163,98,255,0.18);
  transition: all 0.3s ease;
  min-width: 200px;
}

.btn-main-action:hover { 
  background: linear-gradient(90deg, #8f5fe8, #a362ff);
  color: #fff;
  box-shadow: 0 8px 25px rgba(163,98,255,0.28);
  transform: translateY(-3px) scale(1.02);
}

.btn-outline-secondary-light { 
  border: 2px solid #00ffe1;
  color: #00ffe1;
  background-color: transparent;
  font-size: 1.15rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  min-width: 200px;
}

.btn-outline-secondary-light:hover { 
  background-color: #00ffe1;
  color: #1a1a2e;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 255, 225, 0.4);
}

/*Animaçoes */
.animate-fade-up { 
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.8s ease-out forwards;
}
@keyframes fadeUp { 
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInDown { 
  0% { 
    opacity: 0;
    transform: translateY(-20px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Adições para banner, produto em destaque e selos */
.hero-discount-banner {
  background: linear-gradient(90deg, #a362ff, #00ffe1); 
  color: #1a1a2e;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(163, 98, 255, 0.15);
  display: inline-block;
}
.discount-badge .see-offers-link {
  color: #1a1a2e;
}
.discount-badge .see-offers-link:hover {
  color: #fff;
  background: #a362ff;
  border-radius: 8px;
  padding: 0 0.3rem;
}

.hero-featured-product {
  background: rgba(26,26,46,0.85);
  border-radius: 18px;
  box-shadow: 0 2px 18px rgba(163,98,255,0.10);
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.featured-product-card {
  gap: 1rem;
}
.featured-product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #a362ff;
  background: #fff;
}
.featured-product-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}
.featured-product-prices {
  margin-top: 0.2rem;
}
.old-price {
  color: #c0c0d0;
  text-decoration: line-through;
  font-size: 1rem;
}
.new-price {
  color: #00ffe1;
  font-size: 1.2rem;
  font-weight: 700;
}
.btn-featured-buy {
  background: linear-gradient(90deg, #a362ff, #00ffe1);
  color: #1a1a2e;
  border-radius: 20px;
  padding: 0.3rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.2rem;
  transition: all 0.2s;
  display: inline-block;
}
.btn-featured-buy:hover {
  background: linear-gradient(90deg, #00ffe1, #a362ff);
  color: #fff;
}

.hero-trust {
  font-size: 1.05rem;
  color: #b0f7f7;
  gap: 2rem;
}

/* responsividade com media queries */
@media (max-width: 991.98px) { 
  .hero-section { 
    min-height: 70vh;
    padding: 3rem 1rem;
  }
  .main-heading { 
    font-size: 2.8rem;
  }
  .hero-description { 
    font-size: 1.1rem;
  }
  .btn-main-action, .btn-outline-secondary-light { 
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    min-width: unset; 
    width: 100%;
  }
  .d-flex.justify-content-center.gap-3.mt-5 { 
    flex-direction: column;
    gap: 1rem !important;
  }
  .hero-section::before, .hero-section::after { 
    display: none;
  }
  .badge-new-gen { 
    font-size: 0.85rem;
  }
  .hero-featured-product {
    max-width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .featured-product-img {
    width: 60px;
    height: 60px;
  }
  .hero-trust {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.98rem;
  }
  .hero-discount-banner {
    font-size: 0.98rem;
    padding: 0.5rem 1rem;
  }
  .hero-featured-products-row {
    flex-direction: column !important;
    gap: 1.2rem;
  }
}

@media (max-width: 575.98px) {
  .main-heading {
    font-size: 2.2rem;
  }
  .hero-description {
    font-size: 0.95rem;
  }
}
</style>