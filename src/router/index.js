import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AddRecordPage from '@/views/AddRecordPage.vue';
import StatsPage from '@/views/StatsPage.vue';
import MePage from '@/views/MePage.vue';

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomePage
    },

    {
        path: "/add",
        name: "AddRecord",
        component: AddRecordPage
    },

    {
        path: "/stats",
        name: "Stats",
        component: StatsPage
    },

    {
        path: "/me",
        name: "Me",
        component: MePage
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;