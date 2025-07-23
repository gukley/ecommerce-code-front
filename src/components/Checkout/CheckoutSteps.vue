<template> 
    <div class="checkout-steps d-flex justify-content-center mb-5"> 
        <div class="step" :class="{ active: etapa >= 1 }"><span>1</span> Endereço</div>
        <div class="step" :class="{ active: etapa >= 2 }"><span>2</span> Pagamento</div>
        <div class="step" :class="{ active: etapa >= 3 }"><span>3</span> Confirmação</div>
    </div>
</template>

<script setup> 
defineProps({ etapa: Number });
</script>

<style scoped> 
.checkout-steps { 
    gap: 2.5rem;
}
.step { 
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #b0b0c0;
    font-weight: 600;
    font-size: 1.1rem;
    position: relative;
}
.step.active { 
    color: #00ffe1;
}

.step span { 
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #23272f;
    border: 2px solid #00ffe1;
    color: #fff;
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.step:not(:last-child)::after { 
    content: '';
    position: absolute;
    right: -38px;
    top: 16px;
    width: 32px;
    height: 3px;
    background: linear-gradient(90deg, #00ffe1, #007cf0);
    border-radius: 2px;
}
</style>