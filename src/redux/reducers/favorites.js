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
    userId: null,
  },
  reducers: {
    setUserFavorites: (state, action) => {
      const userId = action.payload;
      state.userId = userId;
      state.items = getUserFavorites(userId);
    },
    toggleFavorite: (state, action) => {
      const photo = action.payload;
      const exists = state.items.find((f) => f.id === photo.id);

      if (exists) {
        state.items = state.items.filter((f) => f.id !== photo.id);
      } else {
        state.items.push(photo);
      }

      if (state.userId) {
        saveUserFavorites(state.userId, state.items);
      }
    },
    clearFavorites: (state) => {
      if (state.userId) {
        localStorage.removeItem(`favorites_${state.userId}`);
      }
      state.items = [];
    },
  },
});

export const { setUserFavorites, toggleFavorite} = favoritesSlice.actions;
export default favoritesSlice.reducer;
