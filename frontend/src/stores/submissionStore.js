import { create } from "zustand";
import submissionService from "../services/submissionService";
import { useAuthStore } from "./authStore";

export const useSubmissionStore = create((set) => ({
  runResult: null,
  submissions: null,
  submissionResult: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",

  runSolution: async (problemData) => {
    const token = useAuthStore.getState().user?.token;
    if (!token) return;
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const data = await submissionService.runSolution(problemData, token);
      set({ runResult: data, isLoading: false, isSuccess: true });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },

  submitSolution: async (problemData) => {
    const token = useAuthStore.getState().user?.token;
    if (!token) return;
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const data = await submissionService.submitSolution(problemData, token);
      set({ submissionResult: data, isLoading: false, isSuccess: true });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ submissionResult: null, isLoading: false, isError: true, message });
    }
  },

  getSubmissions: async (id) => {
    const token = useAuthStore.getState().user?.token;
    if (!token) return;
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const data = await submissionService.getSubmissions(id, token);
      set({ submissions: data, isLoading: false, isSuccess: true });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },

  reset: () => {
    set({
      runResult: null,
      submissions: null,
      submissionResult: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: "",
    });
  },
}));
