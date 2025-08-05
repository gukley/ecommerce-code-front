<template> 
    <div class="confirmation-container">
        <div class="success-card">
            <div class="success-icon">
                <i class="bi bi-check-circle-fill"></i>
            </div>
            
            <h2 class="success-title">Pedido realizado com sucesso!</h2>
            
            <p class="success-message">
                Seu pedido foi recebido e está sendo processado.<br>
                Você receberá atualizações por e-mail.
            </p>
            
            <div class="success-details">
                <div class="detail-item">
                    <i class="bi bi-envelope"></i>
                    <span>Confirmação enviada por e-mail</span>
                </div>
                <div class="detail-item">
                    <i class="bi bi-clock"></i>
                    <span>Processamento em até 24h</span>
                </div>
            </div>
            
            <button class="btn-home" @click="$emit('voltar')">
                <i class="bi bi-house"></i>
                Voltar para Home
            </button>
        </div>
    </div>
</template>

<style scoped>
.confirmation-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
}

.success-card {
    background: #1e1e2d;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 3rem 2.5rem;
    text-align: center;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    backdrop-filter: blur(8px);
    animation: slideIn 0.6s ease-out;
}

.success-icon {
    margin-bottom: 24px;
    animation: bounceIn 0.8s ease-out 0.2s both;
}

.success-icon i {
    font-size: 64px;
    color: #28a745; /* Verde para o ícone de sucesso */
    filter: drop-shadow(0 4px 12px rgba(40, 167, 69, 0.3));
}

.success-title {
    color: #ffffff;
    font-weight: 600;
    font-size: 28px;
    margin-bottom: 16px;
    animation: fadeInUp 0.6s ease-out 0.4s both;
}

.success-message {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 24px;
    animation: fadeInUp 0.6s ease-out 0.6s both;
}

.success-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
    animation: fadeInUp 0.6s ease-out 0.8s both;
}

.detail-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
}

.detail-item i {
    color: #007bff; 
    font-size: 18px;
}

.btn-home {
    background: linear-gradient(145deg, #007bff, #0056b3);
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 auto;
    animation: fadeInUp 0.6s ease-out 1s both;
}

.btn-home:hover {
    background: linear-gradient(145deg, #0056b3, #007bff);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.btn-home:active {
    transform: translateY(0);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.7);
    }
    50% {
        opacity: 1;
        transform: scale(1.1);
    }
    70% {
        transform: scale(0.95);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsividade */
@media (max-width: 768px) {
    .success-card {
        padding: 2rem 1.5rem;
        margin: 0 1rem;
    }
    
    .success-icon i {
        font-size: 48px;
    }
    
    .success-title {
        font-size: 24px;
    }
    
    .success-message {
        font-size: 15px;
    }
    
    .btn-home {
        width: 100%;
        padding: 14px;
    }
    
    .success-details {
        text-align: left;
    }
    
    .detail-item {
        justify-content: flex-start;
    }
}
</style>