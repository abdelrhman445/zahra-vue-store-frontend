<template>
  <div class="landing-page">
    <section class="hero">
      <div class="hero-content">
        <h2 class="reveal-text">طعم الطبيعة النقي بين يديك 🍯</h2>
        <p class="fade-in">نقدم لك أجود أنواع العسل المستخرج من أفضل المناحل الطبيعية، جودة نضمنها لك في كل قطرة.</p>
        <div class="cta-btns">
          <router-link to="/signup" class="main-btn">ابدأ رحلتك معنا</router-link>
          <a href="#about" class="sec-btn">لماذا الزهراء؟</a>
        </div>
      </div>
      <div class="hero-image">
        <div class="honey-circle"></div>
        <span class="floating-emoji">🐝</span>
      </div>
    </section>

    <section id="about" class="features">
      <div class="feature-card" v-for="(feat, i) in features" :key="i" :style="{ animationDelay: i*0.2+'s' }">
        <span class="feat-icon">{{ feat.icon }}</span>
        <h3>{{ feat.title }}</h3>
        <p>{{ feat.desc }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  { icon: '🌿', title: 'طبيعي 100%', desc: 'عسل نقي خالي من الإضافات الكيميائية والسكر.' },
  { icon: '🏆', title: 'جودة عالمية', desc: 'مختبر ومعبأ بأعلى معايير الجودة الصحية.' },
  { icon: '🚀', title: 'شحن سريع', desc: 'نصل إليك أينما كنت في أسرع وقت ممكن.' }
];
</script>

<style scoped>
.landing-page { padding: 0 5%; }

.hero {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 70vh; gap: 40px;
}

.hero-content { flex: 1; text-align: right; }
.hero-content h2 { font-size: 3.5rem; color: #2d3436; line-height: 1.2; margin-bottom: 20px; }
.hero-content p { font-size: 1.2rem; color: #636e72; margin-bottom: 30px; }

.cta-btns { display: flex; gap: 20px; }
.main-btn {
  background: #f39c12; color: white; padding: 15px 35px; border-radius: 50px;
  text-decoration: none; font-weight: bold; font-size: 1.1rem;
  box-shadow: 0 10px 20px rgba(243, 156, 18, 0.3); transition: 0.3s;
}
.sec-btn {
  padding: 15px 35px; border: 2px solid #f39c12; color: #f39c12;
  border-radius: 50px; text-decoration: none; font-weight: bold; transition: 0.3s;
}
.main-btn:hover { background: #e67e22; transform: scale(1.05); }

/* Hero Image Animation */
.hero-image { flex: 1; position: relative; display: flex; justify-content: center; }
.honey-circle {
  width: 300px; height: 300px; background: #f1c40f;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph 8s ease-in-out infinite;
}
.floating-emoji { position: absolute; font-size: 4rem; animation: bee 4s infinite ease-in-out; }

@keyframes morph {
  0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
  50% { border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%; }
  100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
}

@keyframes bee {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(20px, -30px) rotate(10deg); }
  75% { transform: translate(-20px, -10px) rotate(-10deg); }
}

/* Features Grid */
.features {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px; padding: 100px 0;
}
.feature-card {
  background: white; padding: 40px; border-radius: 25px; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid rgba(243, 156, 18, 0.1);
  animation: fadeInUp 1s both;
}
.feat-icon { font-size: 3rem; display: block; margin-bottom: 20px; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 900px) {
  .hero { flex-direction: column-reverse; text-align: center; }
  .hero-content h2 { font-size: 2.5rem; }
  .cta-btns { justify-content: center; }
}
</style>