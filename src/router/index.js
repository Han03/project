import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

//注册路由
const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/index')
    },
    {
        path: '/guitar',
        name: 'guitar',
        component: () => import('@/page/guitar')
    },
    {
        path: '/sound',
        name: 'sound',
        component: () => import('@/page/sound')
    },
    {
        path: '/mic',
        name: 'mic',
        component: () => import('@/page/mic')
    }
];
const router = createRouter({
    // createWebHashHistory()是使用hash模式路由
    // createWebHistory()是使用history模式路由
    history: createWebHashHistory(),
    routes
});

export default router;
