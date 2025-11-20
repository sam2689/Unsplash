import { createSlice } from "@reduxjs/toolkit";

const getUserFavorites = (userId) => {
  return JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
};

const saveUserFavorites = (userId, items) => {
  localStorage.setItem(`favorites_${userId}`, JSON.stringify(items));
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    currentUserId: null,
  },
  reducers: {
    setUserFavorites: (state, action) => {
      const userId = action.payload;
      state.currentUserId = userId;
      state.items = getUserFavorites(userId);
    },
    toggleFavorite: (state, action) => {
      const photo = action.payload;

      if (!state.currentUserId) {
        console.error("No user ID set for favorites");
        return state;
      }

      const exists = state.items.find((f) => f.id === photo.id);

      if (exists) {
        state.items = state.items.filter((f) => f.id !== photo.id);
      } else {
        state.items.push(photo);
      }

      saveUserFavorites(state.currentUserId, state.items);
    },
    clearCurrentFavorites: (state) => {
      state.items = [];
      state.currentUserId = null;
    },
  },
});

export const { setUserFavorites, toggleFavorite, clearCurrentFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;