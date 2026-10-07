<template>
<div class="app-view active" id="view-notifications">
    <div class="page-header">
        <h2>Transaction History</h2>
    </div>
    <div class="notif-list">
        <div v-if="!user" style="text-align: center; color: var(--text-muted); margin-top: 50px;">
            <i class='bx bx-history' style="font-size: 3rem; margin-bottom: 10px;"></i>
            <p>Login to view your transaction history.</p>
        </div>
        <div v-else-if="transactions.length === 0" style="text-align: center; color: var(--text-muted); margin-top: 50px;">
            <i class='bx bx-ghost' style="font-size: 3rem; margin-bottom: 10px;"></i>
            <p>No transactions found.</p>
        </div>
        <div v-else v-for="trx in transactions" :key="trx.id" class="notif-item" :class="{ 'unread': trx.status === 'PENDING' }">
            <div class="notif-icon" :class="{ 'success': trx.status === 'SUCCESS', 'failed': trx.status === 'FAILED' }">
                <i class='bx' :class="{'bx-check': trx.status === 'SUCCESS', 'bx-time': trx.status === 'PENDING', 'bx-x': trx.status === 'FAILED'}"></i>
            </div>
            <div class="notif-text">
                <h4>{{ trx.sku }}</h4>
                <p>Status: <strong :style="{ color: trx.status === 'SUCCESS' ? 'var(--neon-accent)' : (trx.status === 'FAILED' ? '#ff4d4d' : 'orange') }">{{ trx.status }}</strong></p>
                <p v-if="trx.payment_method">Method: {{ trx.payment_method }}</p>
                <p style="color: var(--primary-color); font-weight: bold;">Rp {{ Number(trx.amount).toLocaleString('id-ID') }}</p>
                <span class="notif-time">{{ new Date(trx.created_at).toLocaleString() }}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const user = ref(null);
const transactions = ref([]);

const checkAuthAndFetch = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
        const res = await fetch('/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            user.value = await res.json();
            
            // Dummy or real fetch
            // const trxRes = await fetch('/api/user/transactions', { headers: { 'Authorization': `Bearer ${token}` } });
            // if(trxRes.ok) { transactions.value = await trxRes.json(); }
            
            // For now, load dummy data if real endpoint doesn't exist
            transactions.value = [
                { id: 1, sku: '86 Diamonds MLBB', status: 'SUCCESS', payment_method: 'QRIS', amount: 20000, created_at: new Date(Date.now() - 86400000).toISOString() },
                { id: 2, sku: '60 UC PUBG', status: 'PENDING', payment_method: 'BCA VA', amount: 12500, created_at: new Date().toISOString() },
            ];
        }
    } catch (e) {
        console.error("Auth check failed", e);
    }
};

onMounted(() => {
    checkAuthAndFetch();
});
</script>
