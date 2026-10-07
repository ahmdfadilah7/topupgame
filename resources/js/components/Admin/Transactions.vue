<template>
  <div class="space-y-6 animate-fade-in-up relative h-full flex flex-col">
    <!-- Top Action Bar -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div class="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none"></div>
      
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <i class='bx bx-receipt text-xl'></i>
          </div>
          Transactions
        </h2>
        <p class="text-sm text-slate-500 mt-1.5 ml-14">Monitor live top-up sales and manage customer orders.</p>
      </div>
      
      <div class="flex items-center gap-3 relative z-10">
        <button @click="fetchTransactions" class="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all group">
          <i class='bx bx-refresh text-xl group-hover:rotate-180 transition-transform duration-500' :class="{'bx-spin': loading}"></i>
          <span>Refresh</span>
        </button>
        <button class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all">
          <i class='bx bx-export text-lg'></i>
          <span>Export CSV</span>
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl shadow-inner">
          <i class='bx bx-check-shield'></i>
        </div>
        <div>
          <p class="text-sm text-slate-500 font-medium mb-1">Success Rate</p>
          <div class="flex items-end gap-2">
            <h3 class="text-3xl font-black text-slate-800 tracking-tight">{{ stats.successRate }}%</h3>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl shadow-inner">
          <i class='bx bx-wallet-alt'></i>
        </div>
        <div>
          <p class="text-sm text-slate-500 font-medium mb-1">Total Revenue</p>
          <h3 class="text-3xl font-black text-slate-800 tracking-tight">Rp {{ (stats.totalRevenue/1000000).toFixed(1) }}<span class="text-xl text-slate-500 font-bold">M</span></h3>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-3xl shadow-inner relative z-10">
          <i class='bx bx-time-five'></i>
        </div>
        <div class="relative z-10">
          <p class="text-sm text-slate-500 font-medium mb-1">Pending Orders</p>
          <div class="flex items-center gap-3">
            <h3 class="text-3xl font-black text-slate-800 tracking-tight">{{ stats.pendingOrders }}</h3>
            <span v-if="stats.pendingOrders > 0" class="flex h-3 w-3 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
        </div>
        <div v-if="stats.pendingOrders > 0" class="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl"></div>
      </div>
    </div>

    <!-- Main Data Grid -->
    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col relative">
      
      <!-- Filters & Search -->
      <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50 justify-between items-center">
        <div class="relative w-full sm:w-96 group">
          <i class='bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-lg'></i>
          <input v-model="searchQuery" type="text" placeholder="Search Trx ID or Customer No..." class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all text-sm font-medium text-slate-700 placeholder-slate-400 shadow-sm">
        </div>
        
        <div class="flex gap-3 w-full sm:w-auto">
          <select v-model="filterStatus" class="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 outline-none shadow-sm cursor-pointer">
            <option value="All">All Status</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto flex-1 custom-scrollbar">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-white border-b border-slate-100">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Transaction ID</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Product Detail</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Destination</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Amount</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-sm">
            <!-- Loading Skeleton -->
            <tr v-if="loading" v-for="i in 5" :key="'skel'+i" class="animate-pulse bg-white">
              <td class="px-6 py-5"><div class="h-5 w-32 bg-slate-200 rounded-md mb-2"></div><div class="h-3 w-24 bg-slate-100 rounded"></div></td>
              <td class="px-6 py-5 flex items-center gap-3">
                <div class="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div><div class="h-4 w-32 bg-slate-200 rounded mb-2"></div><div class="h-3 w-20 bg-slate-100 rounded"></div></div>
              </td>
              <td class="px-6 py-5"><div class="h-5 w-24 bg-slate-200 rounded-md"></div></td>
              <td class="px-6 py-5 text-right"><div class="h-5 w-24 bg-slate-200 rounded-md inline-block"></div></td>
              <td class="px-6 py-5 text-center"><div class="h-6 w-24 bg-slate-200 rounded-full inline-block"></div></td>
              <td class="px-6 py-5 text-right"><div class="h-8 w-8 bg-slate-200 rounded-lg inline-block"></div></td>
            </tr>

            <tr v-else-if="paginatedTransactions.length === 0">
               <td colspan="6" class="px-6 py-16 text-center text-slate-400">
                  <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <i class='bx bx-search-alt text-4xl text-slate-300'></i>
                  </div>
                  <p class="text-lg font-medium text-slate-600 mb-1">No transactions found</p>
                  <p class="text-sm">Try adjusting your search or filters.</p>
               </td>
            </tr>

            <!-- Actual Data -->
            <tr v-else v-for="trx in paginatedTransactions" :key="trx.id" class="hover:bg-slate-50/80 transition-colors duration-200 group bg-white">
              <td class="px-6 py-5">
                <div class="flex flex-col items-start gap-1.5">
                  <span class="font-bold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-md text-xs font-mono border border-slate-200/60">{{ trx.ref_id }}</span>
                  <span class="text-[11px] font-medium text-slate-400 flex items-center gap-1"><i class='bx bx-time-five'></i>{{ formatDate(trx.created_at) }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm" :class="getBrandColor(trx.brand)">
                    {{ (trx.brand || 'XX').substring(0,2).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 text-[15px] mb-0.5">{{ trx.brand || 'Unknown' }}</p>
                    <p class="text-xs font-medium text-slate-500">{{ trx.product_name || trx.buyer_sku_code }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-2 group/copy cursor-pointer" @click="copyText(trx.customer_no)">
                  <span class="font-mono text-sm font-bold text-slate-700">{{ trx.customer_no }}</span>
                  <i class='bx bx-copy text-slate-300 group-hover/copy:text-indigo-500 transition-colors'></i>
                </div>
              </td>
              <td class="px-6 py-5 text-right">
                <span class="font-black text-slate-800">Rp {{ Number(trx.price).toLocaleString('id-ID') }}</span>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex justify-center">
                  <span v-if="trx.status === 'Success'" class="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <i class='bx bx-check-circle text-sm'></i> Success
                  </span>
                  <span v-else-if="trx.status === 'Pending'" class="px-3.5 py-1.5 bg-amber-50 text-amber-600 border border-amber-200/60 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <i class='bx bx-time text-sm'></i> Pending
                  </span>
                  <span v-else class="px-3.5 py-1.5 bg-red-50 text-red-600 border border-red-200/60 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <i class='bx bx-x-circle text-sm'></i> Failed
                  </span>
                </div>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                   <!-- Quick Action for Pending -->
                   <button v-if="trx.status === 'Pending'" @click="updateStatus(trx.id, 'Success')" title="Mark Success" class="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <i class='bx bx-check text-lg'></i>
                   </button>
                   <button v-if="trx.status === 'Pending'" @click="updateStatus(trx.id, 'Failed')" title="Mark Failed" class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <i class='bx bx-x text-lg'></i>
                   </button>
                   
                   <button @click="viewDetail(trx)" class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all shadow-sm flex items-center gap-1.5">
                    Detail <i class='bx bx-right-arrow-alt text-sm'></i>
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer Pagination -->
      <div class="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm font-medium text-slate-500">
          Showing <span class="font-bold text-slate-800">{{ paginationStart }}</span> to <span class="font-bold text-slate-800">{{ paginationEnd }}</span> of <span class="font-bold text-slate-800">{{ filteredTransactions.length }}</span> entries
        </div>
        <div class="flex items-center gap-1.5">
          <button @click="prevPage" :disabled="currentPage === 1" class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
             <i class='bx bx-chevron-left text-xl'></i>
          </button>
          
          <button v-for="page in totalPages" :key="page" @click="currentPage = page" 
                  class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm"
                  :class="currentPage === page ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'">
             {{ page }}
          </button>

          <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0" class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
             <i class='bx bx-chevron-right text-xl'></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

const loading = ref(true);
const transactions = ref([]);
const searchQuery = ref('');
const filterStatus = ref('All');
const currentPage = ref(1);
const pageSize = 10;

// Fetch Data
const fetchTransactions = async () => {
    loading.value = true;
    try {
        const response = await fetch('/api/admin/transactions');
        const data = await response.json();
        transactions.value = data;
    } catch (err) {
        console.error('Failed to load transactions');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
  fetchTransactions();
});

// Computed Stats
const stats = computed(() => {
    const total = transactions.value.length;
    const success = transactions.value.filter(t => t.status === 'Success').length;
    const pending = transactions.value.filter(t => t.status === 'Pending').length;
    const revenue = transactions.value.filter(t => t.status === 'Success').reduce((sum, t) => sum + Number(t.price), 0);
    
    return {
        successRate: total > 0 ? ((success / total) * 100).toFixed(1) : 0,
        totalRevenue: revenue,
        pendingOrders: pending
    };
});

// Filtering
const filteredTransactions = computed(() => {
    let result = transactions.value;
    if (filterStatus.value !== 'All') {
        result = result.filter(t => t.status === filterStatus.value);
    }
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(t => 
            t.ref_id.toLowerCase().includes(q) || 
            t.customer_no.toLowerCase().includes(q) ||
            (t.product_name && t.product_name.toLowerCase().includes(q))
        );
    }
    return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / pageSize));
const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return filteredTransactions.value.slice(start, end);
});
const paginationStart = computed(() => filteredTransactions.value.length === 0 ? 0 : ((currentPage.value - 1) * pageSize) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize, filteredTransactions.value.length));

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

// Helpers
const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getBrandColor = (brand) => {
    const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500'];
    if (!brand) return colors[0];
    const charCode = brand.charCodeAt(0);
    return colors[charCode % colors.length];
};

const copyText = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: show a small toast here
};

// Actions
const updateStatus = async (id, status) => {
    try {
        const response = await fetch(`/api/admin/transactions/${id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (response.ok) {
            // Update local state instantly
            const idx = transactions.value.findIndex(t => t.id === id);
            if (idx !== -1) transactions.value[idx].status = status;
        }
    } catch (e) {
        alert('Failed to update status');
    }
};

const viewDetail = (trx) => {
  const dateStr = formatDate(trx.created_at);
  Swal.fire({
    title: `<div class="flex items-center gap-3"><div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-inner"><i class='bx bx-receipt'></i></div> <span class="font-bold text-slate-800 text-xl tracking-tight">Receipt Detail</span></div>`,
    html: `
      <div class="text-left mt-6 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
        <div class="bg-slate-50/80 rounded-[14px] p-5">
            <div class="flex justify-between items-center mb-5 pb-5 border-b border-slate-200 border-dashed">
            <div>
                <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Status</p>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${trx.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : trx.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}">
                   ${trx.status === 'Success' ? '<i class="bx bx-check-circle"></i>' : trx.status === 'Pending' ? '<i class="bx bx-time"></i>' : '<i class="bx bx-x-circle"></i>'}
                   ${trx.status}
                </div>
            </div>
            <div class="text-right">
                <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Transaction ID</p>
                <p class="font-mono text-sm font-bold text-slate-800">${trx.ref_id}</p>
            </div>
            </div>
            
            <div class="space-y-4">
            <div class="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Purchase Product</p>
                    <p class="font-bold text-slate-800 text-sm">${trx.brand} <span class="text-slate-500 font-medium text-xs ml-1">(${trx.product_name})</span></p>
                </div>
                <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                   <i class='bx bx-cube-alt'></i>
                </div>
            </div>
            
            <div class="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Destination ID</p>
                    <p class="font-mono text-sm font-bold text-slate-700">${trx.customer_no}</p>
                </div>
                 <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                   <i class='bx bx-user'></i>
                </div>
            </div>
            </div>

            <div class="mt-5 pt-5 border-t border-slate-200 border-dashed flex justify-between items-end">
               <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Date</p>
                  <p class="text-xs font-medium text-slate-600">${dateStr}</p>
               </div>
               <div class="text-right">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p class="font-black text-2xl text-slate-800 tracking-tight">Rp ${Number(trx.price).toLocaleString('id-ID')}</p>
               </div>
            </div>
        </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: '<i class="bx bx-printer mr-1"></i> Print Receipt',
    cancelButtonText: 'Close',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-[28px] shadow-2xl border border-slate-100 p-2',
      header: 'border-none pb-0 pt-5 px-6',
      title: 'm-0 w-full',
      htmlContainer: 'm-0',
      closeButton: 'focus:outline-none focus:ring-0 top-7 right-7 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-slate-500 transition-colors',
      actions: 'w-full px-6 pb-5 pt-2 gap-3 m-0 mt-2',
      confirmButton: 'w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-900/20',
      cancelButton: 'w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all'
    }
  });
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
}
</style>
