<template>
  <div class="min-h-screen bg-[#F3F4F6] flex font-['Outfit'] overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-72 bg-[#0B1120] text-slate-300 flex flex-col hidden md:flex transition-all duration-300 relative border-r border-slate-800/50">
      <!-- Glow Effect -->
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none"></div>
      
      <div class="p-8 flex items-center justify-center relative z-10">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
          <i class='bx bx-game text-white text-2xl'></i>
        </div>
        <h1 class="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          UP<span class="text-blue-400">ZONE</span>
        </h1>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-10 custom-scrollbar">
        <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
        
        <router-link to="/admin" class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300" exact-active-class="bg-blue-600/10 text-blue-400 relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full hidden group-[.bg-blue-600\/10]:block"></div>
          <i class='bx bx-category text-xl group-hover:text-blue-400 transition-colors'></i>
          <span class="font-medium">Dashboard</span>
        </router-link>
        
        <router-link to="/admin/transactions" class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-slate-800/50 transition-all duration-300" active-class="bg-blue-600/10 text-blue-400 relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full hidden group-[.bg-blue-600\/10]:block"></div>
          <i class='bx bx-receipt text-xl group-hover:text-blue-400 transition-colors'></i>
          <span class="font-medium">Transactions</span>
        </router-link>
        
        <router-link to="/admin/games" class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-slate-800/50 transition-all duration-300" active-class="bg-blue-600/10 text-blue-400 relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full hidden group-[.bg-blue-600\/10]:block"></div>
          <i class='bx bx-joystick text-xl group-hover:text-blue-400 transition-colors'></i>
          <span class="font-medium">Manage Games</span>
        </router-link>

        <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mt-8 mb-4 block">Administration</p>

        <router-link to="/admin/users" class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-slate-800/50 transition-all duration-300" active-class="bg-blue-600/10 text-blue-400 relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full hidden group-[.bg-blue-600\/10]:block"></div>
          <i class='bx bx-group text-xl group-hover:text-blue-400 transition-colors'></i>
          <span class="font-medium">Users</span>
        </router-link>

        <router-link to="/admin/vouchers" class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-slate-800/50 transition-all duration-300" active-class="bg-blue-600/10 text-blue-400 relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full hidden group-[.bg-blue-600\/10]:block"></div>
          <i class='bx bx-purchase-tag-alt text-xl group-hover:text-blue-400 transition-colors'></i>
          <span class="font-medium">Promo & Vouchers</span>
        </router-link>
        
        <router-link to="/admin/settings" class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-slate-800/50 transition-all duration-300" active-class="bg-blue-600/10 text-blue-400 relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full hidden group-[.bg-blue-600\/10]:block"></div>
          <i class='bx bx-slider-alt text-xl group-hover:text-blue-400 transition-colors'></i>
          <span class="font-medium">Settings</span>
        </router-link>
      </nav>

      <div class="p-6 border-t border-slate-800/50 relative z-10">
        <button class="flex items-center space-x-3 px-4 py-3 w-full text-left text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 group">
          <i class='bx bx-log-out text-xl group-hover:translate-x-1 transition-transform'></i>
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <!-- Header -->
      <header class="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 shrink-0 z-20">
        <div class="flex items-center">
          <button class="md:hidden text-gray-500 hover:text-blue-600 transition-colors">
            <i class='bx bx-menu text-2xl'></i>
          </button>
          <div class="ml-4 md:ml-0 relative text-gray-400 focus-within:text-blue-500 hidden sm:block">
            <i class='bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors'></i>
            <input type="text" placeholder="Quick search..." class="pl-12 pr-4 py-2.5 rounded-2xl bg-gray-100/80 border border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 outline-none w-80 text-sm text-gray-700 transition-all shadow-sm">
          </div>
        </div>
        
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-3">
            <button class="relative p-2.5 text-gray-400 hover:text-slate-700 bg-gray-100/50 hover:bg-gray-100 rounded-xl transition-all">
              <i class='bx bx-bell text-xl'></i>
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
          <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-all">
            <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" class="w-full h-full object-cover">
            </div>
          </div>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-auto p-8 relative z-10 custom-scrollbar">
        <!-- Route Transition (requires setup in router/App but standard view is fine) -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
