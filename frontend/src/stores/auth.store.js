import { create } from "zustand";
import api from "../utils/axios.js";

export const useAuth = create((set, get) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/auth/check");
      set({ user: res.data.user, loading: false });
      console.log(get().user);
    } catch (err) {
      console.error("CheckAuth failed:", err);
      set({ user: null, loading: false });
    }
  },

  signup: async (formData) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/signup", formData);
      set({ user: res.data.user, loading: false });
      return res.data;
    } catch (err) {
      set({ user: null, loading: false });
      throw err;
    }
  },

  login: async (formData) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/login", formData);
      set({ user: res.data.user, loading: false });
      return res.data.user;
    } catch (err) {
      set({ user: null, loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await api.post("/auth/logout");
      set({ user: null, loading: false });
    } catch (err) {
      console.error("Logout failed:", err);
      set({ user: null, loading: false });
    }
  },

  updatePassword: async (formData) => {
    try {
      const res = await api.put("/auth/update-password", formData);
      return {
        success: res.data.success || true,
        message: res.data.message || "Password updated successfully",
      };
    } catch (err) {
      console.error("Password update failed:", err);
      const message =
        err.response?.data?.message || "Failed to update password";
      return {
        success: false,
        message: message,
      };
    }
  },
}));
