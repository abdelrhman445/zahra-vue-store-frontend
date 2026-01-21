<template>
  <div class="add-product-page animated-reveal" dir="rtl">
    <div class="glass-card form-container">
      <h3>إضافة منتج جديد للمنحل 🐝</h3>
      <form @submit.prevent="handleSubmit" class="pro-form">
        <div class="input-group">
          <label>اسم المنتج</label>
          <input v-model="form.name" type="text" placeholder="مثلاً: عسل سدر فاخر" required />
        </div>
        
        <div class="row">
          <div class="input-group">
            <label>السعر (ج.م)</label>
            <input v-model.number="form.price" type="number" step="0.01" required />
          </div>
          <div class="input-group">
            <label>التصنيف</label>
            <input v-model="form.category" type="text" placeholder="عسل طبيعي" />
          </div>
        </div>

        <div class="input-group">
          <label>الكمية المتوفرة (المخزون)</label>
          <input v-model.number="form.stock" type="number" placeholder="مثلاً: 50" required />
        </div>

        <div class="input-group">
          <label>صورة المنتج</label>
          <div class="upload-wrapper">
            <input type="file" @change="handleFileUpload" accept="image/*" id="file-input" hidden />
            <label for="file-input" class="upload-label">
              <span v-if="!uploading">📁 اختر صورة من جهازك</span>
              <span v-else class="loader-pulse">جاري الرفع للسحاب...</span>
            </label>
            <div v-if="form.imageUrl" class="preview-box">
              <img :src="form.imageUrl" alt="Preview" />
              <button type="button" class="del-img" @click="form.imageUrl = ''">×</button>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label>الوصف</label>
          <textarea v-model="form.description" rows="4" required placeholder="وصف المنتج وفوائده..."></textarea>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading || uploading">
          <span v-if="!loading">حفظ ونشر المنتج ✨</span>
          <span v-else>جاري الحفظ...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import API from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const uploading = ref(false);
const form = ref({ 
  name: '', 
  price: null, 
  category: '', 
  imageUrl: '', 
  description: '',
  stock: 10 // قيمة افتراضية للمخزون
});

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  uploading.value = true;
  try {
    const res = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    form.value.imageUrl = res.data.imageUrl;
  } catch (err) {
    console.error("Upload error:", err);
    alert('فشل في رفع الصورة للسيرفر، تأكد من إعدادات Cloudinary');
  } finally {
    uploading.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.value.imageUrl) return alert('يرجى رفع صورة للمنتج أولاً');
  
  loading.value = true;
  try {
    // تجهيز البيانات مع التأكد من أنواع الحقول
    const payload = {
      name: form.value.name,
      description: form.value.description,
      price: Number(form.value.price),
      category: form.value.category || 'عسل طبيعي',
      imageUrl: form.value.imageUrl,
      stock: Number(form.value.stock) || 0 // إرسال المخزون كرقم
    };

    await API.post('/products', payload);
    alert('تم إضافة المنتج بنجاح! 🍯');
    router.push('/admin/products');
  } catch (err) {
    // تحسين إظهار رسالة الخطأ لمعرفة الحقل الناقص
    const errorData = err.response?.data;
    console.error("Error creating product details:", errorData);
    
    let msg = errorData?.message || 'حدث خطأ أثناء الإضافة، تأكد من كافة الحقول';
    if (errorData?.errors) {
      msg = Object.values(errorData.errors).join('\n');
    }
    alert(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-container { max-width: 800px; margin: 40px auto; padding: 50px; border-radius: 40px; border: 1px solid white; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
.pro-form .input-group { margin-bottom: 25px; }
.pro-form label { display: block; margin-bottom: 12px; font-weight: bold; color: #2d3436; text-align: right; }
.pro-form input, textarea { width: 100%; padding: 16px; border-radius: 18px; border: 1.5px solid #eee; outline: none; background: #fff; transition: 0.3s; box-sizing: border-box; }
.pro-form input:focus { border-color: #f39c12; box-shadow: 0 0 15px rgba(243, 156, 18, 0.1); }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.upload-label { display: block; padding: 25px; border: 2px dashed #f39c12; text-align: center; border-radius: 20px; cursor: pointer; background: #fffcf0; transition: 0.3s; }
.preview-box { margin-top: 20px; position: relative; width: 180px; margin-right: auto; margin-left: auto; }
.preview-box img { width: 100%; border-radius: 20px; border: 3px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.del-img { position: absolute; top: -10px; left: -10px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; }
.btn-submit { width: 100%; padding: 20px; background: linear-gradient(45deg, #f39c12, #d35400); color: white; border: none; border-radius: 20px; font-weight: 800; font-size: 1.1rem; cursor: pointer; box-shadow: 0 15px 30px rgba(243, 156, 18, 0.3); transition: 0.3s; }
.btn-submit:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(243, 156, 18, 0.4); }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
</style>