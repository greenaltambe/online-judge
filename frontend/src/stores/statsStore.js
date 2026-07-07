import { create } from "zustand";
import api from "../lib/api";

export const useStatsStore = create((set) => ({
  overview: null,
  difficulty: null,
  languages: null,
  tags: null,
  activity: null,
  calendar: null,
  isLoading: false,
  isError: false,
  message: "",

  getStatsDashboard: async () => {
    set({ isLoading: true, isError: false, message: "" });
    try {
      const [
        overviewRes,
        difficultyRes,
        languagesRes,
        tagsRes,
        activityRes,
        calendarRes,
      ] = await Promise.all([
        api.get("/stats/overview"),
        api.get("/stats/difficulty"),
        api.get("/stats/languages"),
        api.get("/stats/tags"),
        api.get("/stats/activity"),
        api.get("/stats/calendar"),
      ]);

      set({
        overview: overviewRes.data,
        difficulty: difficultyRes.data,
        languages: languagesRes.data,
        tags: tagsRes.data,
        activity: activityRes.data,
        calendar: calendarRes.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading stats dashboard:", error);
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
      overview: null,
      difficulty: null,
      languages: null,
      tags: null,
      activity: null,
      calendar: null,
      isLoading: false,
      isError: false,
      message: "",
    });
  },
}));
