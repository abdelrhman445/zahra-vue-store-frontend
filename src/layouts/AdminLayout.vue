<template>
  <div class="admin-layout" :class="{ 'sidebar-open': isSidebarOpen }" dir="rtl">
    <button class="sidebar-toggle" @click="isSidebarOpen = !isSidebarOpen">
      <span v-if="!isSidebarOpen">☰</span>
      <span v-else>✕</span>
    </button>

    <aside class="admin-sidebar glass-card">
      <div class="sidebar-header">
        <span class="icon">👑</span>
        <h3>لوحة الإدارة</h3>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item" @click="isSidebarOpen = false">📊 الإحصائيات</router-link>
        <router-link to="/admin/products" class="nav-item" @click="isSidebarOpen = false">🍯 إدارة المنتجات</router-link>
        <router-link to="/admin/orders" class="nav-item" @click="isSidebarOpen = false">📦 إدارة الطلبات</router-link>
        <router-link to="/admin/users" class="nav-item" @click="isSidebarOpen = false">👥 إدارة المستخدمين</router-link>
        <router-link to="/admin/coupons" class="nav-item" @click="isSidebarOpen = false">🎫 إدارة الكوبونات</router-link>
        <div class="divider"></div>
        <router-link to="/" class="nav-item home-link">🏠 العودة للمتجر</router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="auth.logout" class="btn-logout">تسجيل الخروج</button>
      </div>
    </aside>

    <div class="sidebar-overlay" @click="isSidebarOpen = false"></div>

    <main class="admin-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const isSidebarOpen = ref(false);
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background: #fffdf5; padding: 20px; gap: 20px; position: relative; }

/* القائمة الجانبية */
.admin-sidebar { 
  width: 280px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px);
  border-radius: 30px; padding: 30px; display: flex; flex-direction: column;
  border: 1px solid white; box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
}

.sidebar-header { display: flex; align-items: center; gap: 15px; margin-bottom: 40px; color: #d35400; }
.sidebar-nav { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.nav-item { 
  padding: 15px 20px; border-radius: 15px; text-decoration: none; color: #636e72;
  font-weight: 600; transition: 0.3s;
}
.nav-item:hover, .router-link-active { background: #f39c12; color: white; transform: translateX(-5px); }
.divider { height: 1px; background: rgba(0,0,0,0.05); margin: 10px 0; }
.btn-logout { width: 100%; padding: 12px; border-radius: 12px; border: none; background: #ff4757; color: white; cursor: pointer; font-weight: bold; }

.admin-main { flex: 1; overflow-y: auto; z-index: 1; }

/* زر الموبايل */
.sidebar-toggle {
  display: none; position: fixed; bottom: 20px; right: 20px;
  width: 60px; height: 60px; border-radius: 50%; background: #f39c12;
  color: white; border: none; font-size: 24px; z-index: 1100;
  box-shadow: 0 10px 25px rgba(243, 156, 18, 0.4); cursor: pointer;
}

/* التجاوب مع الشاشات الصغيرة */
@media (max-width: 1024px) {
  .admin-layout { padding: 10px; }
  .admin-sidebar {
    position: fixed; top: 10px; bottom: 10px; right: -300px;
    width: 280px; margin: 0;
  }
  .sidebar-toggle { display: block; }
  .sidebar-open .admin-sidebar { right: 10px; }
  .sidebar-open .sidebar-overlay { display: block; }
}

.sidebar-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index: 1000;
}
</style>