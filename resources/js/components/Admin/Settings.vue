<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
            <i class='bx bx-cog text-xl'></i>
          </div>
          Global Settings
        </h2>
        <p class="text-sm text-slate-500 mt-1.5 ml-14">Configure global pricing rules and API integrations.</p>
      </div>
      <button @click="saveSettings" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all">
        <i class='bx bx-save text-lg'></i>
        <span v-if="!saving">Save Changes</span>
        <span v-else>Saving...</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Pricing Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <i class='bx bx-purchase-tag-alt text-blue-500'></i> Global Pricing Strategy
        </h3>
        <p class="text-sm text-slate-500 mb-6">This markup will be applied to all products that do not have a specific custom price set.</p>
        
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Markup Type</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all" :class="settings.global_markup_type === 'percent' ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'">
                <input type="radio" v-model="settings.global_markup_type" value="percent" class="sr-only">
                <div class="flex items-center gap-2 font-medium">
                  <i class='bx bx-pie-chart-alt-2'></i> Percentage (%)
                </div>
              </label>
              <label class="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all" :class="settings.global_markup_type === 'fixed' ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'">
                <input type="radio" v-model="settings.global_markup_type" value="fixed" class="sr-only">
                <div class="flex items-center gap-2 font-medium">
                  <i class='bx bx-money'></i> Fixed Amount (Rp)
                </div>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Markup Value</label>
            <div class="relative">
              <div v-if="settings.global_markup_type === 'fixed'" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</div>
              <input type="number" v-model="settings.global_markup_value" :class="{'pl-10': settings.global_markup_type === 'fixed'}" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-800" placeholder="e.g. 10 or 5000">
              <div v-if="settings.global_markup_type === 'percent'" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</div>
            </div>
            <p class="text-xs text-slate-400 mt-2">Example: If modal is Rp 10.000 and markup is {{ settings.global_markup_type === 'percent' ? '10%, sell price = Rp 11.000' : 'Rp 5.000, sell price = Rp 15.000' }}.</p>
          </div>
        </div>
      </div>
      
      <!-- API Settings Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 opacity-60">
        <h3 class="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <i class='bx bx-server text-blue-500'></i> Provider Config (Read-Only)
        </h3>
        <p class="text-sm text-slate-500 mb-6">These configurations are loaded directly from the system environment file (.env).</p>
        
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Digiflazz Username</label>
            <input type="text" disabled value="tuwumiWXAdqg" class="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none font-mono text-slate-500 text-sm">
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Digiflazz Production Key</label>
            <input type="password" disabled value="************************" class="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none font-mono text-slate-500 text-sm">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const saving = ref(false);
const settings = ref({
    global_markup_type: 'percent',
    global_markup_value: 10
});

const loadSettings = async () => {
    try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        if (data.global_markup_type) settings.value.global_markup_type = data.global_markup_type;
        if (data.global_markup_value) settings.value.global_markup_value = data.global_markup_value;
    } catch (e) {
        console.error(e);
    }
};

const saveSettings = async () => {
    saving.value = true;
    try {
        const response = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings.value)
        });
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Settings Saved',
                text: 'Global markup strategy has been updated.',
                confirmButtonColor: '#2563eb'
            });
        }
    } catch (e) {
        Swal.fire('Error', 'Failed to save settings.', 'error');
    } finally {
        saving.value = false;
    }
};

onMounted(() => {
    loadSettings();
});
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
