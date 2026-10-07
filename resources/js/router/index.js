import { createRouter, createWebHistory } from 'vue-router';
import FrontendLayout from '../components/FrontendLayout.vue';
import Home from '../components/Frontend/Home.vue';
import GameDetail from '../components/Frontend/GameDetail.vue';
import Search from '../components/Frontend/Search.vue';
import Profile from '../components/Frontend/Profile.vue';
import History from '../components/Frontend/History.vue';
import Scratch from '../components/Frontend/Scratch.vue';

import AdminLayout from '../components/AdminLayout.vue';
import Dashboard from '../components/Admin/Dashboard.vue';
import Transactions from '../components/Admin/Transactions.vue';
import Games from '../components/Admin/Games.vue';
import Users from '../components/Admin/Users.vue';
import Vouchers from '../components/Admin/Vouchers.vue';
import Settings from '../components/Admin/Settings.vue';

const routes = [
    {
        path: '/',
        component: FrontendLayout,
        children: [
            { path: '', name: 'home', component: Home },
            { path: 'game/:brand', name: 'game-detail', component: GameDetail },
            { path: 'search', name: 'search', component: Search },
            { path: 'profile', name: 'profile', component: Profile },
            { path: 'history', name: 'history', component: History },
            { path: 'scratch', name: 'scratch', component: Scratch },
        ]
    },
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            { path: '', name: 'admin.dashboard', component: Dashboard },
            { path: 'transactions', name: 'admin.transactions', component: Transactions },
            { path: 'games', name: 'admin.games', component: Games },
            { path: 'users', name: 'admin.users', component: Users },
            { path: 'vouchers', name: 'admin.vouchers', component: Vouchers },
            { path: 'settings', name: 'admin.settings', component: Settings },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
