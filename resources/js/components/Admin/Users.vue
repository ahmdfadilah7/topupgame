<template>
  <div class="space-y-6 animate-fade-in-up relative h-full flex flex-col">
    <!-- Top Action Bar -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100/50 relative overflow-hidden">
      <div class="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none"></div>
      
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
            <i class='bx bx-group text-xl'></i>
          </div>
          User Directory
        </h2>
        <p class="text-sm text-slate-500 mt-1.5 ml-11">Manage 1,248 total users and their access levels across the platform.</p>
      </div>
      
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-10">
        <div class="relative w-full sm:w-72 group">
          <i class='bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors'></i>
          <input type="text" placeholder="Search by name, email, or ID (Press '/')" class="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition-all text-sm font-medium text-slate-700 placeholder-slate-400">
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shrink-0">⌘ K</kbd>
          </div>
        </div>
        
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button class="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all">
            <i class='bx bx-slider-alt text-lg text-slate-400'></i>
            <span>Filters</span>
          </button>
          <button @click="openDrawer('create')" class="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:shadow-blue-500/30 transition-all group">
            <i class='bx bx-plus text-lg group-hover:rotate-90 transition-transform duration-300'></i>
            <span>New User</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Data Grid -->
    <div class="bg-white border border-slate-100/60 rounded-2xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex flex-col relative">
      <!-- Floating Bulk Action Bar -->
      <transition name="slide-up">
        <div v-if="selectedUsers.length > 0" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-20 backdrop-blur-md bg-slate-900/90 border border-slate-700">
          <div class="flex items-center gap-2 border-r border-slate-700 pr-4">
            <span class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">{{ selectedUsers.length }}</span>
            <span class="text-sm font-medium">Selected</span>
          </div>
          <button class="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"><i class='bx bx-envelope'></i> Email</button>
          <button class="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"><i class='bx bx-export'></i> Export</button>
          <button @click="bulkDelete" class="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 ml-2"><i class='bx bx-trash'></i> Delete</button>
        </div>
      </transition>

      <div class="overflow-x-auto flex-1 custom-scrollbar">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100">
              <th class="px-6 py-4 w-12">
                <div class="relative flex items-center">
                  <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer" @change="toggleAll" :checked="selectedUsers.length === users.length">
                </div>
              </th>
              <th class="px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">User Profile</th>
              <th class="px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Security / Role</th>
              <th class="px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Wallet Balance</th>
              <th class="px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
              <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Manage</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-sm">
            <!-- Loading Skeleton -->
            <tr v-if="loading" v-for="i in 5" :key="'skel'+i" class="animate-pulse">
              <td class="px-6 py-5"><div class="w-4 h-4 bg-slate-200 rounded"></div></td>
              <td class="px-4 py-5 flex items-center gap-4">
                <div class="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div class="space-y-2"><div class="h-3 w-32 bg-slate-200 rounded"></div><div class="h-2 w-24 bg-slate-200 rounded"></div></div>
              </td>
              <td class="px-4 py-5"><div class="h-6 w-20 bg-slate-200 rounded-full"></div></td>
              <td class="px-4 py-5"><div class="h-4 w-24 bg-slate-200 rounded"></div></td>
              <td class="px-4 py-5"><div class="h-6 w-20 bg-slate-200 rounded-full"></div></td>
              <td class="px-6 py-5 text-right"><div class="h-8 w-8 bg-slate-200 rounded-lg inline-block"></div></td>
            </tr>

            <!-- Actual Data -->
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-blue-50/30 transition-all duration-200 group" :class="{'bg-blue-50/20': selectedUsers.includes(user.id)}">
              <td class="px-6 py-4">
                <input type="checkbox" :value="user.id" v-model="selectedUsers" class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer transition-all">
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <img :src="`https://ui-avatars.com/api/?name=${user.name}&background=random&rounded=true&bold=true`" class="w-10 h-10 rounded-xl shadow-sm border border-slate-200/50 group-hover:scale-105 transition-transform" />
                    <div :class="['absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white', user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400']"></div>
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors cursor-pointer">{{ user.name }}</p>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="flex flex-col items-start gap-1.5">
                  <span :class="[
                    'px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider',
                    user.role === 'Admin' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'
                  ]"><i :class="user.role === 'Admin' ? 'bx bx-shield-quarter mr-1' : 'bx bx-user mr-1'"></i>{{ user.role }}</span>
                  <span class="text-[10px] text-slate-400 font-mono tracking-widest">ID: {{ 10000 + user.id }}</span>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-700 text-sm">Rp {{ user.balance.toLocaleString('id-ID') }}</span>
                  <span v-if="user.balance > 100000" class="text-[10px] font-bold text-emerald-500 mt-0.5 flex items-center gap-1"><i class='bx bx-trending-up'></i> High Value</span>
                </div>
              </td>
              <td class="px-4 py-4">
                <span :class="[
                  'px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit border',
                  user.status === 'Active' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                ]">
                  <span :class="['w-1.5 h-1.5 rounded-full', user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400']"></span>
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openDrawer('edit', user)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100 tooltip" data-tip="Edit Profile">
                    <i class='bx bx-slider-alt text-lg'></i>
                  </button>
                  <button @click="confirmDelete(user.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100 tooltip" data-tip="Suspend User">
                    <i class='bx bx-trash-alt text-lg'></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer Pagination -->
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm font-medium text-slate-500">
          Showing <span class="font-bold text-slate-700">1</span> to <span class="font-bold text-slate-700">5</span> of <span class="font-bold text-slate-700">1,248</span> results
        </div>
        <div class="flex items-center gap-1">
          <button class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white transition-all disabled:opacity-50" disabled><i class='bx bx-chevron-left text-xl'></i></button>
          <button class="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">1</button>
          <button class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 text-slate-600 font-medium hover:bg-white transition-all">2</button>
          <button class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 text-slate-600 font-medium hover:bg-white transition-all">3</button>
          <span class="w-9 h-9 flex items-center justify-center text-slate-400">...</span>
          <button class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white transition-all"><i class='bx bx-chevron-right text-xl'></i></button>
        </div>
      </div>
    </div>

    <!-- Slide-over Panel (Drawer) for Create/Edit -->
    <transition name="drawer">
      <div v-if="isDrawerOpen" class="fixed inset-0 z-[100] flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeDrawer"></div>
        
        <!-- Panel -->
        <div class="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
          <!-- Drawer Header -->
          <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-slate-800">{{ drawerMode === 'create' ? 'Onboard New User' : 'Edit User Profile' }}</h3>
              <p class="text-xs text-slate-500 mt-1 font-medium">{{ drawerMode === 'create' ? 'Fill out the details below to create an account.' : `Modifying settings for ID: ${10000 + form.id}` }}</p>
            </div>
            <button @click="closeDrawer" class="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors">
              <i class='bx bx-x text-xl'></i>
            </button>
          </div>

          <!-- Drawer Body (Form) -->
          <div class="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
            <!-- Profile Photo -->
            <div class="flex items-center gap-5">
              <div class="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer group">
                <i class='bx bx-camera text-2xl group-hover:scale-110 transition-transform'></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-800 mb-1">Profile Photo</h4>
                <p class="text-xs text-slate-500 mb-2">Upload a high-res image (Max 2MB).</p>
                <button class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Choose File</button>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-6">
              <label class="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Personal Details</label>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1.5">Full Legal Name</label>
                  <div class="relative">
                    <i class='bx bx-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'></i>
                    <input v-model="form.name" type="text" class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-sm text-slate-700" placeholder="e.g. John Doe">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1.5">Email Address</label>
                  <div class="relative">
                    <i class='bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'></i>
                    <input v-model="form.email" type="email" class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-sm text-slate-700" placeholder="john@company.com">
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-6">
              <label class="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Access & Security</label>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1.5">Account Role</label>
                  <div class="relative">
                    <select v-model="form.role" class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none font-medium text-sm text-slate-700">
                      <option value="Customer">Customer</option>
                      <option value="Admin">Administrator</option>
                    </select>
                    <i class='bx bx-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'></i>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1.5">Account Status</label>
                  <div class="relative">
                    <select v-model="form.status" class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none font-medium text-sm text-slate-700">
                      <option value="Active">Active (Verified)</option>
                      <option value="Inactive">Suspended</option>
                    </select>
                    <i class='bx bx-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'></i>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1.5 flex justify-between">
                  Password 
                  <span v-if="drawerMode==='edit'" class="text-[11px] text-blue-500 font-bold cursor-pointer hover:underline">Generate New</span>
                </label>
                <div class="relative">
                  <i class='bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'></i>
                  <input type="password" class="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-sm text-slate-700" :placeholder="drawerMode === 'edit' ? 'Leave empty to preserve' : 'Min. 8 characters'">
                  <i class='bx bx-show absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600'></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
            <button @click="closeDrawer" class="px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors border border-transparent">Cancel</button>
            <button @click="saveUser" class="px-8 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold shadow-lg shadow-slate-900/20 hover:shadow-blue-500/30 transition-all flex items-center gap-2">
              <i class='bx bx-check'></i>
              {{ drawerMode === 'create' ? 'Create Account' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const loading = ref(true);
const users = ref([]);
const selectedUsers = ref([]);

// Simulate API load
onMounted(() => {
  setTimeout(() => {
    users.value = [
      { id: 1, name: 'Administrator Pro', email: 'admin@upzone.com', role: 'Admin', balance: 5000000, status: 'Active' },
      { id: 2, name: 'Budi Santoso', email: 'budi.santoso@gmail.com', role: 'Customer', balance: 150000, status: 'Active' },
      { id: 3, name: 'Andi Wijaya', email: 'andi.w@yahoo.com', role: 'Customer', balance: 0, status: 'Inactive' },
      { id: 4, name: 'Siti Aminah', email: 'siti88@gmail.com', role: 'Customer', balance: 25000, status: 'Active' },
      { id: 5, name: 'Rina Marlina', email: 'rina.marlina@outlook.com', role: 'Customer', balance: 450000, status: 'Active' },
    ];
    loading.value = false;
  }, 800);
});

const isDrawerOpen = ref(false);
const drawerMode = ref('create'); // 'create' or 'edit'
const form = ref({ id: null, name: '', email: '', role: 'Customer', status: 'Active' });

const toggleAll = (e) => {
  if (e.target.checked) {
    selectedUsers.value = users.value.map(u => u.id);
  } else {
    selectedUsers.value = [];
  }
};

const openDrawer = (mode, user = null) => {
  drawerMode.value = mode;
  if (mode === 'edit' && user) {
    form.value = { ...user };
  } else {
    form.value = { id: null, name: '', email: '', role: 'Customer', status: 'Active' };
  }
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const saveUser = () => {
  closeDrawer();
  
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'rounded-2xl border border-slate-100 shadow-xl',
      title: 'font-medium text-slate-800'
    }
  });

  Toast.fire({
    icon: 'success',
    title: drawerMode.value === 'create' ? 'User successfully created' : 'Profile updated securely'
  });
};

const confirmDelete = (userId) => {
  Swal.fire({
    title: 'Suspend User Account?',
    html: '<p class="text-sm text-slate-500">This action cannot be undone. All associated data will be permanently removed from the server.</p>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#f1f5f9',
    confirmButtonText: 'Yes, permanently delete',
    cancelButtonText: '<span class="text-slate-700">Cancel</span>',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-[24px] shadow-2xl border border-slate-100',
      title: 'text-xl font-bold text-slate-800',
      icon: 'border-none text-red-500',
      actions: 'w-full px-6 pb-6 gap-3',
      confirmButton: 'w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-colors',
      cancelButton: 'w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      users.value = users.value.filter(u => u.id !== userId);
      Swal.fire({
        title: 'Deleted!',
        text: 'User has been removed.',
        icon: 'success',
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-[24px]',
          confirmButton: 'bg-slate-900 text-white font-bold py-3 px-8 rounded-xl'
        }
      });
    }
  });
};

const bulkDelete = () => {
  confirmDelete(selectedUsers.value[0]); // Just for demo
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

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
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
</style>
