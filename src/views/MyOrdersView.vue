<template>
  <div class="orders-page" dir="rtl">
    <div class="honey-glow-overlay"></div>

    <div class="orders-container animated-reveal">
      <header class="section-header">
        <span class="header-icon">📋</span>
        <h1>سجل الطلبات</h1>
        <p>مراجعة كافة طلبات عسل الزهراء التي تم إجراؤها (لوحة المدير)</p>
      </header>

      <div v-if="errorMsg" class="error-glass">
        <span class="icon">⚠️</span>
        <p>{{ errorMsg }}</p>
        <button @click="router.push('/login')" v-if="errorMsg.includes('تسجيل')">تسجيل الدخول</button>
      </div>

      <div v-if="loading && !errorMsg" class="loader-box">
        <div class="honey-pulse"></div>
        <p>جاري جلب سجل الطلبات من السيرفر...</p>
      </div>

      <div v-if="orders.length === 0 && !loading && !errorMsg" class="empty-state glass-card">
        <div class="empty-icon">🍯</div>
        <p>لا يوجد طلبات مسجلة حالياً في النظام.</p>
        <router-link to="/shop" class="shop-btn">العودة للمتجر</router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-glass-card">
          <div class="order-header">
            <div class="order-info">
              <span class="order-number">طلب رقم #{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>

            <div :class="['status-badge', statusClass(order.status)]">
              {{ formatStatus(order.status) }}
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in (order.items || order.cartItems || [])" :key="item.id" class="item-row">
              <div class="item-name">
                <span class="dot"></span>
                {{ item.product?.name || 'منتج عسل' }}
                <span class="qty">× {{ item.quantity }}</span>
              </div>
              <div class="item-price">{{ (item.price * item.quantity) || 0 }} ج.م</div>
            </div>
          </div>

          <!-- ✅ NEW: عرض الكوبون إن وجد -->
          <div v-if="order.couponCode" class="coupon-glass">
            <div class="coupon-row">
              <span>كود الخصم:</span>
              <b>{{ order.couponCode }}</b>
            </div>
            <div class="coupon-row">
              <span>نسبة الخصم:</span>
              <b>{{ Math.round((Number(order.discountPercent || 0) * 100)) }}%</b>
            </div>
            <div class="coupon-row" v-if="order.subtotal != null">
              <span>قبل الخصم:</span>
              <b>{{ Number(order.subtotal).toFixed(2) }} ج.م</b>
            </div>
            <div class="coupon-row" v-if="order.subtotal != null">
              <span>قيمة الخصم:</span>
              <b>{{ (Number(order.subtotal) - Number(order.totalAmount)).toFixed(2) }} ج.م</b>
            </div>
          </div>

          <div class="order-footer">
            <div class="total-label">قيمة الطلب الإجمالية:</div>
            <div class="total-value">{{ order.totalAmount }} <span>ج.م</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import API from "@/api";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();
const orders = ref([]);
const errorMsg = ref("");
const loading = ref(true);

const formatStatus = (status) => {
  const s = String(status || '').toUpperCase();
  const map = {
    'PENDING_PAYMENT': 'قيد المراجعة',
    'SHIPPED': 'تم الشحن',
    'PAID': 'تم التوصيل',
    'CANCELLED': 'ملغي',
    'PENDING': 'معلق'
  };
  return map[s] || status;
};

const statusClass = (status) => {
  const s = String(status || '').toUpperCase();
  if (s === 'PENDING_PAYMENT' || s === 'PENDING') return 'pending';
  if (s === 'PAID' || s === 'DELIVERED') return 'delivered';
  return s.toLowerCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(async () => {
  try {
    if (!auth.isAuthenticated) {
      errorMsg.value = "يجب تسجيل الدخول لعرض هذه الصفحة.";
      loading.value = false;
      return;
    }

    const res = await API.get("/orders"); 
    orders.value = res.data?.data?.orders || res.data?.data || [];

  } catch (err) {
    console.error("Orders Fetch Error:", err.response?.data);
    if (err.response?.status === 401) {
      errorMsg.value = "انتهت الجلسة. سجل دخولك مرة أخرى.";
    } else if (err.response?.status === 403) {
      errorMsg.value = "عذراً، لا تمتلك صلاحية الأدمن لعرض الطلبات.";
    } else {
      errorMsg.value = "حدث خطأ في الاتصال بالسيرفر (خطأ 400 أو 500).";
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* التنسيقات ثابتة كما في الكود الأصلي لضمان الحفاظ على الشكل */
.orders-page { padding: 140px 5% 60px; min-height: 100vh; position: relative; background: #fffdf5; }
.honey-glow-overlay { position: absolute; inset: 0; background: radial-gradient(circle at 10% 10%, rgba(243, 156, 18, 0.05), transparent); pointer-events: none; }
.orders-container { max-width: 900px; margin: 0 auto; position: relative; z-index: 2; }
.section-header { text-align: center; margin-bottom: 50px; }
.header-icon { font-size: 3rem; display: block; margin-bottom: 10px; }
.section-header h1 { color: #d35400; font-size: 2.2rem; margin: 0; }
.order-glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(15px); border-radius: 30px; border: 1px solid white; padding: 30px; margin-bottom: 25px; box-shadow: 0 15px 35px rgba(211, 84, 0, 0.05); }
.order-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f1f1; padding-bottom: 15px; margin-bottom: 20px; }
.order-number { font-weight: 800; color: #2d3436; font-size: 1.1rem; }
.status-badge { padding: 6px 16px; border-radius: 50px; font-size: 0.8rem; font-weight: bold; }
.status-badge.pending { background: #fff3cd; color: #856404; }
.status-badge.delivered { background: #d4edda; color: #155724; }
.item-row { display: flex; justify-content: space-between; padding: 8px 0; color: #636e72; }
.dot { display: inline-block; width: 6px; height: 6px; background: #f39c12; border-radius: 50%; margin-left: 10px; }
.total-value { font-size: 1.5rem; font-weight: 900; color: #d35400; }
.animated-reveal { animation: revealUp 0.8s ease-out; }
@keyframes revealUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* ✅ NEW: Coupon small box */
.coupon-glass{
  margin-top: 15px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px dashed rgba(243,156,18,0.35);
  background: rgba(243, 156, 18, 0.06);
}
.coupon-row{
  display:flex;
  justify-content: space-between;
  padding: 4px 0;
  color:#2c3e50;
  font-weight: 700;
}
</style>
