<template>
  <div class="success-premium-pro animated-reveal" dir="rtl">
    <div class="honey-ambient-glow"></div>
    <div class="honey-ambient-glow secondary"></div>

    <div class="success-container-pro">
      <div class="glass-card-success-pro">
        <div class="success-visual-box">
          <div class="success-icon-main">✔</div>
          <div class="ripple-rings">
            <span class="ring"></span>
            <span class="ring"></span>
            <span class="ring"></span>
          </div>
        </div>

        <div class="text-header-pro">
          <h1 class="glitter-text">تم تسجيل طلبك الملكي! 🍯</h1>
          <p class="subtitle">شكراً لاختيارك متجر الزهراء، طلبك الآن في أيدٍ أمينة وسنتواصل معك قريباً.</p>
        </div>

        <div class="order-preview-card glass-card">
          <div class="preview-header">ملخص تأكيد الطلب</div>
          <div class="preview-body">
            <div class="preview-row">
              <span class="label">صاحب الطلب:</span>
              <span class="val">{{ orderData.accountName }}</span>
            </div>
            <div class="preview-row">
              <span class="label">المنتجات:</span>
              <span class="val">{{ orderData.productNames }}</span>
            </div>
            <div class="preview-divider"></div>
            <div class="preview-row total">
              <span class="label">الإجمالي النهائي:</span>
              <span class="val">{{ orderData.finalPrice }} ج.م</span>
            </div>
          </div>
        </div>

        <div class="action-grid-pro">
          <a :href="whatsappLink" target="_blank" class="btn-whatsapp-pro">
            <span class="btn-icon">💬</span>
            <div class="btn-text">
              <strong>تأكيد الطلب عبر واتساب</strong>
            </div>
          </a>

          <button @click="router.push('/')" class="btn-back-home-pro">
            <span class="btn-icon">🏠</span>
            <span>العودة للرئيسية</span>
          </button>
        </div>

        <div class="footer-note-pro">
          <span class="support-text">لأي استفسار، تواصل معنا مباشرة:</span>
          <span class="phone-link">01011857244</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); //

const orderData = ref({
  accountName: 'عميل المتجر',
  productNames: 'منتجات عسل',
  finalPrice: 0
});

onMounted(() => {
  // الحفاظ على الوظيفة الأصلية بجلب البيانات من localStorage
  const savedData = localStorage.getItem('last_order_summary');
  if (savedData) {
    orderData.value = JSON.parse(savedData);
  }
});

// ✅ بناء رابط الواتساب الديناميكي بنفس الرسالة المطلوبة
const whatsappLink = computed(() => {
  const phone = "201011857244";
  const { accountName, productNames, finalPrice } = orderData.value;
  
  const message = `مرحبا انا "${accountName}" اود شراء "${productNames}" الذي سعره "${finalPrice} ج.م"`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
});
</script>

<style scoped>
/* التنسيق البريميوم الاحترافي المطور */
.success-premium-pro {
  padding: 120px 5% 80px;
  min-height: 100vh;
  position: relative;
  background: #fffdf5;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.honey-ambient-glow {
  position: absolute; top: 20%; left: 10%; width: 40%; height: 40%;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.1) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}
.honey-ambient-glow.secondary { top: 60%; left: 60%; width: 35%; height: 35%; background: radial-gradient(circle, rgba(211, 84, 0, 0.08) 0%, transparent 70%); }

.success-container-pro { max-width: 750px; width: 100%; position: relative; z-index: 2; }

.glass-card-success-pro {
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(30px);
  padding: 60px 45px; border-radius: 50px; text-align: center;
  border: 1px solid white; box-shadow: 0 30px 70px rgba(211, 84, 0, 0.1);
}

/* الأيقونة والأنيميشن */
.success-visual-box { width: 100px; height: 100px; margin: 0 auto 35px; position: relative; }
.success-icon-main {
  width: 100%; height: 100%; background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white; font-size: 3.5rem; border-radius: 35px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 15px 35px rgba(39, 174, 96, 0.3); position: relative; z-index: 5;
}

.ripple-rings .ring {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 35px;
  background: rgba(39, 174, 96, 0.2); animation: ripple 3s infinite; opacity: 0;
}
.ripple-rings .ring:nth-child(2) { animation-delay: 1s; }
.ripple-rings .ring:nth-child(3) { animation-delay: 2s; }

@keyframes ripple {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

.glitter-text {
  font-size: 2.5rem; font-weight: 900;
  background: linear-gradient(45deg, #d35400, #f39c12);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
}

.subtitle { color: #7f8c8d; font-size: 1.15rem; line-height: 1.8; margin-bottom: 40px; }

/* بطاقة المعاينة */
.order-preview-card {
  background: rgba(255, 255, 255, 0.5); border-radius: 30px; border: 1px solid white;
  padding: 25px; margin-bottom: 40px; text-align: right;
}
.preview-header { font-weight: 800; color: #d35400; margin-bottom: 20px; font-size: 1rem; border-bottom: 1.5px dashed rgba(243, 156, 18, 0.2); padding-bottom: 10px; }
.preview-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
.preview-row .label { color: #95a5a6; font-weight: 700; font-size: 0.9rem; }
.preview-row .val { color: #2d3436; font-weight: 800; font-size: 0.95rem; }
.preview-divider { height: 1px; background: #eee; margin: 15px 0; }
.preview-row.total .val { color: #27ae60; font-size: 1.25rem; }

/* الأزرار */
.action-grid-pro { display: flex; flex-direction: column; gap: 20px; max-width: 450px; margin: 0 auto; }

.btn-whatsapp-pro {
  display: flex; align-items: center; justify-content: center; gap: 20px;
  padding: 22px; background: #25d366; color: white; text-decoration: none;
  border-radius: 25px; transition: 0.4s; box-shadow: 0 12px 30px rgba(37, 211, 102, 0.25);
}
.btn-whatsapp-pro:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 15px 40px rgba(37, 211, 102, 0.35); }
.btn-whatsapp-pro .btn-icon { font-size: 2.2rem; }
.btn-text { text-align: right; }
.btn-text strong { display: block; font-size: 1.2rem; }
.btn-text small { opacity: 0.9; font-size: 0.85rem; font-weight: 600; }

.btn-back-home-pro {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  padding: 18px; background: #2d3436; color: white; border: none;
  border-radius: 25px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.4s;
}
.btn-back-home-pro:hover { background: #000; transform: translateY(-5px); }

.footer-note-pro {
  margin-top: 45px; padding-top: 25px; border-top: 1px solid #eee;
  display: flex; flex-direction: column; gap: 8px;
}
.support-text { color: #95a5a6; font-size: 0.9rem; font-weight: 700; }
.phone-link { color: #d35400; font-size: 1.2rem; font-weight: 900; }

.animated-reveal { animation: revealUp 1s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 600px) {
  .glass-card-success-pro { padding: 45px 25px; }
  .glitter-text { font-size: 2rem; }
  .btn-text strong { font-size: 1.05rem; }
}
</style>