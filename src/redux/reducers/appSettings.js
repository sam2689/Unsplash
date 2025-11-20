import { createSlice } from "@reduxjs/toolkit";

const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState: {
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'en'
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.documentElement.className = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      document.documentElement.className = newTheme;
    }
  },
});

export const { setTheme, setLanguage, toggleTheme } = appSettingsSlice.actions;
export default appSettingsSlice.reducer;