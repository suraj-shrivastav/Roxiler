import { create } from "zustand";
import api from "../utils/axios.js";

export const useAdminStore = create((set) => ({
  adminDashboardData: null,
  loading: false,
  error: null,

  addUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/admin/users", data);
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.error("Error in addUser:", error);
      set({ loading: false, error });
      throw error;
    }
  },

  addStore: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/admin/stores", data);
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.error("Error in addStore:", error);
      set({ loading: false, error });
      throw error;
    }
  },

  adminDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/admin/dashboard");
      set({ adminDashboardData: res.data, loading: false });
    } catch (error) {
      console.error("Error in dashboard fetch:", error);
      set({ loading: false, error });
      throw error;
    }
  },
}));
