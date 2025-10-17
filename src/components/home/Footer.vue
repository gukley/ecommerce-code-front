<template>
  <footer class="ggtech-footer text-light py-5 position-relative overflow-hidden">
    <div class="footer-orb footer-orb-1"></div>
    <div class="footer-orb footer-orb-2"></div>

    <div class="container position-relative z-index-1">
      <div class="row">
        <!-- LOGO E SOCIAL -->
        <div class="col-md-3 mb-4 mb-md-0">
          <h4 class="ggtech-footer-logo fw-bold">
            GG<span class="text-secondary-highlight-footer">TECH</span>
          </h4>
          <p class="footer-description">
            Sua loja especializada em hardware gamer e periféricos de alta performance.<br>
            <span class="footer-phrase">Compre com segurança e receba em casa!</span>
          </p>
          <div class="d-flex social-icons mt-3">
            <a href="#" class="footer-icon-link me-3" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="footer-icon-link me-3" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" class="footer-icon-link me-3" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" class="footer-icon-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
          </div>
          <div class="footer-payment mt-4">
            <!-- <img src="/cartoes.png" alt="Formas de pagamento" class="payment-img"> -->
            <span class="footer-payment-text">Aceitamos cartões, Pix e boleto</span>
          </div>
        </div>
        <!-- LINKS RÁPIDOS -->
        <div class="col-md-3 mb-4 mb-md-0">
          <h5 class="fw-bold footer-heading">Links Rápidos</h5>
          <ul class="list-unstyled footer-links">
            <li><a href="#" class="text-decoration-none">Sobre Nós</a></li>
            <li><a href="#" class="text-decoration-none">Produtos</a></li>
            <li><a href="#" class="text-decoration-none">Ofertas</a></li>
            <li><a href="#" class="text-decoration-none">Blog</a></li>
            <li><a href="#" class="text-decoration-none">Minha Conta</a></li>
          </ul>
        </div>
        <!-- SUPORTE -->
        <div class="col-md-3 mb-4 mb-md-0">
          <h5 class="fw-bold footer-heading">Suporte</h5>
          <ul class="list-unstyled footer-links">
            <li><a href="#" class="text-decoration-none">Central de Ajuda</a></li>
            <li><a href="#" class="text-decoration-none">Política de Troca</a></li>
            <li><a href="#" class="text-decoration-none">Garantia</a></li>
            <li><a href="#" class="text-decoration-none">Rastrear Pedido</a></li>
            <li><a href="#" class="text-decoration-none">Contato</a></li>
          </ul>
        </div>
        <!-- CONTATO E SELOS -->
        <div class="col-md-3">
          <h5 class="fw-bold footer-heading">Contato</h5>
          <ul class="list-unstyled footer-links">
            <li>
              <a href="mailto:contato@ggtech.com" class="text-decoration-none">
                <i class="fas fa-envelope me-2"></i>contato@ggtech.com
              </a>
            </li>
            <li>
              <a href="tel:+5542999979432" class="text-decoration-none">
                <i class="fas fa-phone me-2"></i>(42) 99997-9432
              </a>
            </li>
            <li>
              <a href="#" class="text-decoration-none">
                <i class="fas fa-map-marker-alt me-2"></i>Guarapuava, PR
              </a>
            </li>
          </ul>
          <div class="footer-trust mt-4">
            <span class="footer-selo"><i class="fas fa-lock"></i> Site 100% seguro</span>
            <span class="footer-selo"><i class="fas fa-shipping-fast"></i> Frete grátis acima de R$500</span>
            <span class="footer-selo"><i class="fas fa-credit-card"></i> Parcele em até 10x</span>
          </div>
        </div>
      </div>
      <hr class="mt-4 ggtech-divider">
      <div class="text-center mt-3">
        <p class="mb-0 footer-copyright">
          &copy; {{ currentYear }} GGTECH. Todos os direitos reservados
        </p>
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
* { font-family: 'Inter', sans-serif; }

.ggtech-footer {
  background-color: #f9f9f9; /* Fundo claro */
  border-top: 1.5px solid #e0e0e0; /* Borda cinza clara */
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05); /* Sombra leve */
  padding: 2rem 1rem;
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
.z-index-1 { z-index: 1; position: relative; }

.ggtech-footer-logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  color: #333333; /* Texto escuro */
  letter-spacing: 1px;
  display: inline-block;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}
.text-secondary-highlight-footer {
  color: #399bff; /* Destaque azul */
}
.footer-heading {
  color: #333333; /* Texto escuro */
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
.footer-description, .footer-copyright {
  color: #666666; /* Texto cinza */
  font-size: 0.95rem;
}
.footer-phrase {
  color: #399bff; /* Destaque azul */
  font-weight: 600;
  margin-top: 0.7rem;
}
.footer-links li a {
  color: #666666; /* Texto cinza */
  transition: color 0.3s ease;
  text-decoration: none;
}
.footer-links li a:hover {
  color: #399bff; /* Destaque azul ao passar o mouse */
}
.footer-icon-link {
  font-size: 1.4rem;
  color: #399bff; /* Ícones azuis */
  transition: color 0.3s ease, transform 0.3s ease;
}
.footer-icon-link:hover {
  color: #555555; /* Ícones mais escuros ao passar o mouse */
  transform: translateY(-2px);
}
.footer-payment {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 1rem;
}
.payment-img {
  height: 26px;
  width: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.footer-payment-text {
  color: #333333; /* Texto escuro */
  font-size: 0.95rem;
  font-weight: 600;
}
.footer-trust {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}
.footer-selo {
  background-color: #ffffff; /* Fundo branco */
  color: #333333; /* Texto escuro */
  border: 1px solid #e0e0e0; /* Borda cinza clara */
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); /* Sombra leve */
}
.ggtech-divider {
  border-color: #e0e0e0; /* Borda cinza clara */
  opacity: 1;
}
/* Responsividade */
@media (max-width: 991.98px) {
  .mb-4.mb-md-0 { margin-bottom: 1.5rem !important; }
  .footer-orb { display: none; }
  .footer-payment { flex-direction: column; gap: 0.4rem; }
}
@media (max-width: 575.98px) {
  .ggtech-footer-logo { font-size: 1.5rem; }
  .footer-heading { font-size: 1rem; }
  .footer-selo { font-size: 0.9rem; }
}
</style>