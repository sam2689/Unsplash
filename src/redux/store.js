import {configureStore} from "@reduxjs/toolkit";
import favoritesReducer from "./reducers/favorites.js";
import authReducer from './reducers/auth.js'
import appSettingsReducer from './reducers/appSettings.js'

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    auth: authReducer,
    appSettings: appSettingsReducer,
  },
});