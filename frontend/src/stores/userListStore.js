import { create } from "zustand";
import api from "../lib/api";

export const useUserListStore = create((set, get) => ({
  userLists: [],
  currentList: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",

  getUserLists: async () => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.get("/userlists");
      set({ userLists: response.data || [], isLoading: false, isSuccess: true });
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

  getUserListById: async (id) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.get(`/userlists/${id}`);
      set({ currentList: response.data, isLoading: false, isSuccess: true });
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

  createUserList: async (listData) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.post("/userlists", listData);
      set((state) => ({
        userLists: [...state.userLists, response.data],
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

  updateUserList: async (id, listData) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.put(`/userlists/${id}`, listData);
      set((state) => ({
        userLists: state.userLists.map((list) =>
          list._id === id ? response.data : list
        ),
        currentList: state.currentList && state.currentList._id === id
          ? response.data
          : state.currentList,
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

  deleteUserList: async (id) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      await api.delete(`/userlists/${id}`);
      set((state) => ({
        userLists: state.userLists.filter((list) => list._id !== id),
        currentList: state.currentList && state.currentList._id === id ? null : state.currentList,
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

  addProblemToList: async (listId, problemId) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.post(`/userlists/${listId}/problems`, { problemId });
      set((state) => ({
        userLists: state.userLists.map((list) =>
          list._id === listId ? response.data : list
        ),
        currentList: state.currentList && state.currentList._id === listId
          ? response.data
          : state.currentList,
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

  removeProblemFromList: async (listId, problemId) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: "" });
    try {
      const response = await api.delete(`/userlists/${listId}/problems/${problemId}`);
      set((state) => ({
        userLists: state.userLists.map((list) =>
          list._id === listId ? response.data : list
        ),
        currentList: state.currentList && state.currentList._id === listId
          ? response.data
          : state.currentList,
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
      currentList: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: "",
    });
  },
}));
