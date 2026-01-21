<template>
  <div class="checkout-premium-pro animated-reveal" dir="rtl">
    <div class="honey-ambient-glow"></div>

    <div class="container-pro">
      <header class="checkout-header-glass">
        <div class="header-main-content">
          <div class="icon-sphere">🛒</div>
          <div class="text-info">
            <h1 class="glitter-text">إتمام عملية الشراء</h1>
            <p>أنت على وشك الحصول على أنقى أنواع عسل الزهراء الطبيعي</p>
          </div>
        </div>
      </header>

      <div class="checkout-grid-pro">
        <div class="main-content-area glass-card">
          <div class="section-title">
            <span class="step-badge">1</span>
            <h3>بيانات التوصيل والشحن</h3>
          </div>

          <form @submit.prevent="submitOrder" class="premium-form">
            <div class="input-row">
              <div class="input-group-pro">
                <label>الاسم بالكامل</label>
                <div class="input-wrapper">
                  <input v-model="shippingData.name" type="text" placeholder="اسم المستلم الثلاثي" required />
                </div>
              </div>
              <div class="input-group-pro">
                <label>رقم الهاتف</label>
                <div class="input-wrapper">
                  <input v-model="shippingData.phone" type="tel" placeholder="01xxxxxxxxx" required />
                </div>
              </div>
            </div>

            <div class="input-group-pro">
              <label>العنوان التفصيلي</label>
              <div class="input-wrapper">
                <textarea v-model="shippingData.address" rows="3" placeholder="المحافظة، المنطقة، الشارع، رقم العقار" required></textarea>
              </div>
            </div>

            <div class="payment-selection">
              <label>طريقة الدفع المتاحة</label>
              <div class="payment-card-pro active">
                <div class="check-mark">✔</div>
                <span class="pay-icon">💵</span>
                <div class="pay-text">
                  <strong>الدفع عند الاستلام (COD)</strong>
                  <p>خدمة التوصيل مجانية وسريعة لجميع المحافظات</p>
                </div>
              </div>
            </div>

            <button type="submit" :disabled="loading || cart.items.length === 0" class="btn-order-pro">
              <span v-if="!loading">تأكيد طلب العسل الآن ✨</span>
              <span v-else class="loader-pulse">جاري إرسال طلبك...</span>
            </button>
          </form>
        </div>

        <aside class="sidebar-summary-pro glass-card">
          <div class="section-title">
            <span class="step-badge">2</span>
            <h3>ملخص سلة المشتريات</h3>
          </div>

          <div class="items-list-wrapper">
            <div v-for="item in cart.items" :key="item.id || item._id" class="mini-item-card-pro">
              <div class="item-visual">🍯</div>
              <div class="item-details">
                <span class="i-name">{{ item.name }}</span>
                <span class="i-qty">الكمية: {{ item.quantity }}</span>
              </div>
              <div class="i-price">{{ item.price * item.quantity }} <small>ج.م</small></div>
            </div>
          </div>

          <div class="coupon-container-pro">
            <label>هل لديك رمز خصم؟</label>
            <div class="coupon-field-group">
              <input 
                v-model="couponInput" 
                type="text" 
                placeholder="ادخل الرمز هنا" 
                :disabled="isCouponApplied" 
              />
              <button 
                v-if="isCouponApplied" 
                @click="removeCoupon" 
                type="button" 
                class="btn-remove-coupon" 
                title="إلغاء الخصم"
              >✕</button>
              <button 
                v-else
                @click="applyCoupon" 
                type="button" 
                :disabled="!couponInput"
                class="btn-apply-coupon"
              >تطبيق</button>
            </div>
            <transition name="fade">
              <p v-if="couponError" class="coupon-msg error">{{ couponError }}</p>
              <p v-else-if="isCouponApplied" class="coupon-msg success">تهانينا! تم تفعيل الخصم بنجاح ✨</p>
            </transition>
          </div>

          <div class="invoice-summary-pro">
            <div class="inv-row">
              <span>الإجمالي الفرعي</span>
              <span>{{ cart.subtotal }} ج.م</span>
            </div>
            <div v-if="isCouponApplied" class="inv-row discount-row">
              <span>خصم الكوبون</span>
              <span>-{{ appliedDiscount }} ج.م</span>
            </div>
            <div class="inv-row shipping-row">
              <span>مصاريف التوصيل</span>
              <span class="free-badge">مجاناً 🎉</span>
            </div>
            <div class="inv-total-box">
              <div class="total-label">الإجمالي النهائي</div>
              <div class="total-val">{{ finalTotal }} <small>ج.م</small></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import API from '@/api';
import { useRouter } from 'vue-router';

const cart = useCartStore();
const router = useRouter();
const loading = ref(false);

const shippingData = ref({ name: '', phone: '', address: '' });
const couponInput = ref('');
const couponError = ref('');
const appliedDiscount = ref(0);
const isCouponApplied = ref(false);

// ✅ استعادة حالة الكوبون عند Refresh
onMounted(() => {
  const saved = localStorage.getItem('active_zahra_coupon');
  if (saved) {
    const data = JSON.parse(saved);
    couponInput.value = data.code;
    appliedDiscount.value = data.discount;
    isCouponApplied.value = true;
  }
});

// ✅ حساب الإجمالي الصافي
const finalTotal = computed(() => {
  return Math.max(0, cart.subtotal - appliedDiscount.value);
});

const applyCoupon = async () => {
  couponError.value = '';
  try {
    const res = await API.post('/coupons/validate', { code: couponInput.value });
    const discount = res.data.data.discount;
    appliedDiscount.value = discount;
    isCouponApplied.value = true;
    localStorage.setItem('active_zahra_coupon', JSON.stringify({ code: couponInput.value, discount }));
    alert('تم تطبيق الخصم بنجاح! 🎊');
  } catch (err) {
    couponError.value = err.response?.data?.message || 'كود غير صالح';
  }
};

const removeCoupon = () => {
  appliedDiscount.value = 0;
  isCouponApplied.value = false;
  couponInput.value = '';
  localStorage.removeItem('active_zahra_coupon');
};

const submitOrder = async () => {
  if (cart.items.length === 0) return alert('سلتك فارغة!');
  loading.value = true;
  try {
    const payload = {
      guestName: shippingData.value.name,
      guestPhone: shippingData.value.phone,
      address: shippingData.value.address,
      cartItems: cart.items.map(i => ({
        id: String(i.id || i._id),
        price: Number(i.price),
        quantity: i.quantity
      })),
      couponCode: isCouponApplied.value ? couponInput.value : null
    };

    await API.post('/orders', payload);

    // ✅ التحديث المطلوب: حفظ ملخص الطلب لرسالة الواتساب في صفحة النجاح
    localStorage.setItem('last_order_summary', JSON.stringify({
      accountName: shippingData.value.name,
      productNames: cart.items.map(i => i.name).join(' و '),
      finalPrice: finalTotal.value
    }));

    if (cart.clearCart) cart.clearCart();
    localStorage.removeItem('active_zahra_coupon');
    router.push('/order-success');
  } catch (err) {
    alert(err.response?.data?.message || 'حدث خطأ في إرسال الطلب');
  } finally { loading.value = false; }
};
</script>

<style scoped>
.checkout-premium-pro { padding: 140px 5% 80px; min-height: 100vh; position: relative; background: #fffdf5; overflow: hidden; }

/* توهج خلفية جمالي */
.honey-ambient-glow {
  position: absolute; top: -10%; left: -10%; width: 50%; height: 50%;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.1), transparent 70%);
  pointer-events: none; z-index: 0;
}

.container-pro { max-width: 1300px; margin: 0 auto; position: relative; z-index: 2; }

/* هيدر الصفحة الزجاجي */
.checkout-header-glass {
  padding: 30px 45px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(25px);
  border-radius: 40px; border: 1px solid white; margin-bottom: 45px;
  box-shadow: 0 15px 35px rgba(211, 84, 0, 0.05);
}

.header-main-content { display: flex; align-items: center; gap: 25px; }
.icon-sphere { 
  width: 70px; height: 70px; background: linear-gradient(135deg, #f39c12, #d35400); 
  border-radius: 24px; display: flex; align-items: center; justify-content: center; 
  font-size: 2.2rem; color: white; box-shadow: 0 10px 25px rgba(211, 84, 0, 0.2); 
}

.glitter-text { 
  font-size: 2.2rem; font-weight: 900; 
  background: linear-gradient(45deg, #d35400, #f39c12);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;
}

.checkout-grid-pro { display: grid; grid-template-columns: 1.6fr 1fr; gap: 35px; align-items: start; }

.section-title { display: flex; align-items: center; gap: 15px; margin-bottom: 35px; }
.step-badge { 
  width: 35px; height: 35px; background: #d35400; color: white; 
  border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; 
}

/* فورم البيانات */
.premium-form .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px; }
.input-group-pro { margin-bottom: 25px; text-align: right; }
.input-group-pro label { display: block; margin-bottom: 12px; font-weight: 800; color: #2c3e50; font-size: 0.95rem; }
.input-wrapper input, textarea { 
  width: 100%; padding: 18px 22px; border-radius: 20px; border: 2.5px solid rgba(0,0,0,0.03); 
  background: white; outline: none; transition: 0.3s; font-size: 1rem; box-sizing: border-box;
}
.input-wrapper input:focus { border-color: #f39c12; box-shadow: 0 8px 25px rgba(243, 156, 18, 0.1); transform: translateY(-2px); }

/* كرت الدفع */
.payment-card-pro { 
  display: flex; align-items: center; gap: 25px; padding: 30px; 
  border-radius: 30px; border: 2px solid #f39c12; background: #fffcf5; position: relative; 
}
.check-mark { 
  position: absolute; top: 15px; left: 15px; background: #27ae60; 
  color: white; width: 25px; height: 25px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; font-size: 0.8rem; 
}
.pay-icon { font-size: 2.5rem; }
.pay-text strong { display: block; font-size: 1.2rem; color: #2d3436; margin-bottom: 5px; }
.pay-text p { margin: 0; color: #7f8c8d; font-size: 0.9rem; }

.btn-order-pro { 
  width: 100%; padding: 22px; background: linear-gradient(45deg, #27ae60, #2ecc71); 
  color: white; border: none; border-radius: 25px; font-weight: 900; font-size: 1.3rem; 
  cursor: pointer; margin-top: 40px; transition: 0.4s; box-shadow: 0 15px 30px rgba(39, 174, 96, 0.25); 
}
.btn-order-pro:hover { transform: translateY(-5px); box-shadow: 0 20px 45px rgba(39, 174, 96, 0.35); }

/* تنسيقات الكوبون البريميوم */
.coupon-container-pro { padding: 25px; background: rgba(243, 156, 18, 0.05); border-radius: 30px; border: 1.5px dashed #f39c12; margin: 30px 0; }
.coupon-container-pro label { display: block; font-weight: 800; margin-bottom: 12px; color: #2d3436; font-size: 0.9rem; }
.coupon-field-group { display: flex; gap: 12px; margin-top: 10px; }
.coupon-field-group input { flex: 1; padding: 15px; border-radius: 15px; border: 1.5px solid #ddd; outline: none; }

.btn-apply-coupon { padding: 0 25px; background: #2d3436; color: white; border: none; border-radius: 15px; font-weight: 900; cursor: pointer; transition: 0.3s; }
.btn-remove-coupon { 
  width: 50px; background: #ffebee; color: #c62828; border: 2px solid #ffcdd2; 
  border-radius: 15px; cursor: pointer; font-weight: 900; font-size: 1.2rem; transition: 0.3s; 
}
.btn-remove-coupon:hover { background: #ffcdd2; transform: rotate(90deg); }

.coupon-msg { font-size: 0.85rem; margin-top: 10px; font-weight: 800; }
.error { color: #e74c3c; }
.success { color: #27ae60; }

/* ملخص الفاتورة */
.mini-item-card-pro { 
  display: flex; align-items: center; gap: 15px; padding: 15px 20px; 
  background: rgba(255,255,255,0.4); border-radius: 20px; margin-bottom: 12px; 
}
.item-visual { font-size: 1.5rem; }
.item-details { flex: 1; display: flex; flex-direction: column; text-align: right; }
.i-name { font-weight: 800; color: #2c3e50; }
.i-qty { font-size: 0.8rem; color: #95a5a6; }
.i-price { font-weight: 900; color: #d35400; }

.invoice-summary-pro { margin-top: 30px; padding-top: 25px; border-top: 2px dashed #eee; }
.inv-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: 700; color: #636e72; }
.discount-row { color: #e74c3c; }
.free-badge { background: #27ae60; color: white; padding: 4px 15px; border-radius: 50px; font-size: 0.75rem; }

.inv-total-box { 
  margin-top: 30px; padding: 25px 30px; background: #2d3436; 
  border-radius: 30px; color: white; display: flex; justify-content: space-between; align-items: center; 
}
.total-val { font-size: 2.2rem; font-weight: 900; color: #f1c40f; }

@media (max-width: 1000px) { 
  .checkout-grid-pro { grid-template-columns: 1fr; } 
  .premium-form .input-row { grid-template-columns: 1fr; }
  .checkout-header-glass { padding: 25px; }
}
</style>