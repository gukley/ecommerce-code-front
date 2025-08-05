<template> 
  <footer class="ggtech-footer text-light py-5 position-relative overflow-hidden"> 
    <div class="footer-orb footer-orb-1"></div>
    <div class="footer-orb footer-orb-2"></div>

    <div class="container position-relative z-index-1"> 
      <div class="row"> 
        <div class="col-md-3 mb-4 mb-md-0"> 
          <h4 class="ggtech-footer-logo fw-bold">GG<span class="text-secondary-highlight-footer">TECH</span></h4>
          <p class="footer-description">Sua loja especializada em hardware gamer e periféricos de alta performance.</p>
          <div class="d-flex social-icons mt-3"> 
            <a href="#" class="text-light me-3 footer-icon-link"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="text-light me-3 footer-icon-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="text-light me-3 footer-icon-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-light footer-icon-link"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
        <div class="col-md-3 mb-4 mb-md-0"> 
          <h5 class="fw-bold footer-heading">Links Rápidos</h5>
          <ul class="list-unstyled footer-links"> 
            <li><a href="#" class="text-decoration-none">Sobre Nós</a></li>
            <li><a href="#" class="text-decoration-none">Produtos</a></li>
            <li><a href="#" class="text-decoration-none">Ofertas</a></li>
            <li><a href="#" class="text-decoration-none">Blog</a></li>
          </ul>
        </div>
        <div class="col-md-3 mb-4 mb-md-0"> 
          <h5 class="fw-bold footer-heading">Suporte</h5>
          <ul class="list-unstyled footer-links"> 
            <li><a href="#" class="text-decoration-none">Central de Ajuda</a></li>
            <li><a href="#" class="text-decoration-none">Política de Troca</a></li>
            <li><a href="#" class="text-decoration-none">Garantia</a></li>
            <li><a href="#" class="text-decoration-none">Contato</a></li>
          </ul>
        </div>
        <div class="col-md-3"> 
          <h5 class="fw-bold footer-heading">Contato</h5>
          <ul class="list-unstyled footer-links"> 
            <li><a href="mailto:contato@ggtech.com" class="text-decoration-none"><i class="fas fa-envelope me-2"></i>contato@ggtech.com</a></li>
            <li><a href="tel:+5542999979432" class="text-decoration-none"><i class="fas fa-phone me-2"></i>(42) 99997-9432</a></li>
            <li><a href="#" class="text-decoration-none"><i class="fas fa-map-marker-alt me-2"></i>Guarapuava, PR</a></li>
          </ul>
        </div>
      </div>
      <hr class="mt-4 ggtech-divider">
      <div class="text-center mt-3"> 
        <p class="mb-0 footer-copyright">&copy; {{ currentYear }} GGTECH. Todos os direitos reservados</p>
      </div>
    </div>
  </footer>
</template>

<script setup> 
import { ref } from 'vue';
const currentYear = ref(new Date().getFullYear());
</script>

<style scoped> 
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&display=swap');
* { 
  font-family: 'Inter', sans-serif;
}

.ggtech-footer { 
  background: linear-gradient(145deg, #1a1a2e, #0f1423);
  min-height: auto;
  position: relative;
  overflow: hidden;
  border-top: 2px solid rgba(163, 98, 255, 0.3);
}

.footer-orb { 
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(80px);
  z-index: 0;
  animation: pulse 6s infinite ease-in-out alternate;
}
.footer-orb-1 { 
  width: 250px;
  height: 250px;
  background: #a362ff;
  top: 10%;
  left: 5%;
  animation-delay: 0.5s;
}
.footer-orb-2 { 
  width: 350px;
  height: 350px;
  background: #00ffe1;
  bottom: 5%;
  right: 10%;
  animation-delay: 3.5s;
}

@keyframes pulse { 
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

.z-index-1 { 
  z-index: 1;
  position: relative;
}

.ggtech-footer-logo { 
  font-family: 'Rajdhani', sans-serif;
  font-size: 2.2rem;
  background: linear-gradient(to right, #a362ff, #00ffe1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

.text-secondary-highlight-footer { 
  color: #00ffe1;
  filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.3));
}
.footer-heading { 
  color: #a362ff;
  font-size: 1.25rem;
  margin-bottom: 1.2rem;
  text-shadow: 0 0 8px rgba(163, 98, 255, 0.2);
}
.footer-description, .footer-copyright { 
  color: #c0c0d0;
  font-size: 0.95rem;
}
.footer-links li a { 
  color: #c0c0d0;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  line-height: 2;
}
.footer-links li a:hover { 
  color: #00ffe1 !important;
  text-shadow: 0 0 8px rgba(0, 255, 225, 0.5);
}

.footer-icon-link { 
  font-size: 1.4rem;
  color: #a362ff !important;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(163, 98, 255, 0.3);
}
.footer-icon-link:hover { 
  color: #00ffe1 !important;
  transform: translateY(-2px);
  text-shadow: 0 0 15px rgba(0, 255, 225, 0.6);
}
.ggtech-divider { 
  border-color: rgba(163, 98, 255, 0.3) !important;
  opacity: 0.8;
}
/* responsividade para telas menores */
@media (max-width: 991.98px) { 
  .mb-4.mb-md-0 { 
    margin-bottom: 1.5rem !important;
  }
  .footer-orb { 
    display: none;
  }
}
</style>