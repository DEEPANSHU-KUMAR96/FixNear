import {createSlice} from "@reduxjs/toolkit"

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
        },
        registerSuccess: (state, action) => {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        registerFail: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        loginStart: (state) => {
            state.isLoading = true
        },
        loginSuccess: (state, action) => {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
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
        },
        getUserFail: (state, action) => {
            state.isLoading = false
            state.error = action.payload
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
