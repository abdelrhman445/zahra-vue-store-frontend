<template>
  <div class="admin-coupons-premium animated-reveal" dir="rtl">
    <div class="honey-ambient-glow"></div>

    <div class="container-pro">
      <header class="page-header-pro glass-card">
        <div class="header-main">
          <div class="icon-sphere">🎁</div>
          <div class="title-text">
            <h1 class="glitter-text">إدارة كوبونات الخصم</h1>
            <p>أنشئ عروضاً حصرية لزيادة مبيعات مملكة الزهراء</p>
          </div>
        </div>
      </header>

      <div class="coupons-main-grid">
        <div class="create-section-glass glass-card">
          <div class="section-title">
            <span class="step-icon">✨</span>
            <h3>إنشاء كود خصم جديد</h3>
          </div>

          <form @submit.prevent="handleCreateCoupon" class="premium-form">
            <div class="input-group-pro">
              <label>رمز الكوبون المميز</label>
              <input 
                v-model.trim="newCoupon.code" 
                type="text" 
                placeholder=" " 
                required 
              />
            </div>

            <div class="input-row">
              <div class="input-group-pro">
                <label>قيمة الخصم (ج.م)</label>
                <input 
                  v-model.number="newCoupon.discount" 
                  type="number" 
                  placeholder="0" 
                  required 
                />
              </div>

              <div class="input-group-pro">
                <label>تاريخ الانتهاء</label>
                <input 
                  v-model="newCoupon.expiryDate" 
                  type="date" 
                  required 
                />
              </div>
            </div>

            <button type="submit" class="btn-activate-pro" :disabled="loading">
              <span v-if="!loading">تفعيل الكوبون الآن 🚀</span>
              <span v-else class="loader-pulse">جاري الإنشاء...</span>
            </button>
          </form>
        </div>

        <div class="list-section-glass glass-card">
          <div class="section-title">
            <span class="step-icon">📋</span>
            <h3>الكوبونات النشطة حالياً</h3>
          </div>

          <div v-if="fetching" class="premium-loader">
            <div class="honey-spinner"></div>
            <p>جاري مزامنة الكوبونات...</p>
          </div>

          <div v-else class="coupons-items-wrapper">
            <transition-group name="list-fade">
              <div v-for="(coupon, index) in coupons" 
                   :key="coupon.id" 
                   class="coupon-card-pro glass-card"
                   :style="{ '--delay': index * 0.1 + 's' }">
                
                <div class="coupon-visual">
                  <div class="coupon-tag">
                    <span class="c-code">{{ coupon.code }}</span>
                    <span class="c-discount">{{ coupon.discount }} ج.م</span>
                  </div>
                </div>

                <div class="coupon-details">
                  <div class="expiry-info">
                    <span class="clock">📅</span>
                    <span class="date">ينتهي في: {{ formatDate(coupon.expiryDate) }}</span>
                  </div>
                  <button @click="deleteCoupon(coupon.id)" class="btn-delete-pro" title="حذف الكوبون">
                    <span class="trash-icon">🗑️</span>
                  </button>
                </div>
              </div>
            </transition-group>

            <div v-if="coupons.length === 0" class="empty-state-pro">
              <div class="empty-icon">🍯</div>
              <p>لا توجد كوبونات نشطة حالياً. ابدأ بإنشاء أول عرض!</p>
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
const coupons = ref([]);
const loading = ref(false);
const fetching = ref(true);

const newCoupon = ref({ code: '', discount: null, expiryDate: '' });

const fetchCoupons = async () => {
  fetching.value = true;
  try {
    const res = await API.get('/coupons');
    coupons.value = res.data?.data || [];
  } catch (err) {
    console.error(err);
    alert('خطأ في جلب الكوبونات');
  } finally {
    fetching.value = false;
  }
};

const handleCreateCoupon = async () => {
  loading.value = true;
  try {
    await API.post('/coupons', newCoupon.value);
    alert('تم إنشاء الكوبون بنجاح! 🎁');
    newCoupon.value = { code: '', discount: null, expiryDate: '' };
    await fetchCoupons();
  } catch (err) {
    alert(err.response?.data?.message || 'خطأ في الإنشاء');
  } finally {
    loading.value = false;
  }
};

const deleteCoupon = async (id) => {
  if (!confirm('هل تريد حذف هذا الكوبون نهائياً؟')) return;
  try {
    await API.delete(`/coupons/${id}`);
    await fetchCoupons();
  } catch (err) {
    alert('فشل الحذف');
  }
};

const formatDate = (date) => new Date(date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

onMounted(fetchCoupons);
</script>

<style scoped>
/* التنسيق البريميوم المطور */
.admin-coupons-premium { padding: 40px 5% 100px; background: #fffdf5; min-height: 100vh; position: relative; overflow: hidden; }

.honey-ambient-glow {
  position: absolute; top: -15%; left: -10%; width: 50%; height: 50%;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.12), transparent 70%);
  pointer-events: none; z-index: 0;
}

.container-pro { max-width: 1250px; margin: 0 auto; position: relative; z-index: 1; }

/* هيدر الصفحة الفخم */
.page-header-pro { 
  display: flex; align-items: center; gap: 20px;
  padding: 30px 40px; border-radius: 35px; border: 1px solid white; margin-bottom: 40px;
}
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

/* شبكة التقسيم */
.coupons-main-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; align-items: start; }

.section-title { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; border-bottom: 1.5px solid rgba(243, 156, 18, 0.1); padding-bottom: 15px; }
.step-icon { font-size: 1.4rem; }
.section-title h3 { margin: 0; color: #2c3e50; font-weight: 800; }

/* فورم الإدخال */
.premium-form .input-group-pro { margin-bottom: 22px; text-align: right; }
.premium-form label { display: block; margin-bottom: 10px; font-weight: 700; color: #7f8c8d; font-size: 0.9rem; }
.premium-form input { 
  width: 100%; padding: 16px 20px; border-radius: 18px; border: 2px solid rgba(0,0,0,0.03); 
  background: rgba(255, 255, 255, 0.9); outline: none; transition: 0.3s; font-size: 1rem; box-sizing: border-box;
}
.premium-form input:focus { border-color: #f39c12; box-shadow: 0 8px 20px rgba(243, 156, 18, 0.12); transform: translateY(-2px); }

.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

.btn-activate-pro { 
  width: 100%; padding: 18px; background: linear-gradient(45deg, #27ae60, #2ecc71); 
  color: white; border: none; border-radius: 20px; font-weight: 800; font-size: 1.1rem; 
  cursor: pointer; transition: 0.4s; box-shadow: 0 10px 20px rgba(39, 174, 96, 0.2); 
}
.btn-activate-pro:hover:not(:disabled) { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(39, 174, 96, 0.3); }

/* قائمة الكوبونات */
.coupons-items-wrapper { display: flex; flex-direction: column; gap: 15px; }

.coupon-card-pro { 
  display: flex; justify-content: space-between; align-items: center; padding: 25px;
  border-radius: 25px; border: 1px solid white; background: rgba(255, 255, 255, 0.5);
  animation: slideIn 0.5s ease forwards; opacity: 0; animation-delay: var(--delay);
}
.coupon-card-pro:hover { background: white; transform: scale(1.02); }

.coupon-tag { display: flex; flex-direction: column; gap: 5px; }
.c-code { font-size: 1.4rem; font-weight: 900; color: #d35400; text-transform: uppercase; }
.c-discount { font-weight: 800; color: #27ae60; font-size: 1.1rem; }

.coupon-details { display: flex; align-items: center; gap: 20px; }
.expiry-info { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #7f8c8d; font-weight: 600; }

.btn-delete-pro { 
  width: 45px; height: 45px; background: #ffebee; color: #c62828; 
  border: none; border-radius: 12px; cursor: pointer; transition: 0.3s;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
}
.btn-delete-pro:hover { background: #ffcdd2; transform: rotate(10deg); }

/* الحالات الخاصة */
.premium-loader { text-align: center; padding: 40px; }
.honey-spinner { 
  width: 40px; height: 40px; border: 3px solid rgba(243, 156, 18, 0.1); 
  border-top: 3px solid #f39c12; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; 
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state-pro { text-align: center; padding: 40px; }
.empty-icon { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; }

@keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* التجاوب */
@media (max-width: 1024px) {
  .coupons-main-grid { grid-template-columns: 1fr; }
  .page-header-pro { flex-direction: column; text-align: center; }
  .input-row { grid-template-columns: 1fr; }
}
</style>