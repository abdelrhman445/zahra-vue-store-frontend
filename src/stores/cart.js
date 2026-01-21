import { defineStore } from 'pinia';
import API from '../api';

export const useCartStore = defineStore('cart', {
  state: () => ({
    // استرجاع السلة من الذاكرة عند التحميل
    items: JSON.parse(localStorage.getItem('cart')) || [],
    coupon: JSON.parse(localStorage.getItem('coupon')) || null,
  }),
  getters: {
    subtotal: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    discountAmount: (state) => state.coupon ? (state.subtotal * (state.coupon.discount / 100)) : 0,
    total: (state) => state.subtotal - state.discountAmount,
    cartCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0)
  },
  actions: {
    // وظيفة مساعدة لحفظ التغييرات تلقائياً
    saveToStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
      localStorage.setItem('coupon', JSON.stringify(this.coupon));
    },
    addToCart(product) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveToStorage(); // حفظ التعديل
    },
    updateQty(productId, change) {
      const item = this.items.find(i => i.id === productId);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) this.items = this.items.filter(i => i.id !== productId);
      }
      this.saveToStorage();
    },
    async applyCoupon(code) {
      try {
        const res = await API.post('/coupons/validate', { code });
        this.coupon = res.data.data;
        this.saveToStorage();
        return { success: true, msg: 'تم تطبيق الخصم! 🎉' };
      } catch (err) {
        return { success: false, msg: 'كود غير صالح ❌' };
      }
    },
    clearCart() {
      this.items = [];
      this.coupon = null;
      localStorage.removeItem('cart');
      localStorage.removeItem('coupon');
    }
  }
});