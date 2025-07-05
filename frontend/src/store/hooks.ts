import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for common use cases
export const useAuth = () => {
    const { currentUser, isAuthenticated, isLoading, token } = useAppSelector((state) => state.user);
    return { currentUser, isAuthenticated, isLoading, token };
};

export const useUI = () => {
    const ui = useAppSelector((state) => state.ui);
    return ui;
};

export const useCollaboration = () => {
    const collaboration = useAppSelector((state) => state.collaboration);
    return collaboration;
};
