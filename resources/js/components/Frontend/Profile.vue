<template>
<div class="app-view active" id="view-profile">
    <div v-if="user">
        <div class="profile-header">
            <div class="profile-avatar">
                <i class='bx bxs-user'></i>
            </div>
            <h2>{{ user.name }}</h2>
            <p class="neon-text">{{ user.role === 'admin' ? 'Administrator' : 'Member' }}</p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">{{ user.email }}</p>
        </div>
        <div class="profile-balance">
            <div class="balance-card">
                <p>UpZone Balance</p>
                <h3>Rp {{ Number(user.balance || 0).toLocaleString('id-ID') }}</h3>
            </div>
            <button class="btn-topup-balance" @click="alert('Top up balance feature coming soon!')"><i class='bx bx-plus'></i> Topup</button>
        </div>
        <div class="profile-menu">
            <div class="menu-list-item" @click="$router.push('/history')">
                <i class='bx bx-history'></i>
                <span>Transaction History</span>
                <i class='bx bx-chevron-right'></i>
            </div>
            <div class="menu-list-item">
                <i class='bx bx-cog'></i>
                <span>Settings</span>
                <i class='bx bx-chevron-right'></i>
            </div>
            <div class="menu-list-item">
                <i class='bx bx-help-circle'></i>
                <span>Help Center</span>
                <i class='bx bx-chevron-right'></i>
            </div>
            <div class="menu-list-item text-danger" @click="logout" style="color: #ff4d4d;">
                <i class='bx bx-log-out'></i>
                <span>Log Out</span>
            </div>
        </div>
    </div>
    <div v-else style="padding: 2rem; text-align: center; margin-top: 50px;">
        <i class='bx bx-user-circle' style="font-size: 5rem; color: var(--text-muted); margin-bottom: 20px;"></i>
        <h2 style="margin-bottom: 10px;">Not Logged In</h2>
        <p style="color: var(--text-muted); margin-bottom: 30px;">Login to view your profile, balance, and transaction history.</p>
        <button class="btn-buy-now" style="width: auto; padding: 10px 30px;" @click="openLogin">Login / Register</button>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null);

const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
        const res = await fetch('/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            user.value = await res.json();
        }
    } catch (e) {
        console.error("Auth check failed", e);
    }
};

const logout = () => {
    localStorage.removeItem('auth_token');
    user.value = null;
    router.push('/');
};

const openLogin = () => {
    // Rely on FrontendLayout to show modal by pushing to home and clicking login
    // OR we could emit an event. For now, simple redirect and alert:
    alert('Please click the Login icon in the top right corner.');
};

onMounted(() => {
    checkAuth();
});
</script>
