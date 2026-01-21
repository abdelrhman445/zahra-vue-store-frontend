<template>
  <div class="dashboard-premium animated-reveal" dir="rtl">
    <div class="honey-ambient-glow"></div>

    <div class="container-pro">
      <header class="page-header-pro glass-card">
        <div class="header-main">
          <div class="icon-sphere">📊</div>
          <div class="title-text">
            <h1 class="glitter-text">نظرة عامة على المملكة</h1>
            <p>ملخص الأداء والنشاط لمتجر الزهراء</p>
          </div>
        </div>
        <div class="date-capsule glass-card">
          <span class="calendar-icon">📅</span>
          <span>{{ formattedDate }}</span>
        </div>
      </header>

      <div v-if="loading" class="premium-loader">
        <div class="honey-pulse"></div>
        <p>جاري استخلاص البيانات من الخلية...</p>
      </div>

      <div v-else class="dashboard-content">
        <div class="stats-grid-premium">
          <div class="stat-card-pro glass-card revenue">
            <div class="card-inner">
              <div class="visual-box">💰</div>
              <div class="data-box">
                <h3>إجمالي المبيعات</h3>
                <div class="value-wrap">
                  <span class="number">{{ stats.totalRevenue || 0 }}</span>
                  <span class="suffix">ج.م</span>
                </div>
              </div>
            </div>
            <div class="card-progress rev-bg"></div>
          </div>

          <div class="stat-card-pro glass-card orders">
            <div class="card-inner">
              <div class="visual-box">📦</div>
              <div class="data-box">
                <h3>الطلبات المكتملة</h3>
                <div class="value-wrap">
                  <span class="number">{{ stats.ordersCount || 0 }}</span>
                  <span class="suffix">طلب</span>
                </div>
              </div>
            </div>
            <div class="card-progress ord-bg"></div>
          </div>

          <div class="stat-card-pro glass-card inventory">
            <div class="card-inner">
              <div class="visual-box">🍯</div>
              <div class="data-box">
                <h3>المنتجات النشطة</h3>
                <div class="value-wrap">
                  <span class="number">{{ stats.productsCount || 0 }}</span>
                  <span class="suffix">صنف</span>
                </div>
              </div>
            </div>
            <div class="card-progress inv-bg"></div>
          </div>
        </div>

        <div class="activity-section-pro glass-card">
          <div class="section-head">
            <div class="head-title">
              <span class="pulse-dot"></span>
              <h3>آخر التحركات في الخلية 🔔</h3>
            </div>
            <router-link to="/admin/orders" class="btn-view-all">إدارة كافة الطلبات</router-link>
          </div>

          <div class="activity-list-pro">
            <div v-if="recentOrders.length === 0" class="empty-notif">
              لا توجد طلبات جديدة اليوم..
            </div>
            
            <div v-for="(order, index) in recentOrders" :key="order.id" 
                 class="activity-row glass-card" :style="{ '--delay': index * 0.1 + 's' }">
              <div class="order-main-info">
                <div class="order-avatar">{{ (order.guestName || order.user?.name || 'U').charAt(0) }}</div>
                <div class="order-details">
                  <span class="customer-name">{{ order.guestName || order.user?.name }}</span>
                  <span class="order-id">طلب رقم #{{ order.id }}</span>
                </div>
              </div>
              <div class="order-meta-info">
                <div class="order-amount">{{ order.totalAmount }} ج.م</div>
                <div :class="['status-badge-mini', order.status?.toLowerCase()]">
                  {{ formatStatus(order.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import API from '@/api';

// الحفاظ على المنطق البرمجي
const stats = ref({});
const recentOrders = ref([]);
const loading = ref(true);

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
});

const formatStatus = (status) => {
  const map = { 'PENDING': 'معلق', 'SHIPPED': 'شُحن', 'DELIVERED': 'وصل', 'CANCELLED': 'ملغي' };
  return map[status] || status;
};

onMounted(async () => {
  try {
    // جلب الإحصائيات الحقيقية
    const sRes = await API.get('/admin/stats');
    stats.value = sRes.data.data;
    
    // جلب آخر الطلبات
    const oRes = await API.get('/admin/orders');
    const allOrders = oRes.data.data?.orders || oRes.data.data || [];
    recentOrders.value = allOrders.slice(0, 5);
  } catch (e) {
    console.error("Dashboard Sync Error:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.dashboard-premium { padding: 40px 5% 100px; background: #fffdf5; min-height: 100vh; position: relative; overflow: hidden; }

/* توهج جمالي متناغم مع هوية العسل */
.honey-ambient-glow {
  position: absolute; top: -15%; left: -10%; width: 50%; height: 50%;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.12), transparent 70%);
  pointer-events: none; z-index: 0;
}

.container-pro { max-width: 1250px; margin: 0 auto; position: relative; z-index: 1; }

/* هيدر الصفحة الفخم */
.page-header-pro { 
  display: flex; justify-content: space-between; align-items: center;
  padding: 30px 40px; border-radius: 35px; border: 1px solid white; margin-bottom: 40px;
}

.header-main { display: flex; align-items: center; gap: 20px; }
.icon-sphere { 
  width: 65px; height: 65px; background: linear-gradient(135deg, #f39c12, #d35400); 
  border-radius: 22px; display: flex; align-items: center; justify-content: center; 
  font-size: 2rem; color: white; box-shadow: 0 10px 25px rgba(211, 84, 0, 0.2); 
}

.glitter-text { 
  margin: 0; font-size: 2rem; font-weight: 900; 
  background: linear-gradient(45deg, #d35400, #f39c12);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.date-capsule { 
  padding: 12px 25px; border-radius: 50px; border: 1px solid rgba(243, 156, 18, 0.1);
  display: flex; align-items: center; gap: 10px; font-weight: bold; color: #2c3e50; font-size: 0.9rem;
}

/* شبكة كروت الإحصائيات */
.stats-grid-premium { 
  display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
  gap: 25px; margin-bottom: 50px; 
}

.stat-card-pro { 
  padding: 35px; border-radius: 40px; border: 1px solid white; position: relative; overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.stat-card-pro:hover { transform: translateY(-10px); box-shadow: 0 25px 50px rgba(211, 84, 0, 0.12); }

.card-inner { display: flex; align-items: center; gap: 25px; position: relative; z-index: 2; }
.visual-box { width: 70px; height: 70px; background: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: 0 10px 20px rgba(0,0,0,0.03); }

.data-box h3 { font-size: 0.95rem; color: #7f8c8d; margin: 0 0 8px; font-weight: bold; }
.value-wrap { display: flex; align-items: baseline; gap: 8px; }
.number { font-size: 2.4rem; font-weight: 900; color: #2c3e50; }
.suffix { font-size: 1rem; color: #95a5a6; font-weight: bold; }

.card-progress { position: absolute; bottom: 0; left: 0; height: 6px; width: 100%; opacity: 0.8; }
.rev-bg { background: #27ae60; }
.ord-bg { background: #2980b9; }
.inv-bg { background: #f39c12; }

/* قسم الأنشطة المطور */
.activity-section-pro { padding: 40px; border-radius: 45px; border: 1px solid white; }

.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
.head-title { display: flex; align-items: center; gap: 15px; }
.pulse-dot { width: 10px; height: 10px; background: #f39c12; border-radius: 50%; animation: pulse-orange 1.5s infinite; }

.btn-view-all { 
  padding: 10px 25px; border-radius: 50px; background: rgba(243, 156, 18, 0.1); 
  color: #d35400; text-decoration: none; font-weight: 800; font-size: 0.9rem; transition: 0.3s;
}
.btn-view-all:hover { background: #f39c12; color: white; transform: scale(1.05); }

.activity-list-pro { display: flex; flex-direction: column; gap: 18px; }

.activity-row { 
  display: flex; justify-content: space-between; align-items: center; padding: 22px 30px; 
  border-radius: 25px; background: rgba(255, 255, 255, 0.5); border: 1px solid rgba(255,255,255,0.8);
  animation: slideIn 0.5s ease forwards; opacity: 0; animation-delay: var(--delay);
}
.activity-row:hover { background: white; transform: scale(1.01); }

.order-main-info { display: flex; align-items: center; gap: 15px; }
.order-avatar { width: 45px; height: 45px; background: #fff7d6; color: #d35400; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
.customer-name { display: block; font-weight: 800; color: #2c3e50; }
.order-id { font-size: 0.8rem; color: #95a5a6; font-family: monospace; }

.order-meta-info { display: flex; align-items: center; gap: 25px; }
.order-amount { font-weight: 900; color: #2c3e50; font-size: 1.1rem; }
.status-badge-mini { padding: 6px 16px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
.status-badge-mini.delivered { background: #e8f5e9; color: #2e7d32; }
.status-badge-mini.pending { background: #fff8e1; color: #f57f17; }

/* انيميشن */
@keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes pulse-orange { 0% { transform: scale(0.9); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.8; } }

/* التجاوب الفائق للموبايل */
@media (max-width: 850px) {
  .page-header-pro { flex-direction: column; text-align: center; gap: 20px; padding: 30px; }
  .header-main { flex-direction: column; }
  .stats-grid-premium { grid-template-columns: 1fr; }
  .activity-row { flex-direction: column; gap: 15px; text-align: center; padding: 25px; }
  .order-main-info { flex-direction: column; }
  .order-meta-info { flex-direction: column; gap: 10px; width: 100%; border-top: 1px solid #eee; padding-top: 15px; }
}

.premium-loader { text-align: center; padding: 80px; }
.honey-pulse { width: 50px; height: 50px; background: #f39c12; border-radius: 50%; margin: 0 auto 20px; animation: pulse-premium 1.5s infinite; }
@keyframes pulse-premium { 0% { transform: scale(0.8); opacity: 1; box-shadow: 0 0 0 0 rgba(243, 156, 18, 0.4); } 100% { transform: scale(1.2); opacity: 0; box-shadow: 0 0 0 20px rgba(243, 156, 18, 0); } }
</style>