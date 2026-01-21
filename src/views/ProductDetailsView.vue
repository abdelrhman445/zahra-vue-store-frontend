<template>
  <div class="product-details-page-pro" dir="rtl">
    <div class="honey-ambient-glow"></div>
    <div class="honey-ambient-glow secondary"></div>
    <div class="honey-ambient-glow tertiary"></div>

    <div v-if="loading" class="loader-container-pro">
      <div class="honey-spinner-pro"></div>
      <p class="loading-text">جاري تحضير تفاصيل العسل الملكي...</p>
    </div>
    
    <div v-else-if="product" class="details-container-pro animated-reveal">
      <div class="product-visual-section">
        <div class="visual-glass-card-pro">
          <div class="image-wrapper">
            <img :src="product.imageUrl" :alt="product.name" class="product-img-pro" />
          </div>
          <div class="floating-badges">
            <div class="badge-premium">جودة ملكية ✨</div>
            <div class="badge-origin">إنتاج مناحلنا 🐝</div>
          </div>
          <div class="quality-shield">
            <span class="shield-icon">🛡️</span>
            <span class="shield-text">نقاء مضمون</span>
          </div>
        </div>
      </div>
      
      <div class="product-info-section">
        <div class="info-glass-card-pro">
          <div class="info-header-pro">
            <div class="category-meta">
              <span class="cat-pill">🍯 عسل الزهراء الأصلي</span>
              <span class="stock-status">متوفر الآن</span>
            </div>
            <h1 class="glitter-text-pro">{{ product.name }}</h1>
          </div>

          <p class="description-pro">{{ product.description }}</p>
          
          <div class="pricing-card-royal">
            <div class="price-content">
              <span class="price-label">قيمة الاستثمار في صحتك</span>
              <div class="price-main-display">
                <span class="price-val">{{ product.price }}</span>
                <span class="currency">ج.م</span>
              </div>
            </div>
            <div class="delivery-info">
              <i class="fas fa-truck-fast"></i>
              <span>شحن سريع لكل المحافظات</span>
            </div>
          </div>

          <div class="purchase-actions-pro">
            <div class="qty-control-royal">
              <button @click="qty > 1 ? qty-- : null" class="qty-btn-royal" aria-label="تقليل">
                <i class="fas fa-minus"></i>
              </button>
              <span class="qty-number">{{ qty }}</span>
              <button @click="qty++" class="qty-btn-royal" aria-label="زيادة">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            
            <button @click="addToCart" class="btn-cart-royal">
              <span>إضافة للسلة الملكية</span>
              <i class="fas fa-shopping-basket"></i>
            </button>
          </div>

          <div class="trust-grid-pro">
            <div class="trust-item-pro">
              <div class="t-icon">🌿</div>
              <span>طبيعي 100%</span>
            </div>
            <div class="trust-item-pro">
              <div class="t-icon">🔬</div>
              <span>مفحوص معملياً</span>
            </div>
            <div class="trust-item-pro">
              <div class="t-icon">📦</div>
              <span>تغليف فاخر</span>
            </div>
          </div>
        </div>
      </div>

      <div class="reviews-section-pro-max glass-card-pro">
        <div class="reviews-header-pro-max">
          <div class="title-group-pro">
            <span class="stars-badge">⭐⭐⭐⭐⭐</span>
            <h2>تجارب عملاء الزهراء</h2>
          </div>
          <button 
            v-if="auth.isAuthenticated && !showReviewForm" 
            @click="showReviewForm = true" 
            class="btn-write-royal"
          >
            شاركنا تجربتك المميزة
          </button>
        </div>

        <transition name="slide-down">
          <div v-if="showReviewForm" class="review-form-royal">
            <div class="form-header">
              <h3>تقييم المنتج ✨</h3>
              <p>رأيك يساعدنا على التطوير الدائم لمملكة الزهراء</p>
            </div>
            
            <div class="star-rating-royal">
              <span 
                v-for="star in 5" :key="star" 
                @click="newReview.rating = star" 
                :class="['star-unit-royal', { active: star <= newReview.rating }]"
              >★</span>
            </div>
            
            <textarea 
              v-model="newReview.comment" 
              placeholder="صف شعورك بعد تجربة هذا العسل الفاخر..." 
              rows="4"
              class="review-textarea-royal"
            ></textarea>
            
            <div class="form-actions-royal">
              <button @click="submitReview" :disabled="loadingReview" class="btn-submit-royal">
                <span v-if="!loadingReview">نشر التقييم الملكي</span>
                <span v-else class="loader-pulse">جاري النشر...</span>
              </button>
              <button @click="showReviewForm = false" class="btn-cancel-royal">إلغاء</button>
            </div>
          </div>
        </transition>

        <div class="reviews-feed-royal">
          <div v-if="fetchingReviews" class="honey-pulse-loader"></div>
          
          <div v-else-if="reviews.length === 0" class="empty-reviews-royal">
            <div class="empty-icon">🍯</div>
            <p>سجل ذكرياتك الأولى مع هذا المنتج وكن أول من يقيّمه</p>
          </div>

          <div v-else v-for="review in reviews" :key="review.id" class="review-card-royal">
            <div class="rc-header">
              <div class="rc-user">
                <div class="user-initial-sphere">
                  {{ review.user?.name?.charAt(0).toUpperCase() }}
                </div>
                <div class="user-meta-royal">
                  <span class="user-name-royal">{{ review.user?.name }}</span>
                  <div class="user-rating-stars">
                    <span v-for="s in 5" :key="s" :class="['mini-star-royal', { active: s <= review.rating }]">★</span>
                  </div>
                </div>
              </div>
              <span class="rc-date">{{ formatDate(review.createdAt) }}</span>
            </div>
            <div class="rc-content">
              <p>{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import API from '@/api';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const cart = useCartStore();
const auth = useAuthStore();
const product = ref(null);
const loading = ref(true);
const qty = ref(1);

const reviews = ref([]);
const fetchingReviews = ref(true);
const showReviewForm = ref(false);
const loadingReview = ref(false);
const newReview = ref({ rating: 5, comment: '' });

onMounted(async () => {
  try {
    const res = await API.get(`/products/${route.params.id}`);
    product.value = res.data.data.product || res.data.data;
    fetchReviews();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const fetchReviews = async () => {
  fetchingReviews.value = true;
  try {
    const res = await API.get(`/reviews/${route.params.id}`);
    reviews.value = res.data.data.reviews;
  } catch (err) {
    console.error(err);
  } finally {
    fetchingReviews.value = false;
  }
};

const submitReview = async () => {
  if (!newReview.value.comment.trim()) return alert('فضلاً، شاركنا تعليقك');
  loadingReview.value = true;
  try {
    await API.post('/reviews', {
      productId: route.params.id,
      rating: newReview.value.rating,
      comment: newReview.value.comment
    });
    alert('تم استقبال تقييمك بكل حب! ❤️');
    newReview.value = { rating: 5, comment: '' };
    showReviewForm.value = false;
    fetchReviews();
  } catch (err) {
    alert('فشل في إرسال التقييم، يرجى المحاولة لاحقاً');
  } finally {
    loadingReview.value = false;
  }
};

const addToCart = () => {
  for(let i=0; i<qty.value; i++) {
    cart.addToCart(product.value);
  }
};

const formatDate = (date) => new Date(date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<style scoped>
/* التنسيق البريميوم الاحترافي بنمط Royal Cell */
.product-details-page-pro {
  padding: 160px 5% 100px;
  min-height: 100vh;
  background: #fffdf5;
  position: relative;
  overflow-x: hidden;
}

.honey-ambient-glow {
  position: absolute; top: -15%; left: -15%; width: 60%; height: 60%;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.12) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}
.honey-ambient-glow.secondary { top: 40%; left: 50%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(211, 84, 0, 0.08) 0%, transparent 70%); }
.honey-ambient-glow.tertiary { bottom: -10%; right: -10%; width: 40%; height: 40%; background: radial-gradient(circle, rgba(243, 156, 18, 0.05) 0%, transparent 70%); }

.details-container-pro {
  display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px;
  max-width: 1400px; margin: 0 auto; position: relative; z-index: 2;
}

/* قسم الصورة */
.visual-glass-card-pro {
  background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(30px);
  border-radius: 50px; padding: 50px; border: 1.5px solid white;
  box-shadow: 0 40px 80px rgba(211, 84, 0, 0.12); position: relative;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.image-wrapper { width: 100%; transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.product-img-pro { width: 100%; max-height: 600px; object-fit: contain; border-radius: 40px; }
.visual-glass-card-pro:hover .image-wrapper { transform: scale(1.06) rotate(-2deg); }

.floating-badges { position: absolute; top: 40px; left: 40px; display: flex; flex-direction: column; gap: 12px; }
.badge-premium { background: #27ae60; color: white; padding: 10px 25px; border-radius: 50px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 10px 20px rgba(39, 174, 96, 0.2); }
.badge-origin { background: #f39c12; color: white; padding: 10px 25px; border-radius: 50px; font-weight: 800; font-size: 0.95rem; }

.quality-shield { position: absolute; bottom: 40px; right: 40px; display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.9); padding: 12px 25px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.shield-icon { font-size: 1.5rem; }
.shield-text { font-weight: 900; color: #2d3436; font-size: 1rem; }

/* قسم المعلومات */
.info-glass-card-pro {
  background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(35px);
  border-radius: 50px; padding: 60px; border: 1.5px solid white;
  box-shadow: 0 30px 70px rgba(211, 84, 0, 0.1);
}
.glitter-text-pro { font-size: 3.5rem; font-weight: 950; background: linear-gradient(45deg, #d35400, #f39c12); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 30px; line-height: 1.2; }
.category-meta { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
.cat-pill { background: rgba(243, 156, 18, 0.12); color: #d35400; padding: 10px 25px; border-radius: 50px; font-weight: 800; font-size: 1rem; }
.stock-status { color: #27ae60; font-weight: 900; font-size: 0.9rem; }
.description-pro { font-size: 1.3rem; line-height: 2; color: #636e72; margin-bottom: 45px; font-weight: 500; }

.pricing-card-royal {
  background: linear-gradient(135deg, #fffdf0 0%, #fff9e6 100%);
  padding: 35px 45px; border-radius: 40px; margin-bottom: 45px;
  border: 2.5px solid rgba(243, 156, 18, 0.2); display: flex;
  justify-content: space-between; align-items: center;
}
.price-label { display: block; color: #7f8c8d; font-weight: 700; margin-bottom: 8px; font-size: 0.95rem; }
.price-val { font-size: 4rem; font-weight: 950; color: #f39c12; text-shadow: 0 4px 10px rgba(243, 156, 18, 0.15); }
.currency { font-size: 1.5rem; color: #2d3436; margin-right: 12px; font-weight: 900; }
.delivery-info { text-align: left; color: #d35400; font-weight: 800; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.delivery-info i { font-size: 2.5rem; }

.purchase-actions-pro { display: flex; gap: 30px; margin-bottom: 50px; }
.qty-control-royal { display: flex; align-items: center; background: white; padding: 10px; border-radius: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.03); border: 1px solid #eee; }
.qty-btn-royal { width: 55px; height: 55px; border: none; background: #f8f9fa; border-radius: 20px; font-size: 1.2rem; cursor: pointer; transition: 0.3s; color: #2d3436; }
.qty-btn-royal:hover { background: #f39c12; color: white; }
.qty-number { padding: 0 35px; font-weight: 950; font-size: 1.6rem; color: #2d3436; }

.btn-cart-royal {
  flex: 1; padding: 25px; background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white; border: none; border-radius: 30px; font-weight: 950; font-size: 1.4rem;
  cursor: pointer; box-shadow: 0 20px 40px rgba(39, 174, 96, 0.3); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex; align-items: center; justify-content: center; gap: 15px;
}
.btn-cart-royal:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 25px 50px rgba(39, 174, 96, 0.4); }

.trust-grid-pro { display: flex; justify-content: space-around; padding-top: 40px; border-top: 2px dashed #eee; }
.trust-item-pro { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.t-icon { font-size: 2rem; }
.trust-item-pro span { font-weight: 800; color: #95a5a6; font-size: 0.9rem; }

/* قسم التقييمات */
.reviews-section-pro-max { grid-column: 1 / -1; margin-top: 80px; padding: 60px; border-radius: 60px; background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(30px); border: 1.5px solid white; }
.reviews-header-pro-max { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; }
.stars-badge { font-size: 1.4rem; letter-spacing: 5px; background: rgba(243, 156, 18, 0.1); padding: 10px 25px; border-radius: 50px; }
.btn-write-royal { background: #2d3436; color: white; border: none; padding: 18px 45px; border-radius: 25px; font-weight: 900; cursor: pointer; transition: 0.4s; font-size: 1.1rem; }
.btn-write-royal:hover { background: #000; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }

.review-card-royal { background: white; padding: 45px; border-radius: 40px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.02); transition: 0.4s; position: relative; }
.review-card-royal:hover { transform: translateY(-10px); box-shadow: 0 25px 50px rgba(211, 84, 0, 0.06); }
.rc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.rc-user { display: flex; align-items: center; gap: 20px; }
.user-initial-sphere { width: 65px; height: 65px; background: linear-gradient(135deg, #f39c12, #d35400); color: white; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 950; box-shadow: 0 8px 20px rgba(211, 84, 0, 0.2); }
.user-name-royal { display: block; font-weight: 950; color: #2d3436; font-size: 1.2rem; margin-bottom: 5px; }
.mini-star-royal { color: #eee; font-size: 1rem; }
.mini-star-royal.active { color: #f39c12; }
.rc-date { color: #95a5a6; font-weight: 700; font-size: 0.9rem; }
.rc-content p { font-size: 1.2rem; line-height: 1.9; color: #636e72; padding-right: 85px; }

/* فورم التقييم */
.review-form-royal { background: #fffdf5; padding: 60px; border-radius: 50px; border: 3px dashed #f39c12; margin-bottom: 70px; text-align: center; }
.form-header h3 { font-size: 2rem; color: #d35400; margin-bottom: 10px; font-weight: 900; }
.star-rating-royal { font-size: 3.5rem; margin-bottom: 40px; }
.star-unit-royal { cursor: pointer; color: #eee; transition: 0.3s; margin: 0 10px; }
.star-unit-royal.active { color: #f39c12; transform: scale(1.2); display: inline-block; }
.review-textarea-royal { width: 100%; border-radius: 30px; border: 2px solid #eee; padding: 30px; outline: none; font-size: 1.25rem; transition: 0.3s; box-sizing: border-box; background: white; margin-bottom: 40px; }
.review-textarea-royal:focus { border-color: #f39c12; box-shadow: 0 15px 40px rgba(243, 156, 18, 0.08); }

.form-actions-royal { display: flex; align-items: center; justify-content: center; gap: 25px; }
.btn-submit-royal { background: linear-gradient(45deg, #27ae60, #2ecc71); color: white; border: none; padding: 22px 60px; border-radius: 25px; font-weight: 950; font-size: 1.2rem; cursor: pointer; transition: 0.3s; }
.btn-cancel-royal { background: transparent; color: #95a5a6; border: 2.5px solid #eee; padding: 20px 50px; border-radius: 25px; font-weight: 900; cursor: pointer; transition: all 0.4s ease; font-size: 1.1rem; }
.btn-cancel-royal:hover { background: #fdf2f2; color: #e74c3c; border-color: #fadbd8; transform: translateY(-3px); }

/* ✅ تحسينات الموبايل الجوهرية لضمان الشكل الفخم (Responsive Fix) */
@media (max-width: 1100px) {
  .details-container-pro { grid-template-columns: 1fr; gap: 40px; }
  .info-glass-card-pro { padding: 40px; }
  .rc-content p { padding-right: 0; }
  .glitter-text-pro { font-size: 2.8rem; }
}

@media (max-width: 768px) {
  .product-details-page-pro { padding: 100px 15px 50px; }
  
  .visual-glass-card-pro { padding: 30px; border-radius: 35px; }
  .product-img-pro { max-height: 400px; border-radius: 25px; }
  .floating-badges { top: 20px; left: 20px; }
  .badge-premium, .badge-origin { padding: 6px 15px; font-size: 0.75rem; }
  .quality-shield { bottom: 20px; right: 20px; padding: 8px 15px; font-size: 0.8rem; border-radius: 12px; }

  .info-glass-card-pro { padding: 30px 20px; border-radius: 35px; }
  .glitter-text-pro { font-size: 2.2rem; margin-bottom: 20px; }
  .description-pro { font-size: 1.1rem; margin-bottom: 30px; line-height: 1.7; }
  
  .pricing-card-royal { padding: 25px; flex-direction: column; gap: 20px; text-align: center; border-radius: 25px; }
  .price-val { font-size: 3rem; }
  .delivery-info { flex-direction: row; font-size: 0.9rem; gap: 10px; }
  .delivery-info i { font-size: 1.5rem; }

  .purchase-actions-pro { flex-direction: column; gap: 15px; }
  .qty-control-royal { justify-content: center; width: 100%; border-radius: 20px; }
  .qty-btn-royal { width: 50px; height: 50px; }
  .qty-number { padding: 0 25px; }
  .btn-cart-royal { width: 100%; padding: 20px; font-size: 1.2rem; border-radius: 20px; }

  .trust-grid-pro { flex-wrap: wrap; gap: 20px; padding-top: 30px; }
  .trust-item-pro { width: 45%; }
  .t-icon { font-size: 1.5rem; }

  .reviews-section-pro-max { margin-top: 40px; padding: 30px 15px; border-radius: 35px; }
  .reviews-header-pro-max { flex-direction: column; gap: 20px; text-align: center; }
  .btn-write-royal { width: 100%; padding: 15px; font-size: 1rem; border-radius: 18px; }

  .review-card-royal { padding: 25px 20px; border-radius: 25px; }
  .rc-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .rc-user { width: 100%; }
  .rc-date { align-self: flex-end; font-size: 0.75rem; font-style: italic; }
  .rc-content p { font-size: 1rem; line-height: 1.6; }

  .review-form-royal { padding: 40px 15px; border-radius: 30px; }
  .star-rating-royal { font-size: 2.5rem; margin-bottom: 25px; }
  .review-textarea-royal { padding: 20px; font-size: 1rem; border-radius: 20px; margin-bottom: 25px; }
  .form-actions-royal { flex-direction: column; gap: 10px; }
  .btn-submit-royal, .btn-cancel-royal { width: 100%; padding: 15px; font-size: 1.1rem; border-radius: 18px; }
}

/* Animations */
.animated-reveal { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>