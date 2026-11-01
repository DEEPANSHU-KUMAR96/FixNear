import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/authSlice";
import issueReducer from "../features/issues/state/issueSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        issues: issueReducer
    }
});
