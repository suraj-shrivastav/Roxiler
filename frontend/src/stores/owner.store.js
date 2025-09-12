import { create } from "zustand";
import api from "../utils/axios.js";

export const useOwnerStore = create((set) => ({
  ownerDashboardData: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/owner/dashboard");
      set({ ownerDashboardData: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching owner dashboard:", error);
      set({ loading: false, error });
      throw error;
    }
  },
}));
