import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

interface UserState {
    currentUser: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.isLoading = false;
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.currentUser = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        updateUserPreferences: (state, action: PayloadAction<Partial<User["preferences"]>>) => {
            if (state.currentUser) {
                state.currentUser.preferences = {
                    ...state.currentUser.preferences,
                    ...action.payload,
                };
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUserPreferences, clearError } = userSlice.actions;

export default userSlice.reducer;
