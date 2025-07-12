import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

// Import slices (to be created)
import { promptApi } from "./api/promptApi";
import { templateApi } from "./api/templateApi";
import userSlice from "./slices/userSlice";
import uiSlice from "./slices/uiSlice";
import collaborationSlice from "./slices/collaborationSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "ui"], // Only persist user and UI state
    blacklist: ["promptApi", "templateApi", "collaboration"], // Don't persist API cache or real-time data
};

const rootReducer = combineReducers({
    user: userSlice,
    ui: uiSlice,
    collaboration: collaborationSlice,
    [promptApi.reducerPath]: promptApi.reducer,
    [templateApi.reducerPath]: templateApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(promptApi.middleware, templateApi.middleware),
});

export const persistor = persistStore(store);

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
