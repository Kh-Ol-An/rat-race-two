import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/Home.vue'),
    },
    {
        path: '/auth',
        name: 'Auth',
        component: () => import('../pages/Auth.vue'),
    },
]

const router = createRouter({
    // history: createWebHashHistory(),
    history: createWebHistory(),
    routes,
})

export default router
