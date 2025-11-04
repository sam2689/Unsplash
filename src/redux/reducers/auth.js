import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
    restoreAuth(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    }
  },
});

export const {loginSuccess, logout, restoreAuth} = authSlice.actions;
export default authSlice.reducer;
