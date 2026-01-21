<template>
  <div class="admin-page animated-reveal">
    <div class="page-header glass-card">
      <div class="title">
        <span class="icon">🍯</span>
        <div class="text-group">
          <h2>إدارة المنتجات</h2>
          <p>إجمالي المنتجات المعروضة: {{ products.length }}</p>
        </div>
      </div>
      <button @click="$router.push('/admin/products/add')" class="btn-add-pro">إضافة منتج جديد +</button>
    </div>

    <div v-if="loading" class="loader-box">جاري تحميل قائمة العسل...</div>

    <div v-else class="products-table-wrapper glass-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>الصورة</th>
            <th>الاسم</th>
            <th>السعر</th>
            <th>التصنيف</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id || product._id">
            <td><img :src="product.imageUrl" class="table-img" /></td>
            <td class="product-name">{{ product.name }}</td>
            <td><strong>{{ product.price }}</strong> ج.م</td>
            <td><span class="category-badge">{{ product.category || 'عام' }}</span></td>
            <td class="actions">
              <button @click="editProduct(product.id || product._id)" class="btn-edit" title="تعديل">📝</button>
              <button @click="deleteProduct(product.id || product._id)" class="btn-delete" title="حذف">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import API from '@/api';

const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await API.get('/products');
    // التأكد من جلب المنتجات سواء كانت في مصفوفة مباشرة أو داخل كائن
    products.value = res.data.data.products || res.data.data || [];
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟')) {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) { 
      alert('خطأ في الحذف: ' + (err.response?.data?.message || 'خطأ في الاتصال')); 
    }
  }
};

const editProduct = (id) => {
  // يمكن إضافة منطق التعديل هنا أو التوجيه لصفحة تعديل
  console.log("Edit product:", id);
};

onMounted(fetchProducts);
</script>

<style scoped>
.admin-page { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; padding: 30px; margin-bottom: 30px; border-radius: 25px; border: 1px solid white; }
.title { display: flex; align-items: center; gap: 15px; }
.icon { font-size: 2rem; }
.text-group h2 { margin: 0; color: #2d3436; }
.text-group p { margin: 5px 0 0; color: #7f8c8d; font-size: 0.9rem; }

.btn-add-pro { padding: 12px 25px; background: linear-gradient(45deg, #f39c12, #e67e22); color: white; border: none; border-radius: 15px; font-weight: bold; cursor: pointer; transition: 0.3s; }
.btn-add-pro:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(230, 126, 34, 0.2); }

.products-table-wrapper { border-radius: 30px; padding: 20px; border: 1px solid white; overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; text-align: right; min-width: 600px; }
.admin-table th { padding: 20px; color: #d35400; border-bottom: 2px solid rgba(243, 156, 18, 0.1); font-weight: 800; }
.admin-table td { padding: 20px; border-bottom: 1px solid #f9f9f9; }

.table-img { width: 60px; height: 60px; border-radius: 15px; object-fit: cover; border: 1px solid #eee; }
.product-name { font-weight: bold; color: #2d3436; }
.category-badge { background: #fff8e1; color: #ff8f00; padding: 5px 15px; border-radius: 50px; font-size: 0.75rem; font-weight: bold; }

.actions button { background: none; border: none; font-size: 1.3rem; cursor: pointer; margin-left: 10px; transition: 0.2s; }
.actions button:hover { transform: scale(1.2); }
</style>