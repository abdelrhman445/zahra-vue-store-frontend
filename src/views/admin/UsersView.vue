<template>
  <div class="admin-users-premium animated-reveal" dir="rtl">
    <div class="honey-ambient-glow"></div>

    <div class="container-pro">
      <header class="page-header-pro glass-card">
        <div class="header-main">
          <div class="icon-sphere">👥</div>
          <div class="title-text">
            <h1>أعضاء المملكة</h1>
            <p>إدارة <span class="count">{{ users.length }}</span> حساب نشط حالياً</p>
          </div>
        </div>
      </header>

      <div v-if="loading" class="premium-loader">
        <div class="honey-pulse"></div>
        <p>جاري مزامنة بيانات الأعضاء...</p>
      </div>

      <div v-else class="users-display-wrapper">
        <div class="desktop-table-view glass-card">
          <table class="premium-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>البريد الإلكتروني</th>
                <th>الصلاحية</th>
                <th class="text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id || user._id" class="user-row">
                <td>
                  <div class="user-info-cell">
                    <div class="avatar-box">{{ user.name?.charAt(0).toUpperCase() }}</div>
                    <div class="name-id">
                      <span class="u-name">{{ user.name }}</span>
                      <span class="u-id">#{{ (user.id || user._id)?.toString().slice(-4) }}</span>
                    </div>
                  </div>
                </td>
                <td class="u-email">{{ user.email }}</td>
                <td>
                  <span :class="['role-pill', user.role?.toLowerCase()]">
                    {{ user.role === 'ADMIN' ? 'مدير ملكي' : 'عميل المتجر' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <div class="btn-group-pro">
                    <button v-if="user.role !== 'ADMIN'" @click="setRole(user.id || user._id, 'ADMIN')" class="btn-action upgrade">👑 ترقية</button>
                    <button v-if="user.role === 'ADMIN'" @click="setRole(user.id || user._id, 'CUSTOMER')" class="btn-action downgrade">⬇️ تنزيل</button>
                    <button @click="toggleBan(user.id || user._id)" :class="['btn-action', user.isBanned ? 'unban' : 'ban']">
                      {{ user.isBanned ? '✅ فك الحظر' : '🚫 حظر' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mobile-cards-view">
          <div v-for="user in users" :key="'mob-' + (user.id || user._id)" class="user-profile-card glass-card">
            <div class="card-header">
              <div class="avatar-main">{{ user.name?.charAt(0).toUpperCase() }}</div>
              <div class="basic-info">
                <h3>{{ user.name }}</h3>
                <span :class="['role-badge-mini', user.role?.toLowerCase()]">
                  {{ user.role === 'ADMIN' ? '👑 مدير' : '👤 عميل' }}
                </span>
              </div>
              <div class="user-id-tag">#{{ (user.id || user._id)?.toString().slice(-4) }}</div>
            </div>
            
            <div class="card-body">
              <div class="info-row">
                <span class="label">📧 البريد:</span>
                <span class="value">{{ user.email }}</span>
              </div>
            </div>

            <div class="card-footer-actions">
              <button v-if="user.role !== 'ADMIN'" @click="setRole(user.id || user._id, 'ADMIN')" class="mob-btn up">ترقية لمدير</button>
              <button v-if="user.role === 'ADMIN'" @click="setRole(user.id || user._id, 'CUSTOMER')" class="mob-btn down">تنزيل لعميل</button>
              <button @click="toggleBan(user.id || user._id)" :class="['mob-btn', user.isBanned ? 'unban-act' : 'ban-act']">
                {{ user.isBanned ? 'إلغاء الحظر' : 'حظر الحساب' }}
              </button>
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

// الحفاظ على المنطق البرمجي الأصلي كاملاً
const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await API.get('/admin/users');
    users.value = res.data.data || [];
  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    loading.value = false;
  }
};

const setRole = async (userId, role) => {
  if (!confirm(`تأكيد تغيير صلاحيات هذا المستخدم؟`)) return;
  try {
    await API.patch(`/admin/users/${Number(userId)}/role`, { role });
    alert('تم تحديث الرتبة بنجاح ✅');
    fetchUsers();
  } catch (err) { alert('فشلت العملية'); }
};

const toggleBan = async (userId) => {
  if (!confirm(`تأكيد تغيير حالة حظر الحساب؟`)) return;
  try {
    await API.patch(`/admin/users/${Number(userId)}/ban`);
    alert('تمت العملية بنجاح');
    fetchUsers();
  } catch (err) { alert('فشلت العملية'); }
};

onMounted(fetchUsers);
</script>

<style scoped>
.admin-users-premium { padding: 40px 5% 100px; background: #fffdf5; min-height: 100vh; position: relative; }
.container-pro { max-width: 1200px; margin: 0 auto; }

/* هيدر الصفحة */
.page-header-pro { padding: 30px 40px; border-radius: 35px; border: 1px solid white; margin-bottom: 40px; }
.header-main { display: flex; align-items: center; gap: 20px; }
.icon-sphere { width: 65px; height: 65px; background: linear-gradient(135deg, #f39c12, #d35400); border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; box-shadow: 0 10px 25px rgba(211, 84, 0, 0.2); }
.title-text h1 { margin: 0; font-size: 2rem; color: #2c3e50; font-weight: 800; }
.count { color: #d35400; font-weight: 900; }

/* تنسيق الجدول (Desktop) */
.desktop-table-view { border-radius: 40px; overflow: hidden; border: 1px solid white; box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
.premium-table { width: 100%; border-collapse: collapse; text-align: right; }
.premium-table th { padding: 25px; background: rgba(243, 156, 18, 0.04); color: #d35400; font-weight: 800; }
.premium-table td { padding: 20px 25px; border-bottom: 1px solid rgba(0,0,0,0.03); }
.user-info-cell { display: flex; align-items: center; gap: 15px; }
.avatar-box { width: 45px; height: 45px; background: #ffeb99; color: #d35400; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; }
.name-id { display: flex; flex-direction: column; }
.u-name { font-weight: 800; color: #2d3436; }
.u-id { font-size: 0.75rem; color: #95a5a6; font-family: monospace; }
.role-pill { padding: 6px 15px; border-radius: 50px; font-size: 0.8rem; font-weight: bold; }
.role-pill.admin { background: rgba(211, 84, 0, 0.1); color: #d35400; }
.role-pill.customer { background: #f1f1f1; color: #7f8c8d; }

/* تنسيق الأزرار (Desktop) */
.btn-group-pro { display: flex; gap: 10px; justify-content: center; }
.btn-action { padding: 8px 16px; border-radius: 12px; border: none; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: 0.3s; }
.upgrade { background: #e8f5e9; color: #2e7d32; }
.ban { background: #ffebee; color: #c62828; }
.unban { background: #e3f2fd; color: #1976d2; }
.btn-action:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

/* ✨ تصميم الموبايل الخارق (Card Based) ✨ */
.mobile-cards-view { display: none; flex-direction: column; gap: 20px; }

@media (max-width: 992px) {
  .desktop-table-view { display: none; }
  .mobile-cards-view { display: flex; }
  
  .user-profile-card {
    padding: 25px;
    border-radius: 35px;
    border: 1px solid white;
    background: rgba(255, 255, 255, 0.9);
    position: relative;
    overflow: hidden;
  }
  
  .card-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; position: relative; }
  .avatar-main { width: 55px; height: 55px; background: linear-gradient(135deg, #f39c12, #d35400); color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; }
  .basic-info h3 { margin: 0; font-size: 1.2rem; color: #2d3436; }
  .role-badge-mini { font-size: 0.7rem; font-weight: bold; padding: 4px 10px; border-radius: 50px; display: inline-block; margin-top: 5px; }
  .role-badge-mini.admin { background: rgba(211, 84, 0, 0.1); color: #d35400; }
  .role-badge-mini.customer { background: #f1f1f1; color: #666; }
  .user-id-tag { position: absolute; top: 0; left: 0; background: #eee; padding: 4px 10px; border-radius: 10px; font-size: 0.7rem; font-family: monospace; color: #999; }
  
  .card-body { background: rgba(243, 156, 18, 0.03); padding: 15px; border-radius: 20px; margin-bottom: 20px; }
  .info-row { display: flex; flex-direction: column; gap: 5px; }
  .info-row .label { font-size: 0.8rem; color: #95a5a6; font-weight: bold; }
  .info-row .value { font-size: 0.95rem; color: #2c3e50; font-weight: 600; word-break: break-all; }
  
  .card-footer-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .mob-btn { padding: 12px; border-radius: 15px; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: 0.3s; text-align: center; }
  .mob-btn.up { background: #f39c12; color: white; grid-column: span 2; }
  .mob-btn.down { background: #eee; color: #666; grid-column: span 2; }
  .mob-btn.ban-act { background: #ffebee; color: #c62828; grid-column: span 2; }
  .mob-btn.unban-act { background: #e8f5e9; color: #2e7d32; grid-column: span 2; }
  .mob-btn:active { transform: scale(0.95); }
}

.premium-loader { text-align: center; padding: 60px; }
.honey-pulse { width: 50px; height: 50px; background: #f39c12; border-radius: 50%; margin: 0 auto 20px; animation: pulse-premium 1.5s infinite; }
@keyframes pulse-premium { 0% { transform: scale(0.8); opacity: 1; box-shadow: 0 0 0 0 rgba(243, 156, 18, 0.4); } 100% { transform: scale(1.2); opacity: 0; box-shadow: 0 0 0 20px rgba(243, 156, 18, 0); } }
</style>