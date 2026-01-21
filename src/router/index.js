import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  { path: '/signup', name: 'signup', component: () => import('@/views/SignupView.vue') },
  { path: '/shop', name: 'shop', component: () => import('@/views/ShopView.vue'), meta: { requiresAuth: true } },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue'), meta: { requiresAuth: true } },
  { path: '/product/:id', name: 'product-details', component: () => import('@/views/ProductDetailsView.vue') },
  { path: '/order-success', name: 'order-success', component: () => import('@/views/OrderSuccessView.vue'), meta: { requiresAuth: true } },
  { path: '/my-orders', name: 'my-orders', component: () => import('@/views/MyOrdersView.vue'), meta: { requiresAuth: true } },
  
  // مسارات الأدمن داخل مصفوفة المسارات الرئيسية
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'products', name: 'admin-products', component: () => import('@/views/admin/ProductsView.vue') },
      { path: 'products/add', name: 'admin-add-product', component: () => import('@/views/admin/AddProductView.vue') },
      { path: 'orders', name: 'admin-orders', component: () => import('@/views/admin/OrdersView.vue') },
      { path: 'users', name: 'admin-users', component: () => import('@/views/admin/UsersView.vue') },
      { path: 'coupons', name: 'admin-coupons', component: () => import('@/views/admin/CouponsView.vue') },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// الحماية
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && user.role !== 'ADMIN') {
    next('/'); 
  } else if ((to.name === 'login' || to.name === 'signup') && isAuthenticated) {
    // ✅ الزيادة الناقصة: لو عامل Login مايدخلش login/signup تاني
    next('/shop');
  } else {
    next();
  }
});

export default router;
