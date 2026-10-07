<template>
<div class="app-view active" id="view-topup" style="padding-bottom: 100px;">
    <div class="topup-header img-ml" id="topup-banner">
        <div class="topup-blur-bg"></div>
        <button class="back-btn" @click="$router.push('/')"><i class='bx bx-arrow-back'></i></button>
        <div class="topup-title">
            <h2 id="topup-game-name">{{ brand }}</h2>
            <p>Official Developer</p>
        </div>
    </div>
    
    <div class="topup-body">
        <!-- Step 1 -->
        <div class="topup-step">
            <div class="step-circle">1</div>
            <h3>Account Info</h3>
            <div class="form-group-row" style="display: flex; gap: 10px;">
                <input type="text" v-model="form.userId" placeholder="User ID" style="flex: 2; padding: 10px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--surface-light); color: white;">
                <input type="text" v-model="form.zoneId" placeholder="Zone ID" style="flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--surface-light); color: white;">
            </div>
            <small class="helper-text" style="color: var(--text-muted); display: block; margin-top: 5px;">To find your User ID, tap your avatar in the top left corner of the main menu.</small>
        </div>

        <!-- Step 2 -->
        <div class="topup-step">
            <div class="step-circle">2</div>
            <h3>Select Package</h3>
            <div class="item-grid" id="topup-items">
                <div v-for="item in activeItems" :key="item.buyer_sku_code" 
                     class="item-card advanced" 
                     :class="{ active: form.sku === item.buyer_sku_code }"
                     @click="selectItem(item)">
                    <h4 style="font-size: 14px">{{ item.product_name }}</h4>
                    <p>Rp {{ Number(item.price).toLocaleString('id-ID') }}</p>
                </div>
                <div v-if="activeItems.length === 0" style="color: var(--text-muted); width: 100%;">
                    Loading items...
                </div>
            </div>
        </div>

        <!-- Step 3 -->
        <div class="topup-step">
            <div class="step-circle">3</div>
            <h3>Payment Method</h3>
            <div class="payment-selection" id="topup-payments">
                
                <div v-if="paymentMethods.filter(p => p.type === 'EWALLET').length > 0">
                    <div class="payment-category-title">E-Wallet</div>
                    <div v-for="pm in paymentMethods.filter(p => p.type === 'EWALLET')" 
                         :key="pm.id"
                         class="pay-method-card advanced" 
                         :class="{ active: form.paymentMethod === pm.id }"
                         @click="selectPayment(pm.id)">
                        <div class="pay-info">
                            <i class='bx bx-wallet-alt'></i>
                            <div class="pay-text">
                                <span>{{ pm.name }}</span>
                                <span class="fee">{{ pm.name === 'QRIS' ? 'Free Fee' : '+Rp 1.000' }}</span>
                            </div>
                        </div>
                        <div class="pay-badge">Instant</div>
                    </div>
                </div>

                <div v-if="paymentMethods.filter(p => p.type === 'QR_CODE').length > 0">
                    <div class="payment-category-title">QR Code</div>
                    <div v-for="pm in paymentMethods.filter(p => p.type === 'QR_CODE')" 
                         :key="pm.id"
                         class="pay-method-card advanced" 
                         :class="{ active: form.paymentMethod === pm.id }"
                         @click="selectPayment(pm.id)">
                        <div class="pay-info">
                            <i class='bx bx-qr-scan'></i>
                            <div class="pay-text">
                                <span>{{ pm.name }}</span>
                                <span class="fee">Free Fee</span>
                            </div>
                        </div>
                        <div class="pay-badge">Instant</div>
                    </div>
                </div>

                <div v-if="paymentMethods.filter(p => p.type === 'VIRTUAL_ACCOUNT').length > 0">
                    <div class="payment-category-title">Virtual Account</div>
                    <div v-for="pm in paymentMethods.filter(p => p.type === 'VIRTUAL_ACCOUNT')" 
                         :key="pm.id"
                         class="pay-method-card advanced" 
                         :class="{ active: form.paymentMethod === pm.id }"
                         @click="selectPayment(pm.id)">
                        <div class="pay-info">
                            <i class='bx bxs-bank'></i>
                            <div class="pay-text">
                                <span>{{ pm.name }}</span>
                                <span class="fee">+Rp 2.500</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        
        <!-- Step 4 -->
        <div class="topup-step">
            <div class="step-circle">4</div>
            <h3>Buy! (Optional WhatsApp)</h3>
            <input type="text" v-model="form.whatsapp" placeholder="WhatsApp Number (e.g. 0812...)" style="width: 100%; padding: 10px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--surface-light); color: white;">
        </div>

    </div>

    <!-- Bottom Checkout Bar -->
    <div class="checkout-bar" style="position: fixed; bottom: var(--bottom-nav-height); left: 0; right: 0; max-width: var(--mobile-width); margin: 0 auto; background: var(--surface-color); padding: 15px 20px; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; z-index: 90;">
        <div class="checkout-info">
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 5px;">Total Payment</p>
            <h3 class="neon-text" style="font-size: 1.2rem; font-weight: bold;">Rp {{ Number(totalPrice).toLocaleString('id-ID') }}</h3>
        </div>
        <button class="btn-buy-now" @click="checkout" style="padding: 10px 20px; border-radius: 10px; font-weight: bold;">
            <i class='bx bx-cart'></i> Buy Now
        </button>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const brand = ref(route.params.brand);
const activeItems = ref([]);
const paymentMethods = ref([]);

const form = ref({
    userId: '',
    zoneId: '',
    sku: '',
    paymentMethod: '',
    whatsapp: ''
});

const selectedItem = ref(null);

const totalPrice = computed(() => {
    return selectedItem.value ? selectedItem.value.price : 0;
});

const fetchItems = async () => {
    if (window.allGames) {
        activeItems.value = window.allGames
            .filter(g => g.brand === brand.value && g.seller_product_status === true)
            .sort((a,b) => a.price - b.price);
    } else {
        try {
            const response = await fetch('/api/games');
            const json = await response.json();
            if (json.data) {
                activeItems.value = json.data
                    .filter(g => g.brand === brand.value && g.seller_product_status === true && g.is_active === true)
                    .sort((a,b) => a.price - b.price);
            }
        } catch(e) {
            console.error(e);
        }
    }
};

const fetchPaymentMethods = async () => {
    try {
        const response = await fetch('/api/payment-methods');
        paymentMethods.value = await response.json();
    } catch(e) {
        console.error(e);
    }
};

const selectItem = (item) => {
    form.value.sku = item.buyer_sku_code;
    selectedItem.value = item;
};

const selectPayment = (id) => {
    form.value.paymentMethod = id;
};

const checkout = async () => {
    if (!form.value.userId) return alert('Please enter User ID');
    if (!form.value.sku) return alert('Please select an item');
    if (!form.value.paymentMethod) return alert('Please select a payment method');

    // Proceed to create payment
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: form.value.userId,
                zone_id: form.value.zoneId,
                sku: form.value.sku,
                payment_method: form.value.paymentMethod,
                whatsapp: form.value.whatsapp
            })
        });

        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            if (data.payment_url) {
                window.location.href = data.payment_url;
            } else {
                alert(`Order created! Pay code: ${data.payment_code}`);
            }
        } else {
            alert(data.message || 'Checkout failed');
        }
    } catch(e) {
        console.error(e);
        alert('Checkout error');
    }
};

onMounted(() => {
    fetchItems();
    fetchPaymentMethods();
});
</script>

<style scoped>
.item-card.selected {
    border-color: var(--neon-accent);
    background: rgba(0, 245, 212, 0.1);
    transform: scale(1.02);
}
</style>