import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        isLoading: false
    },
    reducers: {
        registerStart: (state) => {
            state.isLoading = true
            state.error = null
        },
        registerSuccess: (state, action) => {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token || action.payload.accessToken || null
            state.isAuthenticated = true
            state.error = null
        },
        registerFail: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        loginStart: (state) => {
            state.isLoading = true
            state.error = null
        },
        loginSuccess: (state, action) => {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token || action.payload.accessToken || null
            state.isAuthenticated = true
            state.error = null
        },
        loginFail: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        logoutStart: (state) => {
            state.isLoading = true
        },
        logoutSuccess: (state) => {
            state.isLoading = false
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.error = null
        },
        logoutFail: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        getUserStart: (state) => {
            state.isLoading = true
        },
        getUserSuccess: (state, action) => {
            state.isLoading = false
            state.user = action.payload.user
            state.isAuthenticated = true
            state.error = null
        },
        // Token invalid/expired on refresh — fully reset to logged-out
        getUserFail: (state, action) => {
            state.isLoading = false
            state.error = action.payload
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
        forgotPasswordStart: (state) => {
            state.isLoading = true
        },
        forgotPasswordSuccess: (state) => {
            state.isLoading = false
        },
        forgotPasswordFail: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        resetPasswordStart: (state) => {
            state.isLoading = true
        },
        resetPasswordSuccess: (state) => {
            state.isLoading = false
        },
        resetPasswordFail: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        }
    }
})

export const {
    registerStart,
    registerSuccess,
    registerFail,
    loginStart,
    loginSuccess,
    loginFail,
    logoutStart,
    logoutSuccess,
    logoutFail,
    getUserStart,
    getUserSuccess,
    getUserFail,
    forgotPasswordStart,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordStart,
    resetPasswordSuccess,
    resetPasswordFail
} = authSlice.actions

export default authSlice.reducer
