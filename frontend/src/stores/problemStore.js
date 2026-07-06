import { create } from "zustand";
import api from "../lib/api";

export const useProblemStore = create((set) => ({
  problems: [],
  currentProblem: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",

  getProblems: async () => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.get("/problems");
      set({ problems: response.data.problems || [], isLoading: false, isSuccess: true });
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
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.get(`/problems/${id}`);
      set({ currentProblem: response.data, isLoading: false, isSuccess: true });
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

  createProblem: async (formData) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.post("/problems", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        problems: [...state.problems, response.data.problem],
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

  updateProblem: async (id, problemData) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.put(`/problems/${id}`, problemData);
      set((state) => ({
        problems: state.problems.map((prob) =>
          prob._id === id ? response.data.problem : prob
        ),
        currentProblem: state.currentProblem && state.currentProblem.problem._id === id 
          ? { ...state.currentProblem, problem: response.data.problem } 
          : state.currentProblem,
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
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      await api.delete(`/problems/${id}`);
      set((state) => ({
        problems: state.problems.filter((prob) => prob._id !== id),
        isLoading: false,
        isSuccess: true,
      }));
      return true;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isLoading: false, isError: true, message });
      return false;
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
