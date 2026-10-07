<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
        <p class="text-slate-500 mt-1 text-sm font-medium">Welcome back, here's what's happening today.</p>
      </div>
      <div class="flex items-center space-x-3">
        <button class="bg-white hover:bg-gray-50 text-slate-700 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm border border-gray-200/60 flex items-center space-x-2 group">
          <i class='bx bx-calendar text-gray-400 group-hover:text-blue-500 transition-colors'></i>
          <span>Last 30 Days</span>
          <i class='bx bx-chevron-down text-gray-400'></i>
        </button>
        <button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center space-x-2 transform hover:-translate-y-0.5">
          <i class='bx bx-cloud-download text-lg'></i>
          <span>Export Report</span>
        </button>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-100/50 text-blue-600 flex items-center justify-center text-2xl backdrop-blur-sm border border-blue-200/50">
              <i class='bx bx-wallet'></i>
            </div>
            <span class="flex items-center space-x-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
              <i class='bx bx-trending-up'></i><span>12.5%</span>
            </span>
          </div>
          <div>
            <p class="text-sm text-slate-400 font-semibold mb-1 uppercase tracking-wider">Total Revenue</p>
            <h3 class="text-3xl font-extrabold text-slate-800 tracking-tight">Rp 45.2M</h3>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center text-2xl backdrop-blur-sm border border-emerald-200/50">
              <i class='bx bx-check-shield'></i>
            </div>
            <span class="flex items-center space-x-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
              <i class='bx bx-trending-up'></i><span>8.2%</span>
            </span>
          </div>
          <div>
            <p class="text-sm text-slate-400 font-semibold mb-1 uppercase tracking-wider">Success Orders</p>
            <h3 class="text-3xl font-extrabold text-slate-800 tracking-tight">1,248</h3>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-amber-100/50 text-amber-600 flex items-center justify-center text-2xl backdrop-blur-sm border border-amber-200/50">
              <i class='bx bx-time-five'></i>
            </div>
            <span class="flex items-center space-x-1 text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
              <i class='bx bx-trending-down'></i><span>2.1%</span>
            </span>
          </div>
          <div>
            <p class="text-sm text-slate-400 font-semibold mb-1 uppercase tracking-wider">Pending Orders</p>
            <h3 class="text-3xl font-extrabold text-slate-800 tracking-tight">32</h3>
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100/50 text-purple-600 flex items-center justify-center text-2xl backdrop-blur-sm border border-purple-200/50">
              <i class='bx bx-group'></i>
            </div>
            <span class="flex items-center space-x-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
              <i class='bx bx-trending-up'></i><span>18.2%</span>
            </span>
          </div>
          <div>
            <p class="text-sm text-slate-400 font-semibold mb-1 uppercase tracking-wider">Active Users</p>
            <h3 class="text-3xl font-extrabold text-slate-800 tracking-tight">8,942</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart & Recent Transactions Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Chart (Placeholder visual) -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 lg:col-span-2 flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-slate-800">Revenue Overview</h3>
          <button class="text-slate-400 hover:text-blue-500 transition-colors"><i class='bx bx-dots-horizontal-rounded text-2xl'></i></button>
        </div>
        <div class="flex-1 w-full bg-slate-50/50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden min-h-[300px]">
          <!-- Abstract Chart Mockup -->
          <div class="absolute bottom-0 w-full h-full flex items-end justify-between px-4 pb-4 space-x-2 opacity-60">
            <div class="w-1/12 bg-blue-200 rounded-t-sm h-[30%]"></div>
            <div class="w-1/12 bg-blue-300 rounded-t-sm h-[50%]"></div>
            <div class="w-1/12 bg-blue-400 rounded-t-sm h-[45%]"></div>
            <div class="w-1/12 bg-blue-500 rounded-t-sm h-[70%]"></div>
            <div class="w-1/12 bg-blue-400 rounded-t-sm h-[60%]"></div>
            <div class="w-1/12 bg-purple-400 rounded-t-sm h-[85%]"></div>
            <div class="w-1/12 bg-purple-500 rounded-t-sm h-[75%]"></div>
            <div class="w-1/12 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-sm h-[95%] shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
          </div>
          <p class="text-slate-400 font-medium z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">Interactive Chart Area</p>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-slate-800">Recent Transactions</h3>
          <router-link to="/admin/transactions" class="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</router-link>
        </div>
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          <!-- Item 1 -->
          <div class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">ML</div>
              <div>
                <p class="text-sm font-bold text-slate-800">Budi Santoso</p>
                <p class="text-xs text-slate-500 font-medium">86 Diamonds</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-slate-800">Rp 20.000</p>
              <p class="text-xs text-emerald-500 font-bold">Success</p>
            </div>
          </div>
          
          <!-- Item 2 -->
          <div class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">FF</div>
              <div>
                <p class="text-sm font-bold text-slate-800">Andi Wijaya</p>
                <p class="text-xs text-slate-500 font-medium">355 Diamonds</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-slate-800">Rp 50.000</p>
              <p class="text-xs text-emerald-500 font-bold">Success</p>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">GI</div>
              <div>
                <p class="text-sm font-bold text-slate-800">Siti Aminah</p>
                <p class="text-xs text-slate-500 font-medium">Blessing of Moon</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-slate-800">Rp 60.000</p>
              <p class="text-xs text-amber-500 font-bold animate-pulse">Processing</p>
            </div>
          </div>

           <!-- Item 4 -->
           <div class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-full bg-zinc-800 text-zinc-100 flex items-center justify-center font-bold text-sm shrink-0">VL</div>
              <div>
                <p class="text-sm font-bold text-slate-800">Rizky Aditya</p>
                <p class="text-xs text-slate-500 font-medium">1000 VP</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-slate-800">Rp 120.000</p>
              <p class="text-xs text-emerald-500 font-bold">Success</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
