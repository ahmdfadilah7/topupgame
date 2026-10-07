<template>
<div class="app-view active">
    <!-- Hero Section with Swiper Slider -->
    <section class="hero-carousel">
        <div class="swiper heroSwiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide banner-1">
                    <div class="slide-content">
                        <h2>Special Promo <br><span class="neon-text">Up to 50%</span></h2>
                        <p>Mobile Legends Diamonds</p>
                    </div>
                </div>
                <div class="swiper-slide banner-2">
                    <div class="slide-content">
                        <h2>New Arrival <br><span class="neon-text">Valorant Points</span></h2>
                        <p>Instant delivery guaranteed</p>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </section>

    <!-- Flash Sale Section -->
    <section class="flash-sale" data-aos="fade-up">
        <div class="section-title">
            <h3><i class='bx bxs-zap neon-text'></i> Flash Sale</h3>
            <div class="countdown">
                <span>02</span>:<span>45</span>:<span>12</span>
            </div>
        </div>
        <div class="flash-grid">
            <div class="flash-card" @click="openGameDetail('Mobile Legends')">
                <div class="discount-tag">-20%</div>
                <div class="game-img-small img-ml">ML</div>
                <h4>86 Diamonds</h4>
                <p class="price strike">Rp 25.000</p>
                <p class="price new">Rp 20.000</p>
            </div>
            <div class="flash-card" @click="openGameDetail('PUBG Mobile')">
                <div class="discount-tag">-15%</div>
                <div class="game-img-small img-pubg">PUBG</div>
                <h4>60 UC</h4>
                <p class="price strike">Rp 15.000</p>
                <p class="price new">Rp 12.500</p>
            </div>
        </div>
    </section>

    <!-- Categories Section -->
    <section class="categories" data-aos="fade-up" style="padding: 0 1.5rem 1.5rem;">
        <div class="section-title">
            <h3><i class='bx bxs-category neon-text'></i> Categories</h3>
        </div>
        <div class="filters">
            <div class="filter-btn active">All Games</div>
            <div class="filter-btn">Mobile</div>
            <div class="filter-btn">PC Games</div>
            <div class="filter-btn">Vouchers</div>
        </div>
    </section>

    <!-- All Games Grid -->
    <section class="all-games" data-aos="fade-up" style="padding: 0 1.5rem 1.5rem;">
        <div class="section-title">
            <h3><i class='bx bxs-game neon-text'></i> Popular Games</h3>
        </div>
        <div class="games-grid" id="game-grid">
            <div v-for="brand in popularBrands" :key="brand" class="game-card" @click="openGameDetail(brand)">
                <div class="game-img" :class="'img-' + brand.toLowerCase().replace(/[^a-z0-9]/g, '')">
                    <span style="position:absolute; font-weight:bold; font-size:1.5rem; text-shadow:2px 2px 4px rgba(0,0,0,0.8);">{{ brand }}</span>
                </div>
                <div class="game-info">
                    <h4>{{ brand }}</h4>
                    <p>Instant Process</p>
                </div>
            </div>
            <div v-if="popularBrands.length === 0" style="text-align: center; grid-column: 1 / -1; padding: 20px;">
                Loading games...
            </div>
        </div>
    </section>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const popularBrands = ref([]);

const fetchGames = async () => {
    try {
        const response = await fetch('/api/games');
        const json = await response.json();
        if (json.data) {
            const activeGames = json.data.filter(g => g.category === 'Games' && g.is_active === true);
            popularBrands.value = [...new Set(activeGames.map(g => g.brand))].sort();
            
            // Pass games to global window to avoid refetching on detail page if wanted
            window.allGames = activeGames; 
        }
    } catch(e) {
        console.error("Failed to fetch games", e);
    }
};

const openGameDetail = (brand) => {
    router.push(`/game/${encodeURIComponent(brand)}`);
};

onMounted(() => {
    fetchGames();
    
    // Initialize Swiper after DOM is ready
    setTimeout(() => {
        if(typeof Swiper !== 'undefined') {
            new Swiper('.heroSwiper', {
                effect: 'cards',
                grabCursor: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                autoplay: { delay: 3000, disableOnInteraction: false }
            });
        }
        
        if(typeof AOS !== 'undefined') {
            AOS.init();
        }
    }, 100);
});
</script>