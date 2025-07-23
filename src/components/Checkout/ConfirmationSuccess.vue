<template> 
    <div class="row justify-content-center"> 
        <div class="col-lg-7"> 
            <div class="card bg-success bg-opacity-75 shadow p-5 text-center"> 
                <i class="bi bi-check-circle display-1 mb-3"></i>
                <h2 class="fw-bold mb-3">Pedido realizado com sucesso!</h2>
                <p class="fs-5 mb-4">Seu pedido foi recebido e está sendo processado.<br>Voce receberá atualizações por e-mail</p>
                <button class="btn btn-main-action px-5" @click="$emit('voltar')">Voltar para Home</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card.bg-success {
  background: rgba(35, 39, 47, 0.95) !important;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  color: #fff;
  border: 2px solid #00ffe1;
}
.btn-main-action {
  background: linear-gradient(90deg, #00ffe1 0%, #007cf0 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 1.12rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0,255,225,0.10);
  transition: all 0.3s ease;
  margin-top: 1.2rem;
}
.btn-main-action:hover {
  background: linear-gradient(90deg, #007cf0 0%, #00ffe1 100%);
  color: #fff;
  box-shadow: 0 8px 25px rgba(0,255,225,0.18);
  transform: translateY(-2px);
}
</style>