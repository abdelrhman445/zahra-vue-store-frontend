<template>
  <div class="admin-orders-premium animated-reveal" dir="rtl">
    <div class="honey-ambient-glow"></div>

    <div class="container-pro">
      <header class="page-header-pro glass-card">
        <div class="header-main">
          <div class="icon-sphere">📦</div>
          <div class="title-text">
            <h1 class="glitter-text">إدارة طلبات المتجر</h1>
            <p>متابعة وتحديث حالات شحن عسل الزهراء</p>
          </div>
        </div>
      </header>

      <div v-if="loading" class="premium-loader">
        <div class="honey-pulse"></div>
        <p>جاري مزامنة سجل الطلبات...</p>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state-pro glass-card">
        <div class="empty-icon">🍯</div>
        <p>لا توجد طلبات مسجلة في النظام حالياً.</p>
      </div>

      <div v-else class="orders-display-wrapper">
        
        <div class="desktop-table-view glass-card">
          <table class="premium-table">
            <thead>
              <tr>
                <th>الطلب والعميل</th>
                <th>تفاصيل التوصيل</th>
                <th>المنتجات</th>
                <th>الإجمالي</th>
                <th class="text-center">حالة الطلب</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id || order._id" class="order-row">
                <td>
                  <div class="order-cell-info">
                    <div class="order-avatar">{{ (order.guestName || order.user?.name || 'U').charAt(0) }}</div>
                    <div class="name-id">
                      <span class="customer-name">{{ order.guestName || order.user?.name }}</span>
                      <span class="order-tag">#{{ (order.id || order._id)?.toString().slice(-6) }}</span>
                    </div>
                  </div>
                </td>
                
                <td class="delivery-cell">
                  <div class="info-item"><i class="icon">📍</i> {{ order.address || order.shippingAddress }}</div>
                  <div class="info-item"><i class="icon">📞</i> {{ order.guestPhone || order.phoneNumber }}</div>
                </td>

                <td>
                  <div class="items-summary">
                    <span v-for="item in (order.cartItems || order.items)" :key="item.id" class="mini-tag">
                      {{ item.product?.name || 'منتج' }} (x{{ item.quantity }})
                    </span>
                  </div>
                </td>

                <td class="amount-cell">
                  <span class="total-price">{{ order.totalAmount }} <small>ج.م</small></span>
                </td>

                <td class="status-cell">
                  <select
                    @change="updateStatus(order.id || order._id, $event.target.value)"
                    :value="normalizeStatus(order.status)"
                    class="premium-status-select"
                  >
                    <option value="PENDING_PAYMENT">⏳ قيد المراجعة</option>
                    <option value="SHIPPED">🚚 تم الشحن</option>
                    <option value="DELIVERED">✅ تم التوصيل</option>
                    <option value="CANCELLED">❌ ملغي</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mobile-cards-view">
          <div v-for="order in orders" :key="'mob-' + (order.id || order._id)" class="order-mobile-card glass-card">
            <div class="card-header">
              <div class="header-left">
                <span class="mob-id">#{{ (order.id || order._id)?.toString().slice(-6) }}</span>
                <h3>{{ order.guestName || order.user?.name }}</h3>
              </div>
              <div :class="['mob-status-badge', normalizeStatus(order.status).toLowerCase()]">
                {{ getStatusText(order.status) }}
              </div>
            </div>

            <div class="card-body-pro">
              <div class="info-group">
                <label>📍 العنوان:</label>
                <p>{{ order.address || order.shippingAddress }}</p>
              </div>
              <div class="info-group">
                <label>📞 الهاتف:</label>
                <p>{{ order.guestPhone || order.phoneNumber }}</p>
              </div>
              <div class="info-group items">
                <label>🛒 الأصناف:</label>
                <div class="mob-items-list">
                  <div v-for="item in (order.cartItems || order.items)" :key="item.id" class="mob-item">
                    {{ item.product?.name }} <span class="q">x{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer-pro">
              <div class="total-wrap">
                <span>الإجمالي:</span>
                <span class="price">{{ order.totalAmount }} ج.م</span>
              </div>
              <select
                @change="updateStatus(order.id || order._id, $event.target.value)"
                :value="normalizeStatus(order.status)"
                class="mob-select"
              >
                <option value="PENDING_PAYMENT">قيد المراجعة</option>
                <option value="SHIPPED">تم الشحن</option>
                <option value="DELIVERED">تم التوصيل</option>
                <option value="CANCELLED">ملغي</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import API from '@/api';

// الحفاظ على المنطق البرمجي الأصلي
const orders = ref([]);
const loading = ref(true);

const normalizeStatus = (status) => {
  const s = String(status || '').trim().toUpperCase();
  if (s === 'PAID') return 'DELIVERED';
  if (s === 'PENDING') return 'PENDING_PAYMENT';
  return s;
};

const getStatusText = (status) => {
  const s = normalizeStatus(status);
  const map = { 'PENDING_PAYMENT': 'قيد المراجعة', 'SHIPPED': 'تم الشحن', 'DELIVERED': 'تم التوصيل', 'CANCELLED': 'ملغي' };
  return map[s] || s;
};

const fetchAllOrders = async () => {
  loading.value = true;
  try {
    const res = await API.get('/admin/orders');
    orders.value = res.data.data?.orders || res.data.data || [];
  } catch (err) {
    console.error("Error fetching orders:", err);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (orderId, newStatus) => {
  if (!orderId) return alert('خطأ: معرف الطلب مفقود');
  try {
    await API.patch(`/admin/orders/${Number(orderId)}/status`, { status: newStatus });
    alert('تم تحديث حالة الطلب بنجاح! ✅');
    fetchAllOrders();
  } catch (err) {
    alert('فشل التحديث: ' + (err.response?.data?.message || 'خطأ في التنسيق'));
  }
};

onMounted(fetchAllOrders);
</script>

<style scoped>
.admin-orders-premium { padding: 40px 5% 100px; background: #fffdf5; min-height: 100vh; position: relative; overflow: hidden; }

/* توهج خلفية جمالي */
.honey-ambient-glow {
  position: absolute; top: -15%; left: -10%; width: 50%; height: 50%;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.12), transparent 70%);
  pointer-events: none; z-index: 0;
}

.container-pro { max-width: 1300px; margin: 0 auto; position: relative; z-index: 1; }

/* هيدر الصفحة */
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

/* تنسيق الجدول (Desktop) */
.desktop-table-view { border-radius: 40px; overflow: hidden; border: 1px solid white; box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
.premium-table { width: 100%; border-collapse: collapse; text-align: right; }
.premium-table th { padding: 25px; background: rgba(243, 156, 18, 0.04); color: #d35400; font-weight: 800; font-size: 0.9rem; }
.premium-table td { padding: 20px 25px; border-bottom: 1px solid rgba(0,0,0,0.03); vertical-align: middle; }

.order-cell-info { display: flex; align-items: center; gap: 15px; }
.order-avatar { width: 45px; height: 45px; background: #fff7d6; color: #d35400; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
.customer-name { display: block; font-weight: 800; color: #2d3436; }
.order-tag { font-size: 0.75rem; color: #95a5a6; font-family: monospace; }

.delivery-cell { font-size: 0.85rem; color: #636e72; line-height: 1.6; }
.mini-tag { display: inline-block; background: #f8f9fa; padding: 4px 10px; border-radius: 8px; margin: 2px; font-size: 0.75rem; color: #2d3436; border: 1px solid #eee; }
.total-price { font-weight: 900; color: #d35400; font-size: 1.2rem; }

.premium-status-select { 
  width: 100%; padding: 10px; border-radius: 12px; border: 1.5px solid #eee; 
  background: white; font-weight: bold; cursor: pointer; outline: none; transition: 0.3s;
}
.premium-status-select:focus { border-color: #f39c12; box-shadow: 0 0 10px rgba(243, 156, 18, 0.1); }

/* ✨ تصميم الموبايل الخارق ✨ */
.mobile-cards-view { display: none; flex-direction: column; gap: 20px; }

@media (max-width: 1100px) {
  .desktop-table-view { display: none; }
  .mobile-cards-view { display: flex; }
  
  .order-mobile-card {
    padding: 25px; border-radius: 35px; border: 1px solid white;
    background: rgba(255, 255, 255, 0.9); position: relative;
  }
  .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px dashed #eee; padding-bottom: 15px; }
  .header-left h3 { margin: 5px 0 0; color: #2d3436; font-size: 1.2rem; }
  .mob-id { font-size: 0.7rem; color: #95a5a6; font-family: monospace; font-weight: bold; background: #f5f5f5; padding: 2px 8px; border-radius: 5px; }
  
  .mob-status-badge { padding: 5px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: 900; }
  .mob-status-badge.delivered { background: #e8f5e9; color: #2e7d32; }
  .mob-status-badge.pending_payment { background: #fff8e1; color: #f57f17; }
  
  .card-body-pro .info-group { margin-bottom: 15px; }
  .info-group label { display: block; font-size: 0.75rem; color: #95a5a6; font-weight: 800; margin-bottom: 4px; }
  .info-group p { margin: 0; font-size: 0.9rem; color: #2c3e50; font-weight: 600; }
  
  .mob-items-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
  .mob-item { background: rgba(243, 156, 18, 0.05); padding: 5px 12px; border-radius: 10px; font-size: 0.8rem; color: #d35400; font-weight: bold; border: 1px solid rgba(243, 156, 18, 0.1); }
  
  .card-footer-pro { display: flex; flex-direction: column; gap: 15px; margin-top: 10px; padding-top: 15px; border-top: 1px solid #eee; }
  .total-wrap { display: flex; justify-content: space-between; align-items: center; }
  .total-wrap span { font-weight: 800; color: #7f8c8d; }
  .total-wrap .price { font-size: 1.4rem; color: #d35400; font-weight: 900; }
  
  .mob-select { padding: 15px; border-radius: 18px; border: 1.5px solid #f39c12; background: #fffcf5; font-weight: 900; font-size: 0.9rem; color: #d35400; width: 100%; cursor: pointer; }
}

.premium-loader { text-align: center; padding: 80px; }
.honey-pulse { width: 50px; height: 50px; background: #f39c12; border-radius: 50%; margin: 0 auto 20px; animation: pulse-premium 1.5s infinite; }
@keyframes pulse-premium { 0% { transform: scale(0.8); opacity: 1; box-shadow: 0 0 0 0 rgba(243, 156, 18, 0.4); } 100% { transform: scale(1.2); opacity: 0; box-shadow: 0 0 0 20px rgba(243, 156, 18, 0); } }

.empty-state-pro { text-align: center; padding: 60px; border-radius: 40px; border: 1px solid white; }
.empty-icon { font-size: 4rem; margin-bottom: 20px; }
</style>