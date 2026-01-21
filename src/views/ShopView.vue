<template>
  <div class="shop-container" dir="rtl">
    <header class="shop-header">
      <h2>مجموعة عسل الزهراء الفاخرة 🍯</h2>
      <p>اختر ما يناسبك من أجود أنواع العسل الطبيعي</p>
    </header>

    <div v-if="loading" class="loader-wrapper">
      <div class="honey-loader"></div>
    </div>

    <div v-else class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="router.push('/product/' + product.id)"
      >
        <div class="image-box">
          <!-- ✅ fallback لو الصورة فاضية/NULL -->
          <img
            :src="safeImage(product)"
            :alt="product.name"
            @error="onImgError"
          />
          <span class="category-tag">{{ product.category || 'عسل نقي' }}</span>
        </div>

        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="desc">{{ product.description || '' }}</p>

          <div class="price-row">
            <span class="price">{{ product.price }} ج.م</span>
            <button class="add-btn" @click.stop="cart.addToCart(product)">
              + إضافة للسلة
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import API from '@/api';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const products = ref([]);
const loading = ref(true);
const cart = useCartStore();
const router = useRouter();

// ✅ صورة بديلة بسيطة (بدون ما تعتمد على ملفات عندك)
const FALLBACK_IMG =
  'https://via.placeholder.com/800x600?text=Honey+Product';

const safeImage = (product) => {
  const url = product?.imageUrl;
  if (!url || String(url).trim().length === 0) return FALLBACK_IMG;
  return url;
};

const onImgError = (e) => {
  e.target.src = FALLBACK_IMG;
};

onMounted(async () => {
  try {
    // ✅ كسر الكاش لتفادي 304 + دعم كل أشكال الـ response من الباك
    const res = await API.get(`/products?ts=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });

    const raw = res.data || {};
    products.value =
      raw?.data?.products || // الشكل القديم
      raw?.data ||           // لو data Array مباشرة
      raw?.products ||       // alias من الباك
      [];
  } catch (err) {
    console.error('خطأ في جلب المنتجات:', err);
    products.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.shop-container {
  padding: 140px 6% 60px;
  min-height: 100vh;
  background: #fffdf5;
}
.shop-header {
  text-align: center;
  margin-bottom: 55px;
}
.shop-header h2 {
  font-size: 2.4rem;
  font-weight: 900;
  margin-bottom: 15px;
  color: #d35400;
}
.shop-header p {
  color: #636e72;
  font-size: 1rem;
}

.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
.honey-loader {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #f39c12;
  animation: pulse 1.4s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
}

.product-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid white;
  box-shadow: 0 15px 35px rgba(211, 84, 0, 0.05);
  transition: 0.3s;
}
.product-card:hover {
  transform: translateY(-6px);
}

.image-box {
  position: relative;
  height: 220px;
  overflow: hidden;
}
.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.85);
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #d35400;
}

.product-info {
  padding: 25px;
  text-align: right;
}
.product-info h3 {
  margin: 0 0 10px;
  color: #2d3436;
}
.desc {
  color: #636e72;
  font-size: 0.85rem;
  height: 40px;
  overflow: hidden;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-size: 1.5rem;
  font-weight: 900;
  color: #f39c12;
}
.add-btn {
  background: #f39c12;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}
.add-btn:hover {
  background: #d35400;
  transform: scale(1.05);
}
</style>
