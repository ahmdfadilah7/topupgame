<template>
  <div class="space-y-6">
    <!-- Header & Stats -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Game Catalog</h2>
        <p class="text-slate-500 text-sm mt-1">Manage active games and toggle product availability for your store.</p>
      </div>
      <div class="flex items-center gap-3">
        <div v-if="globalSettings" class="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 flex items-center gap-3">
          <div class="p-2 bg-indigo-100 text-indigo-600 rounded-md"><i class='bx bx-purchase-tag-alt text-xl'></i></div>
          <div>
            <p class="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Global Markup</p>
            <p class="text-lg font-bold text-indigo-900 leading-none">
              {{ globalSettings.global_markup_type === 'percent' ? globalSettings.global_markup_value + '%' : 'Rp ' + Number(globalSettings.global_markup_value).toLocaleString('id-ID') }}
            </p>
          </div>
        </div>
        <div class="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-3">
          <div class="p-2 bg-blue-100 text-blue-600 rounded-md"><i class='bx bx-cube text-xl'></i></div>
          <div>
            <p class="text-xs text-blue-600 font-semibold uppercase tracking-wider">Total Games</p>
            <p class="text-xl font-bold text-blue-900 leading-none">{{ brands.length }}</p>
          </div>
        </div>
        <button @click="fetchGames" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-md shadow-indigo-200 flex items-center space-x-2">
          <i class='bx bx-cloud-download text-lg' :class="{'bx-fade-down': loading}"></i>
          <span>Sync Data</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex flex-col lg:flex-row gap-6">
      
      <!-- LEFT PANEL: Brands Sidebar/Grid -->
      <div class="w-full lg:w-1/3 flex flex-col gap-4">
        <!-- Search -->
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div class="relative">
            <i class='bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg'></i>
            <input v-model="searchQuery" type="text" placeholder="Search games..." class="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-3 outline-none transition-all">
          </div>
        </div>

        <div v-if="loading" class="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <i class='bx bx-loader-alt bx-spin text-4xl text-indigo-500 mb-3'></i>
          <p class="text-slate-500 font-medium">Synchronizing Data...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
          <i class='bx bx-error-circle text-2xl'></i>
          <p class="text-sm font-medium">{{ error }}</p>
        </div>

        <!-- Brands List -->
        <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex-1 max-h-[600px] overflow-y-auto custom-scrollbar">
          <div v-if="filteredBrands.length === 0" class="p-8 text-center text-slate-400">
            <i class='bx bx-ghost text-4xl mb-2'></i>
            <p>No games found.</p>
          </div>
          <div class="divide-y divide-slate-100">
            <div v-for="brand in filteredBrands" :key="brand" 
                 @click="activeBrand = brand"
                 class="p-4 flex items-center justify-between cursor-pointer transition-colors group"
                 :class="activeBrand === brand ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50 border-l-4 border-transparent'">
              
              <div class="flex items-center gap-4">
                <!-- Icon -->
                <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-105"
                     :class="isBrandActive(brand) ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'">
                  {{ brand.substring(0, 2).toUpperCase() }}
                </div>
                <!-- Info -->
                <div :class="{'opacity-50': !isBrandActive(brand)}">
                  <h3 class="font-bold text-slate-800 text-sm mb-0.5">{{ brand }}</h3>
                  <p class="text-xs text-slate-500">{{ countBrandItems(brand) }} Packages</p>
                </div>
              </div>

              <!-- Brand Toggle -->
              <div @click.stop class="ml-2">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" :checked="isBrandActive(brand)" @change="toggleStatus('brand', brand)">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL: Products Table -->
      <div class="w-full lg:w-2/3">
        <div v-if="!activeBrand && !loading" class="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 min-h-[400px]">
          <i class='bx bxs-hand-up text-6xl mb-4 text-slate-200'></i>
          <h3 class="text-xl font-bold text-slate-700 mb-2">Select a Game</h3>
          <p class="text-sm max-w-sm mx-auto">Choose a game from the list on the left to view and manage its available top-up packages.</p>
        </div>

        <div v-if="activeBrand" class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full max-h-[700px]">
          
          <!-- Table Header -->
          <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 rounded-t-2xl">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md text-xl" :class="{'opacity-50 grayscale': !isBrandActive(activeBrand)}">
                {{ activeBrand.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800 leading-tight">{{ activeBrand }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="flex w-2 h-2 rounded-full" :class="isBrandActive(activeBrand) ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  <span class="text-xs font-medium" :class="isBrandActive(activeBrand) ? 'text-emerald-600' : 'text-red-600'">
                    {{ isBrandActive(activeBrand) ? 'Storefront Active' : 'Storefront Hidden' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="relative w-full sm:w-64">
              <i class='bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg'></i>
              <input v-model="searchProduct" type="text" placeholder="Find product..." class="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2.5 outline-none transition-all shadow-sm">
            </div>
          </div>

          <!-- Table Body -->
          <div class="flex-1 overflow-auto custom-scrollbar">
            <table class="w-full text-left text-sm text-slate-600">
              <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th scope="col" class="px-6 py-4 font-semibold">Package Name</th>
                  <th scope="col" class="px-6 py-4 font-semibold">SKU Code</th>
                  <th scope="col" class="px-6 py-4 font-semibold text-right">Modal</th>
                  <th scope="col" class="px-6 py-4 font-semibold text-right">Selling Price</th>
                  <th scope="col" class="px-6 py-4 font-semibold text-center">Status</th>
                  <th scope="col" class="px-6 py-4 font-semibold text-center">Edit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="filteredActiveBrandItems.length === 0">
                   <td colspan="6" class="px-6 py-8 text-center text-slate-400">No products match your search.</td>
                </tr>
                <tr v-for="item in filteredActiveBrandItems" :key="item.buyer_sku_code" class="hover:bg-slate-50/80 transition-colors group">
                  <td class="px-6 py-4">
                    <div class="font-medium text-slate-800" :class="{'opacity-50 line-through': !item.is_active}">{{ item.product_name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono text-xs border border-slate-200" :class="{'opacity-50': !item.is_active}">{{ item.buyer_sku_code }}</span>
                  </td>
                  <td class="px-6 py-4 text-right text-xs text-slate-500 font-mono" :class="{'opacity-50': !item.is_active}">
                    {{ item.modal_price ? item.modal_price.toLocaleString('id-ID') : item.price.toLocaleString('id-ID') }}
                  </td>
                  <td class="px-6 py-4 text-right font-bold text-indigo-700" :class="{'opacity-50': !item.is_active}">
                    {{ item.price.toLocaleString('id-ID') }}
                  </td>
                  <td class="px-6 py-4 flex justify-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" :checked="item.is_active" @change="toggleStatus('sku', item.buyer_sku_code, item.brand)">
                      <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button @click="editPricing(item)" class="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                        <i class='bx bx-edit text-xl'></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

const items = ref([]);
const loading = ref(false);
const error = ref('');
const activeBrand = ref(null);
const searchQuery = ref('');
const searchProduct = ref('');
const globalSettings = ref(null);

const fetchSettings = async () => {
    try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        globalSettings.value = data;
    } catch (e) {
        console.error("Failed to load settings", e);
    }
};

// Computed for Unique Brands
const brands = computed(() => {
  const uniqueBrands = [...new Set(items.value.map(item => item.brand))];
  return uniqueBrands.sort();
});

// Filter Brands by Search
const filteredBrands = computed(() => {
  if (!searchQuery.value) return brands.value;
  return brands.value.filter(b => b.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Filter Active Brand Items by Search
const filteredActiveBrandItems = computed(() => {
  if (!activeBrand.value) return [];
  let prods = items.value.filter(item => item.brand === activeBrand.value).sort((a, b) => a.price - b.price);
  
  if (searchProduct.value) {
      prods = prods.filter(p => p.product_name.toLowerCase().includes(searchProduct.value.toLowerCase()) || 
                                p.buyer_sku_code.toLowerCase().includes(searchProduct.value.toLowerCase()));
  }
  return prods;
});

const isBrandActive = (brand) => {
  const brandItems = items.value.filter(item => item.brand === brand);
  return brandItems.length > 0 ? brandItems[0].is_active : false;
};

const countBrandItems = (brand) => {
  return items.value.filter(item => item.brand === brand).length;
};

const toggleStatus = async (type, code, brandName = null) => {
    try {
        let currentStatus = false;
        if (type === 'brand') {
            currentStatus = isBrandActive(code);
        } else {
            const item = items.value.find(i => i.buyer_sku_code === code);
            currentStatus = item ? item.is_active : false;
        }
        
        const newStatus = !currentStatus;
        
        const response = await fetch('/api/admin/toggle-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, code, is_active: newStatus })
        });
        
        if (response.ok) {
            items.value.forEach(item => {
                if (type === 'brand' && item.brand === code) {
                    item.is_active = newStatus;
                } else if (type === 'sku' && item.buyer_sku_code === code) {
                    item.is_active = newStatus;
                }
            });
        }
    } catch(e) {
        alert("Failed to toggle status");
    }
};

const fetchGames = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch('/api/games');
    const data = await response.json();
    if (data.data) {
      items.value = data.data.filter(item => item.category === 'Games');
    } else {
      throw new Error('Failed to fetch from API');
    }
  } catch (err) {
    error.value = 'Failed to load data. Please check connection.';
  } finally {
    loading.value = false;
  }
};

const editPricing = async (item) => {
    const modalPrice = item.modal_price || item.price;
    const { value: formValues, isDenied } = await Swal.fire({
        title: 'Custom Pricing',
        html: `
            <div class="text-left mt-4 mb-2 text-sm text-slate-500">
                Set a custom override price for <strong>${item.product_name}</strong>.<br>
                Modal Price (Harga Modal): <span class="font-bold text-slate-800">Rp ${modalPrice.toLocaleString('id-ID')}</span>
            </div>
            <input id="swal-input1" class="swal2-input" placeholder="Custom Price (Rp)" type="number" min="${modalPrice}" value="${item.price}">
            <div class="text-xs text-red-500 mt-2 text-left px-2">Set a specific price or reset to follow global markup.</div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: 'Reset to Global',
        denyButtonColor: '#64748b',
        confirmButtonText: 'Save Custom Price',
        confirmButtonColor: '#4f46e5',
        preConfirm: () => {
            const val = document.getElementById('swal-input1').value;
            if (val && parseInt(val) < modalPrice) {
                Swal.showValidationMessage('Price cannot be lower than modal price!');
                return false;
            }
            return { custom_price: val ? parseInt(val) : null };
        }
    });

    if (formValues || isDenied) {
        let payload = null;
        if (isDenied) {
             payload = null; // Reset to global
        } else {
             payload = formValues.custom_price;
        }

        try {
            const response = await fetch('/api/admin/product-margins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyer_sku_code: item.buyer_sku_code,
                    custom_price: payload,
                    markup_type: null,
                    markup_value: null
                })
            });
            
            if (response.ok) {
                Swal.fire({ icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false });
                fetchGames(); // refresh to recalculate
            }
        } catch (e) {
            Swal.fire('Error', 'Failed to save pricing', 'error');
        }
    }
};

onMounted(() => {
  fetchSettings();
  fetchGames();
});
</script>

<style scoped>
/* Custom Scrollbar for inner lists to make it look native/SaaS */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>
