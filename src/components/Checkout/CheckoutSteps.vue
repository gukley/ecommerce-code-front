<template> 
    <div class="checkout-steps">
        <div class="steps-container">
            <div class="step" :class="{ active: etapa >= 1, completed: etapa > 1 }">
                <div class="step-circle">
                    <i v-if="etapa > 1" class="bi bi-check"></i>
                    <span v-else>1</span>
                </div>
                <div class="step-label">Endereço</div>
            </div>
            
            <div class="step-line" :class="{ active: etapa >= 2 }"></div>
            
            <div class="step" :class="{ active: etapa >= 2, completed: etapa > 2 }">
                <div class="step-circle">
                    <i v-if="etapa > 2" class="bi bi-check"></i>
                    <span v-else>2</span>
                </div>
                <div class="step-label">Pagamento</div>
            </div>
            
            <div class="step-line" :class="{ active: etapa >= 3 }"></div>
            
            <div class="step" :class="{ active: etapa >= 3, completed: etapa > 3 }">
                <div class="step-circle">
                    <i v-if="etapa > 3" class="bi bi-check"></i>
                    <span v-else>3</span>
                </div>
                <div class="step-label">Confirmação</div>
            </div>
        </div>
    </div>
</template>

<script setup> 
defineProps({ etapa: Number });
</script>

<style scoped>
.checkout-steps {
    margin-bottom: 3rem;
    padding: 0 1rem; /* Adiciona um padding para melhor espaçamento em telas pequenas */
}

.steps-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
}

.step-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #2a2a3e; /* Fundo cinza escuro */
    border: 1px solid rgba(255, 255, 255, 0.1); /* Borda sutil */
    color: #a0a0a0; /* Cinza claro para o número */
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.step-circle i {
    font-size: 20px;
    color: #ffffff; /* Ícone de check branco */
}

.step.active .step-circle {
    background: #007bff; /* Fundo azul vibrante para o passo ativo */
    border-color: #007bff;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    transform: scale(1.1);
}

.step.completed .step-circle {
    background: #28a745; /* Fundo verde para passos concluídos */
    border-color: #28a745;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
}

.step-label {
    font-size: 14px;
    font-weight: 500;
    color: #a0a0a0;
    text-align: center;
    transition: color 0.3s ease;
}

.step.active .step-label {
    color: #ffffff;
    font-weight: 600;
}

.step.completed .step-label {
    color: #ffffff;
}

.step-line {
    width: 80px;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1px;
    transition: all 0.3s ease;
}

.step-line.active {
    background: #007bff; 
}

/* Responsividade */
@media (max-width: 768px) {
    .steps-container {
        gap: 0.75rem;
    }
    
    .step-circle {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }
    
    .step-line {
        width: 50px;
    }
    
    .step-label {
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .step-line {
        width: 30px;
    }
}
</style>