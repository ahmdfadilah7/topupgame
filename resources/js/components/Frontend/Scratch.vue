<template>
<div class="app-view active" id="view-scratch" style="padding: 1.5rem; min-height: 80vh;">
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; margin-top: 50px;">
        <h2 class="neon-text" style="margin-bottom: 20px;">Daily Scratch Card</h2>
        <p style="color: var(--text-muted); margin-bottom: 30px; text-align: center;">Scratch the card below to reveal your secret promo code!</p>
        <div class="scratch-container" style="position: relative; width: 300px; height: 150px; background: linear-gradient(45deg, #111, #222); border-radius: 15px; border: 2px solid var(--neon-accent); overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <div class="scratch-code" id="scratch-code" style="font-size: 2rem; font-weight: bold; color: var(--primary-color); letter-spacing: 3px; user-select: none;">
                UPZONE99
            </div>
            <!-- Interactive scratch logic can be implemented via JS later -->
            <div class="scratch-overlay" v-if="!scratched" @click="scratch" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #333; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.5s;">
                Click to Scratch!
            </div>
        </div>
        <button class="btn-buy-now" style="margin-top: 30px;" @click="$router.push('/')">Back to Home</button>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const scratched = ref(false);

const scratch = () => {
    scratched.value = true;
};
</script>
