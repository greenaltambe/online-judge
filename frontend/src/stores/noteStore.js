import { create } from "zustand";
import api from "../lib/api";

export const useNoteStore = create((set) => ({
  note: null, // holds { content, updatedAt }
  isLoading: false,
  isSaving: false,
  isError: false,
  message: "",

  getNote: async (problemId) => {
    set({ isLoading: true, isError: false, message: "" });
    try {
      const response = await api.get(`/notes/problem/${problemId}`);
      set({ note: response.data, isLoading: false });
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

  saveNote: async (problemId, content) => {
    set({ isSaving: true, isError: false, message: "" });
    try {
      const response = await api.put(`/notes/problem/${problemId}`, { content });
      set({ note: response.data, isSaving: false });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isSaving: false, isError: true, message });
      throw new Error(message);
    }
  },

  deleteNote: async (problemId) => {
    set({ isLoading: true, isError: false, message: "" });
    try {
      await api.delete(`/notes/problem/${problemId}`);
      set({ note: { content: "", updatedAt: null }, isLoading: false });
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
      note: null,
      isLoading: false,
      isSaving: false,
      isError: false,
      message: "",
    });
  },
}));
