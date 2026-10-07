<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Promo & Vouchers</h2>
        <p class="text-slate-500 text-sm mt-1">Manage discount codes and promotional vouchers.</p>
      </div>
      <button @click="openCreateModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center space-x-2">
        <i class='bx bx-plus'></i>
        <span>Create Voucher</span>
      </button>
    </div>

    <!-- Voucher List -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-slate-800">Active Vouchers</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Discount</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usage</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expires At</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="voucher in vouchers" :key="voucher.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <span class="font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  {{ voucher.code }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="font-medium text-slate-700">
                  {{ voucher.discount_type === 'percent' ? voucher.discount_value + '%' : 'Rp ' + Number(voucher.discount_value).toLocaleString('id-ID') }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">
                  {{ voucher.uses }} / {{ voucher.max_uses ? voucher.max_uses : 'Unlimited' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">
                  {{ voucher.expires_at ? new Date(voucher.expires_at).toLocaleDateString() : 'Never' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="voucher.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-3 py-1 rounded-full text-xs font-bold">
                  {{ voucher.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button @click="openEditModal(voucher)" class="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                  <i class='bx bx-edit text-lg'></i>
                </button>
                <button @click="deleteVoucher(voucher.id)" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                  <i class='bx bx-trash text-lg'></i>
                </button>
              </td>
            </tr>
            <tr v-if="vouchers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-slate-500">
                No vouchers found. Click "Create Voucher" to add one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit Voucher' : 'Create Voucher' }}</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
            <i class='bx bx-x text-2xl'></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Voucher Code</label>
            <input v-model="form.code" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-mono" placeholder="SUMMER2026">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
              <select v-model="form.discount_type" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed (Rp)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Value</label>
              <input v-model="form.discount_value" type="number" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="10">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Max Uses (Optional)</label>
              <input v-model="form.max_uses" type="number" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="100">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Expires At (Optional)</label>
              <input v-model="form.expires_at" type="date" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>
          <div class="flex items-center space-x-2 pt-2">
            <input v-model="form.is_active" type="checkbox" id="isActive" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <label for="isActive" class="text-sm font-medium text-slate-700">Active</label>
          </div>
        </div>
        <div class="p-6 border-t border-gray-100 bg-slate-50 flex justify-end space-x-3">
          <button @click="closeModal" class="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
          <button @click="saveVoucher" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30">
            Save Voucher
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vouchers: [],
      showModal: false,
      isEditing: false,
      form: {
        id: null,
        code: '',
        discount_type: 'percent',
        discount_value: '',
        max_uses: '',
        expires_at: '',
        is_active: true
      }
    };
  },
  mounted() {
    this.fetchVouchers();
  },
  methods: {
    async fetchVouchers() {
      try {
        const response = await fetch('/api/admin/vouchers');
        this.vouchers = await response.json();
      } catch (err) {
        console.error('Failed to fetch vouchers', err);
      }
    },
    openCreateModal() {
      this.isEditing = false;
      this.form = {
        id: null,
        code: '',
        discount_type: 'percent',
        discount_value: '',
        max_uses: '',
        expires_at: '',
        is_active: true
      };
      this.showModal = true;
    },
    openEditModal(voucher) {
      this.isEditing = true;
      this.form = {
        id: voucher.id,
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value,
        max_uses: voucher.max_uses || '',
        expires_at: voucher.expires_at ? voucher.expires_at.split('T')[0] : '',
        is_active: voucher.is_active
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async saveVoucher() {
      try {
        const url = this.isEditing ? `/api/admin/vouchers/${this.form.id}` : '/api/admin/vouchers';
        const method = this.isEditing ? 'PUT' : 'POST';
        
        const payload = { ...this.form };
        payload.code = payload.code.toUpperCase();
        if (!payload.max_uses) payload.max_uses = null;
        if (!payload.expires_at) payload.expires_at = null;

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.fetchVouchers();
          this.closeModal();
        } else {
          const err = await res.json();
          alert('Error: ' + JSON.stringify(err.errors || err.message));
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteVoucher(id) {
      if (confirm('Are you sure you want to delete this voucher?')) {
        try {
          await fetch(`/api/admin/vouchers/${id}`, { method: 'DELETE' });
          this.fetchVouchers();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}
</script>
