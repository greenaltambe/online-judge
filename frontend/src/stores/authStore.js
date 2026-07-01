import { create } from "zustand";
import authService from "../services/authService";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",

  login: async (userData) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const data = await authService.login(userData);
      set({ user: data, isLoading: false, isSuccess: true });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ user: null, isLoading: false, isError: true, message });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const data = await authService.register(userData);
      set({ user: data, isLoading: false, isSuccess: true });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ user: null, isLoading: false, isError: true, message });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isError: false, isSuccess: false, isLoading: false, message: "" });
  },

  reset: () => {
    set({ isLoading: false, isSuccess: false, isError: false, message: "" });
  },
}));
