<template>
  <div dir="rtl" class="app-container">
    <nav class="navbar">
      <router-link to="/" class="logo">
        <span class="honey-icon">🍯</span>
        <h1>متجر الزهراء</h1>
      </router-link>
      
      <div class="nav-links">
        <button @click="isCartOpen = true" class="cart-trigger">
          <span class="cart-icon">🛒</span>
          <span class="badge" v-if="cart.cartCount > 0">{{ cart.cartCount }}</span>
        </button>

        <template v-if="!auth.isAuthenticated">
          <router-link to="/login" class="nav-btn login">تسجيل الدخول</router-link>
          <router-link to="/signup" class="nav-btn signup">إنشاء حساب جديد</router-link>
        </template>
        
        <div v-else class="user-info">
          <router-link v-if="auth.isAdmin" to="/my-orders" class="nav-orders-link">طلباتي 📋</router-link>
          
          <span class="welcome-text">أهلاً، {{ auth.user?.name?.split(' ')[0] }} ✨</span>
          <button @click="auth.logout" class="logout-btn">خروج</button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <CartDrawer :isOpen="isCartOpen" @close="isCartOpen = false" />

    <div class="honey-bg">
      <div class="drop" v-for="n in 5" :key="n"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import CartDrawer from '@/components/CartDrawer.vue';

const auth = useAuthStore();
const cart = useCartStore();
const isCartOpen = ref(false); 
</script>

<style>
:root {
  --primary: #f39c12;
  --secondary: #d35400;
  --bg: #fffdf5;
}

body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: var(--bg); overflow-x: hidden; }

.navbar {
  position: fixed; top: 0; width: 100%; z-index: 1000;
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 5%; box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(243, 156, 18, 0.1);
}

.cart-trigger {
  background: none; border: none; cursor: pointer; position: relative;
  font-size: 1.5rem; display: flex; align-items: center; margin-left: 10px;
}
.badge {
  position: absolute; top: -5px; right: -8px; background: #e74c3c;
  color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 50%;
}

.logo { display: flex; align-items: center; text-decoration: none; gap: 10px; }
.logo h1 { font-size: 1.5rem; color: var(--secondary); margin: 0; }

.nav-links { display: flex; gap: 15px; align-items: center; }

.nav-orders-link {
  color: var(--secondary);
  text-decoration: none;
  font-weight: bold;
  margin-left: 15px;
  font-size: 0.95rem;
}

.nav-btn {
  text-decoration: none; padding: 10px 20px; border-radius: 12px;
  font-weight: bold; transition: all 0.3s ease;
}
.nav-btn.login { color: var(--secondary); border: 2px solid var(--secondary); }
.nav-btn.signup { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3); }

.logout-btn { background: #ff4757; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.5s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(-30px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(30px); }

.main-content { padding-top: 100px; min-height: 100vh; position: relative; z-index: 10; }

.honey-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
.drop {
  position: absolute; width: 50px; height: 50px; background: rgba(243, 156, 18, 0.05);
  border-radius: 50% 0 50% 50%; transform: rotate(45deg);
  animation: drip 10s infinite linear;
}

@keyframes drip {
  0% { transform: translateY(-100px) rotate(45deg); opacity: 0; }
  100% { transform: translateY(100vh) rotate(45deg); opacity: 0; }
}
</style>