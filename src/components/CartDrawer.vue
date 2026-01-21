<template>
  <transition name="drawer-fade">
    <div v-if="isOpen" class="cart-overlay" @click.self="$emit('close')">
      <div class="premium-drawer" dir="rtl">
        <div class="drawer-header">
          <div class="header-title">
            <span class="icon">🛒</span>
            <h3>سلتك الذهبية</h3>
          </div>
          <button @click="$emit('close')" class="close-btn">✕</button>
        </div>

        <div class="drawer-body">
          <div v-if="cart.items.length > 0" class="items-list">
            <div v-for="item in cart.items" :key="item.id" class="glass-item-card">
              <img :src="item.imageUrl" :alt="item.name" />
              <div class="details">
                <h4>{{ item.name }}</h4>
                <div class="price-qty">
                  <span class="price">{{ item.price }} ج.م</span>
                  <div class="qty-selector">
                    <button @click="cart.updateQty(item.id, -1)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="cart.updateQty(item.id, 1)">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-cart">
            <span>🍯</span>
            <p>سلتك خالية.. املأها بالشفاء!</p>
          </div>
        </div>

        <div class="drawer-footer" v-if="cart.items.length > 0">
          <div class="total-section">
            <span>الإجمالي النهائي</span>
            <span class="final-price">{{ cart.total }} ج.م</span>
          </div>
          <button @click="handleCheckout" class="btn-checkout">إتمام الشراء ✨</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

defineProps(['isOpen']);
const emit = defineEmits(['close']); // حل مشكلة ReferenceError: emit is not defined
const cart = useCartStore();
const router = useRouter();

const handleCheckout = () => {
  emit('close');
  router.push('/checkout');
};
</script>

<style scoped>
.cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(10px); z-index: 3000; }
.premium-drawer { 
  position: absolute; left: 0; top: 0; height: 100%; width: 380px; 
  background: rgba(255, 255, 255, 0.9); box-shadow: 20px 0 50px rgba(0,0,0,0.1);
  display: flex; flex-direction: column; animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-header { padding: 25px; border-bottom: 1px solid rgba(243, 156, 18, 0.1); display: flex; justify-content: space-between; align-items: center; }
.header-title h3 { margin: 0; color: #d35400; }
.drawer-body { flex: 1; overflow-y: auto; padding: 20px; }
.glass-item-card { 
  display: flex; gap: 15px; padding: 15px; background: white; border-radius: 20px; 
  margin-bottom: 15px; border: 1px solid #fff5d7; 
}
.glass-item-card img { width: 70px; height: 70px; border-radius: 15px; object-fit: cover; }
.qty-selector { display: flex; gap: 10px; align-items: center; background: #fffcf0; padding: 5px 10px; border-radius: 10px; }
.drawer-footer { padding: 30px; border-top: 1px solid #eee; background: #fffdf5; }
.total-section { display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; font-size: 1.2rem; }
.btn-checkout { 
  width: 100%; padding: 18px; background: #27ae60; color: white; 
  border: none; border-radius: 18px; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.btn-checkout:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(39, 174, 96, 0.2); }

@keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
</style>