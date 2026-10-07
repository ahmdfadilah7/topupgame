<template>
<div class="frontend-wrapper">
    <!-- Matrix Canvas for Hacker Mode -->
    <canvas id="matrix-canvas" class="matrix-canvas"></canvas>
    
    <!-- Desktop Background Layer -->
    <div id="particles-js" class="desktop-bg"></div>

    <!-- Mobile App Container -->
    <div id="mobile-wrapper">
        <!-- Top Header Bar -->
        <div class="top-header">
            <div class="logo" id="logo-btn" @click="goHome" style="cursor:pointer">
                <span class="neon-text">UP</span>ZONE
            </div>
            <div class="header-actions">
                <i v-if="!user" class='bx bx-user-circle' @click="openAuthModal('login')" title="Login" style="cursor: pointer; font-size: 1.5rem;"></i>
                <div v-else class="flex items-center gap-2" @click="$router.push('/profile')" style="cursor: pointer;">
                    <i class='bx bxs-user-circle' style="color: var(--neon-accent); font-size: 1.5rem;"></i>
                    <span style="font-size: 0.8rem; font-weight: bold; color: white;">{{ user.name.split(' ')[0] }}</span>
                </div>
                <i class='bx bx-credit-card-front' style="color: var(--neon-accent); cursor: pointer;"
                    @click="$router.push('/scratch')" title="Daily Scratch Card"></i>
                <i class='bx bx-search' @click="$router.push('/search')"></i>
            </div>
        </div>

        <!-- Live Transaction Ticker (Only visible on Home) -->
        <div v-if="$route.path === '/'" class="transaction-ticker" id="ticker">
            <i class='bx bx-check-circle'></i>
            <span id="ticker-text">Budi just top up 1000 DM MLBB</span>
        </div>

        <!-- Main Scrollable Content -->
        <main class="main-content">
            <router-view />
        </main>

        <!-- Bottom Navigation -->
        <nav class="bottom-nav">
            <div class="nav-item" :class="{ active: $route.path === '/' }" @click="$router.push('/')">
                <i class='bx bx-home-alt'></i>
                <span>Home</span>
            </div>
            <div class="nav-item" :class="{ active: $route.path === '/history' }" @click="$router.push('/history')">
                <i class='bx bx-history'></i>
                <span>History</span>
            </div>
            <div class="nav-item scanner-btn">
                <div class="scanner-icon">
                    <i class='bx bx-scan'></i>
                </div>
            </div>
            <div class="nav-item" :class="{ active: $route.path === '/search' }" @click="$router.push('/search')">
                <i class='bx bx-search'></i>
                <span>Search</span>
            </div>
            <div class="nav-item" :class="{ active: $route.path === '/profile' }" @click="$router.push('/profile')">
                <i class='bx bx-user'></i>
                <span>Profile</span>
            </div>
        </nav>

        <!-- Auth Modal -->
        <div v-if="showAuthModal" class="custom-modal-overlay" style="z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
            <div class="custom-modal animate-fade-in-up" style="width: 100%; max-width: 400px; padding: 30px; border-radius: 20px; background: rgba(20, 21, 35, 0.95); border: 1px solid var(--glass-border); position: relative;">
                <button @click="showAuthModal = false" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: white; cursor: pointer; font-size: 1.5rem;">
                    <i class='bx bx-x'></i>
                </button>
                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="font-size: 1.8rem; font-weight: 700; color: white; margin-bottom: 5px;">{{ authMode === 'login' ? 'Welcome Back' : 'Create Account' }}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">{{ authMode === 'login' ? 'Login to top up faster' : 'Join us to get exclusive rewards' }}</p>
                </div>
                
                <form @submit.prevent="submitAuth" style="display: flex; flex-direction: column; gap: 15px;">
                    <div v-if="authMode === 'login'">
                        <input type="email" v-model="loginForm.email" placeholder="Email Address" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none; margin-bottom: 15px;">
                        <input type="password" v-model="loginForm.password" placeholder="Password" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                    </div>
                    <div v-else style="display: flex; flex-direction: column; gap: 15px;">
                        <input type="text" v-model="registerForm.name" placeholder="Full Name" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                        <input type="email" v-model="registerForm.email" placeholder="Email Address" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                        <input type="password" v-model="registerForm.password" placeholder="Password" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                        <input type="password" v-model="registerForm.password_confirmation" placeholder="Confirm Password" required style="width: 100%; padding: 12px 15px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none;">
                    </div>
                    <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(45deg, var(--primary-color), var(--neon-accent)); border: none; border-radius: 10px; color: white; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 10px;">
                        {{ authMode === 'login' ? 'Login' : 'Register' }}
                    </button>
                </form>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: var(--text-muted); font-size: 0.9rem;">
                        {{ authMode === 'login' ? "Don't have an account?" : "Already have an account?" }}
                        <a href="#" @click.prevent="authMode = authMode === 'login' ? 'register' : 'login'" style="color: var(--neon-accent); text-decoration: none; font-weight: 600;">
                            {{ authMode === 'login' ? 'Register here' : 'Login here' }}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null);
const showAuthModal = ref(false);
const authMode = ref('login');
const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ name: '', email: '', password: '', password_confirmation: '' });

const goHome = () => {
    router.push('/');
};

const openAuthModal = (mode = 'login') => {
    authMode.value = mode;
    showAuthModal.value = true;
};

const checkAuth = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const res = await fetch('/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            user.value = await res.json();
        } else {
            localStorage.removeItem('auth_token');
        }
    } catch (e) {
        console.error("Check auth failed", e);
    }
};

const submitAuth = async () => {
    const url = authMode.value === 'login' ? '/api/login' : '/api/register';
    const payload = authMode.value === 'login' ? loginForm.value : registerForm.value;
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('auth_token', data.access_token);
            user.value = data.user;
            showAuthModal.value = false;
            alert(`Welcome ${data.user.name}!`);
        } else {
            alert(data.message || 'Authentication failed');
        }
    } catch (e) {
        console.error("Auth failed", e);
    }
};

onMounted(async () => {
    document.documentElement.classList.add('frontend-mode');
    document.body.classList.add('frontend-mode');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/style.css?v=1.01';
    link.id = 'frontend-style';
    document.head.appendChild(link);

    await checkAuth();

    // Load visual scripts like particles and matrix
    // BUT we disable the SPA routing of script.js by setting a flag or just running visuals
    window.frontendVueMode = true; 
    
    const script = document.createElement('script');
    script.src = '/script-visuals.js?v=1.04';
    script.id = 'frontend-script';
    script.async = true;
    document.body.appendChild(script);
});

onUnmounted(() => {
    document.documentElement.classList.remove('frontend-mode');
    document.body.classList.remove('frontend-mode');
    
    const script = document.getElementById('frontend-script');
    if (script) script.remove();

    const style = document.getElementById('frontend-style');
    if (style) style.remove();
});
</script>