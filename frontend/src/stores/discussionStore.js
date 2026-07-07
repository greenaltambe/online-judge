import { create } from "zustand";
import api from "../lib/api";

export const useDiscussionStore = create((set, get) => ({
  discussions: [],
  isLoading: false,
  isError: false,
  message: "",

  getDiscussions: async (problemId) => {
    set({ isLoading: true, isError: false, message: "" });
    try {
      const response = await api.get(`/discussions/problem/${problemId}`);
      set({ discussions: response.data || [], isLoading: false });
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

  addComment: async (problemId, payload) => {
    set({ isLoading: true, isError: false, message: "" });
    try {
      await api.post(`/discussions/problem/${problemId}`, payload);
      // Reload discussions to get populated user and hierarchy
      await get().getDiscussions(problemId);
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

  editComment: async (problemId, commentId, content) => {
    set({ isLoading: true, isError: false, message: "" });
    try {
      await api.put(`/discussions/${commentId}`, { content });
      await get().getDiscussions(problemId);
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

  deleteComment: async (problemId, commentId) => {
    set({ isLoading: true, isError: false, message: "" });
    try {
      await api.delete(`/discussions/${commentId}`);
      await get().getDiscussions(problemId);
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

  voteComment: async (problemId, commentId) => {
    // We don't necessarily want full spinner overlay for a vote action
    try {
      await api.post(`/discussions/${commentId}/vote`);
      await get().getDiscussions(problemId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isError: true, message });
    }
  },

  reset: () => {
    set({
      discussions: [],
      isLoading: false,
      isError: false,
      message: "",
    });
  },
}));
