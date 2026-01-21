<template>
  <div class="auth-wrapper" dir="rtl">
    <div class="decorative-blob"></div>

    <div class="auth-card animated-reveal">
      <div class="auth-header">
        <div class="icon-circle">
          <span class="main-icon">🐝</span>
        </div>
        <h2>انضم لمملكة الزهراء</h2>
        <p>أنشئ حسابك الآن واستمتع برحلة تسوق فريدة</p>
      </div>

      <form @submit.prevent="handleSignup" class="modern-form">
        <div class="form-row">
          <div class="input-field">
            <label>الاسم بالكامل</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input v-model="form.name" type="text" placeholder="" required />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="input-field">
            <label>البريد الإلكتروني</label>
            <div class="input-wrapper">
              <span class="input-icon">✉️</span>
              <input v-model="form.email" type="email" placeholder="" required />
            </div>
          </div>
        </div>

        <div class="form-grid">
          <div class="input-field">
            <label>كلمة المرور</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input v-model="form.password" type="password" placeholder="••••••••" required />
            </div>
          </div>
          <div class="input-field">
            <label>تأكيد الكلمة</label>
            <div class="input-wrapper">
              <span class="input-icon">✅</span>
              <input v-model="form.passwordConfirm" type="password" placeholder="••••••••" required />
            </div>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary-glow">
          <span v-if="!loading">إنشاء الحساب الآن ✨</span>
          <div v-else class="spinner"></div>
        </button>
      </form>

      <transition name="fade">
        <p v-if="error" class="error-notice">{{ error }}</p>
      </transition>

      <div class="auth-footer-links">
        <span>لديك حساب بالفعل؟</span>
        <router-link to="/login" class="link-highlight">تسجيل الدخول</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const loading = ref(false);
const error = ref('');
const form = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

const handleSignup = async () => {
  // نفس وظيفة الكود الأصلية: تحقق من تطابق كلمة المرور
  if (form.value.password !== form.value.passwordConfirm) {
    error.value = 'عذراً، كلمات المرور غير متطابقة ❌';
    return;
  }

  // حماية إضافية: لو signup مش موجود في الـ store (عشان كان بيعمل crash)
  if (typeof auth.signup !== 'function') {
    error.value =
      'في مشكلة في Auth Store: الدالة signup غير موجودة. تأكد إنك ضايفها في Pinia Store واعمل Restart للسيرفر.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // نفس وظيفة الكود الأصلية: ينادي signup ويحوّل /shop عند النجاح
    const payload = {
      ...form.value,
      name: form.value.name?.trim(),
      email: form.value.email?.trim(),
    };

    const result = await auth.signup(payload);

    if (result?.success) {
      router.push('/shop');
    } else {
      error.value = result?.message || 'فشل إنشاء الحساب، حاول مرة أخرى.';
    }
  } catch (e) {
    // يمنع Unhandled error
    error.value = 'حصل خطأ غير متوقع أثناء إنشاء الحساب.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-wrapper {
  display: flex; justify-content: center; align-items: center;
  min-height: 90vh; position: relative; padding: 20px; overflow: hidden;
}

/* الدائرة المتحركة خلف الكارت لزيادة الجمالية */
.decorative-blob {
  position: absolute; width: 400px; height: 400px;
  background: linear-gradient(135deg, rgba(243, 156, 18, 0.2), rgba(211, 84, 0, 0.1));
  filter: blur(80px); border-radius: 50%; z-index: 1;
  animation: moveBlob 10s infinite alternate;
}

@keyframes moveBlob {
  from { transform: translate(-10%, -10%); }
  to { transform: translate(10%, 10%); }
}

.auth-card {
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px);
  padding: 45px; border-radius: 40px; width: 100%; max-width: 500px;
  box-shadow: 0 25px 50px rgba(211, 84, 0, 0.1); border: 1px solid white;
  z-index: 2; position: relative; text-align: center;
}

.animated-reveal { animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

.icon-circle {
  width: 80px; height: 80px; background: #fffdf5; margin: 0 auto 20px;
  border-radius: 25px; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 20px rgba(243, 156, 18, 0.1);
}
.main-icon { font-size: 2.5rem; animation: hoverBee 3s infinite ease-in-out; }

.auth-header h2 { color: #2d3436; margin: 0 0 10px; font-size: 1.8rem; }
.auth-header p { color: #636e72; font-size: 0.95rem; margin-bottom: 35px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.input-field { text-align: right; margin-bottom: 20px; }
.input-field label { display: block; margin-bottom: 10px; font-weight: 600; color: #d35400; font-size: 0.85rem; }

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; right: 15px; font-size: 1.1rem; }

.input-wrapper input {
  width: 100%; padding: 15px 45px 15px 15px; border-radius: 18px;
  border: 1.5px solid #f1f1f1; background: #fafafa; outline: none;
  transition: all 0.3s ease; box-sizing: border-box; font-family: inherit;
}
.input-wrapper input:focus {
  border-color: #f39c12; background: white;
  box-shadow: 0 0 15px rgba(243, 156, 18, 0.15);
}

.btn-primary-glow {
  width: 100%; padding: 18px; background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white; border: none; border-radius: 20px; font-weight: bold;
  cursor: pointer; font-size: 1.1rem; margin-top: 15px;
  box-shadow: 0 10px 25px rgba(243, 156, 18, 0.4); transition: all 0.3s ease;
}
.btn-primary-glow:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(243, 156, 18, 0.5); }

.error-notice {
  background: #fff0f0; color: #d63031; padding: 12px; border-radius: 12px;
  font-size: 0.85rem; margin-top: 20px; border-right: 4px solid #d63031;
}

.auth-footer-links { margin-top: 30px; color: #636e72; font-size: 0.9rem; }
.link-highlight { color: #f39c12; text-decoration: none; font-weight: 800; margin-right: 8px; }

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes hoverBee {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  50% { transform: rotate(10deg) translateY(-5px); }
}

@media (max-width: 500px) {
  .form-grid { grid-template-columns: 1fr; gap: 0; }
  .auth-card { padding: 30px 20px; }
}
</style>
