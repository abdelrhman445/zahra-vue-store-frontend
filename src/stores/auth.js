import { defineStore } from "pinia";
import API from "../api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "ADMIN",
  },

  actions: {
    /* ================= LOGIN ================= */
    async login(credentials) {
      try {
        const res = await API.post("/auth/login", credentials);
        this.saveAuthData(res.data);
        return { success: true };
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.message || "خطأ في تسجيل الدخول";

        // ✅ لو الحساب محظور (403) امسح بيانات الدخول فورًا
        if (status === 403) {
          this.logout();
        }

        return { success: false, message };
      }
    },

    /* ================= SIGNUP ================= */
    async signup(payload) {
      try {
        // ✅ صح: بدون /api لأن baseURL فيه /api بالفعل
        const res = await API.post("/auth/register", payload);

        // لو السيرفر بيرجع token + user
        this.saveAuthData(res.data);

        return { success: true };
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || "خطأ في إنشاء الحساب",
        };
      }
    },

    /* ================= SAVE AUTH ================= */
    saveAuthData(data) {
      const token = data?.token || data?.data?.token || null;
      const user = data?.user || data?.data?.user || null;

      this.token = token;
      this.user = user;

      if (this.token) {
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);
        API.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      }
    },

    /* ================= LOGOUT ================= */
    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete API.defaults.headers.common["Authorization"];

      window.location.reload();
    },
  },
});
