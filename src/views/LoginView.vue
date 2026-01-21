<template>
  <div class="auth-container" dir="rtl">
    <div class="auth-card animated-up">
      <div class="auth-header">
        <span class="auth-icon">🔐</span>
        <h2>مرحباً بعودتك!</h2>
        <p>سجل دخولك لتستمتع بأجود أنواع العسل</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>البريد الإلكتروني</label>
          <input v-model="form.email" type="email" placeholder="example@mail.com" required />
        </div>

        <div class="input-group">
          <label>كلمة المرور</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="!loading">دخول آمن 🍯</span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <p v-if="error" class="error-box">{{ error }}</p>

      <div class="auth-footer">
        <span>ليس لديك حساب؟</span>
        <router-link to="/signup">انضم إلينا الآن</router-link>
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
const form = ref({ email: '', password: '' });

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  const result = await auth.login(form.value);
  if (result.success) {
    router.push('/shop');
  } else {
    error.value = result.message;
  }
  loading.value = false;
};
</script>

<style scoped>
.auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
.auth-card {
  background: white; padding: 40px; border-radius: 30px;
  width: 100%; max-width: 420px; box-shadow: 0 20px 50px rgba(243, 156, 18, 0.1);
  border: 1px solid rgba(243, 156, 18, 0.1); text-align: center;
}
.animated-up { animation: fadeInUp 0.8s ease-out; }

.auth-header h2 { color: #2d3436; margin: 10px 0; }
.auth-header p { color: #636e72; font-size: 0.9rem; margin-bottom: 30px; }
.auth-icon { font-size: 3rem; display: block; }

.input-group { text-align: right; margin-bottom: 20px; }
.input-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #d35400; font-size: 0.85rem; }
.input-group input {
  width: 100%; padding: 14px; border-radius: 15px; border: 1px solid #eee;
  background: #fdfdfd; outline: none; transition: 0.3s; box-sizing: border-box;
}
.input-group input:focus { border-color: #f39c12; background: white; box-shadow: 0 0 10px rgba(243, 156, 18, 0.1); }

.submit-btn {
  width: 100%; padding: 15px; background: #f39c12; color: white;
  border: none; border-radius: 15px; font-weight: bold; cursor: pointer;
  transition: 0.3s; font-size: 1rem; margin-top: 10px;
}
.submit-btn:hover { background: #e67e22; transform: scale(1.02); box-shadow: 0 10px 20px rgba(230, 126, 34, 0.2); }

.error-box { background: #fff2f2; color: #e74c3c; padding: 12px; border-radius: 10px; font-size: 0.8rem; margin-top: 20px; }
.auth-footer { margin-top: 25px; font-size: 0.9rem; color: #636e72; }
.auth-footer a { color: #f39c12; text-decoration: none; font-weight: bold; margin-right: 5px; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>