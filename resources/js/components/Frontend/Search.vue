<template>
<div class="app-view active" id="view-search">
    <div class="page-header">
        <h2>Search Games</h2>
        <div class="search-bar">
            <i class='bx bx-search'></i>
            <input type="text" placeholder="Find your favorite game..." v-model="searchQuery" @input="filterGames">
        </div>
    </div>
    <div class="search-results games-grid" style="padding: 1.5rem;">
        <div v-for="brand in filteredBrands" :key="brand" class="game-card" @click="openGameDetail(brand)">
            <div class="game-img" :class="'img-' + brand.toLowerCase().replace(/[^a-z0-9]/g, '')">
                <span style="position:absolute; font-weight:bold; font-size:1.5rem; text-shadow:2px 2px 4px rgba(0,0,0,0.8);">{{ brand }}</span>
            </div>
            <div class="game-info">
                <h4>{{ brand }}</h4>
                <p>Instant Process</p>
            </div>
        </div>
        
        <div v-if="filteredBrands.length === 0" style="color: var(--text-muted); text-align: center; grid-column: 1 / -1; margin-top: 2rem;">
            <i class='bx bx-search' style="font-size: 3rem; opacity: 0.5; margin-bottom: 10px; display: block;"></i>
            {{ searchQuery ? 'No games found.' : 'Type to start searching...' }}
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const allBrands = ref([]);
const filteredBrands = ref([]);

const openGameDetail = (brand) => {
    router.push(`/game/${encodeURIComponent(brand)}`);
};

const filterGames = () => {
    if (!searchQuery.value) {
        filteredBrands.value = [];
        return;
    }
    const q = searchQuery.value.toLowerCase();
    filteredBrands.value = allBrands.value.filter(b => b.toLowerCase().includes(q));
};

onMounted(async () => {
    if (window.allGames) {
        allBrands.value = [...new Set(window.allGames.map(g => g.brand))].sort();
    } else {
        try {
            const res = await fetch('/api/games');
            const json = await res.json();
            if (json.data) {
                const activeGames = json.data.filter(g => g.category === 'Games' && g.is_active === true);
                allBrands.value = [...new Set(activeGames.map(g => g.brand))].sort();
                window.allGames = activeGames;
            }
        } catch(e) {
            console.error(e);
        }
    }
});
</script>
