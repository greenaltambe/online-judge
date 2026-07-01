import { create } from "zustand";
import problemService from "../services/problemService";
import { useAuthStore } from "./authStore";

export const useProblemStore = create((set) => ({
  problems: [],
  currentProblem: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",

  getProblems: async () => {
    const token = useAuthStore.getState().user?.token;
    if (!token) return;
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const data = await problemService.getProblems(token);
      set({ problems: data.problems || [], isLoading: false, isSuccess: true });
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

  getProblemById: async (id) => {
    const token = useAuthStore.getState().user?.token;
    if (!token) return;
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const data = await problemService.getProblem(id, token);
      set({ currentProblem: data, isLoading: false, isSuccess: true });
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

  createProblem: async (problemData) => {
    const token = useAuthStore.getState().user?.token;
    if (!token) return;
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const data = await problemService.createProblem(problemData, token);
      set((state) => ({
        problems: [...state.problems, data],
        isLoading: false,
        isSuccess: true,
      }));
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

  deleteProblem: async (id) => {
    const token = useAuthStore.getState().user?.token;
    if (!token) return;
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      await problemService.deleteProblem(id, token);
      set((state) => ({
        problems: state.problems.filter((problem) => problem._id !== id),
        isLoading: false,
        isSuccess: true,
      }));
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
      currentProblem: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: "",
    });
  },
}));
