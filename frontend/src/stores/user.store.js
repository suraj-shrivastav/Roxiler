import { create } from "zustand";
import api from "../utils/axios.js";

export const useUserStore = create((set, get) => ({
  stores: [],

  getAllStores: async () => {
    try {
      const res = await api.get("/stores");
      set({ stores: res.data || [] });
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  },

  addRating: async (id, data) => {
    try {
      await api.post(`/stores/${id}/rating`, data);
      await get().getAllStores();
    } catch (err) {
      console.error("Error adding rating:", err);
    }
  },

  updateRating: async (id, data) => {
    try {
      await api.post(`/stores/${id}/rating`, data);
      await get().getAllStores();
    } catch (err) {
      console.error("Error updating rating:", err);
    }
  },

  //Store searching functionality
  getStore: (keyword) => {
    const { stores } = get();
    if (!keyword) return stores;
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(keyword.toLowerCase()) ||
        store.address.toLowerCase().includes(keyword.toLowerCase())
    );
  },
}));
