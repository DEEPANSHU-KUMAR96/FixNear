import { createSlice } from "@reduxjs/toolkit";

const issueSlice = createSlice({
    name: "issues",
    initialState: {
        issues: [],
        currentIssue: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        // Create Issue
        createIssueStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        createIssueSuccess: (state, action) => {
            state.isLoading = false;
            const newIssue = action.payload?.issue || action.payload;
            state.issues.unshift(newIssue);
            state.error = null;
        },
        createIssueFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Get All Issues
        getIssuesStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getIssuesSuccess: (state, action) => {
            state.isLoading = false;
            state.issues = action.payload?.issues || action.payload || [];
            state.error = null;
        },
        getIssuesFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Get Single Issue
        getSingleIssueStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getSingleIssueSuccess: (state, action) => {
            state.isLoading = false;
            state.currentIssue = action.payload?.issue || action.payload;
            state.error = null;
        },
        getSingleIssueFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Update Issue
        updateIssueStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        updateIssueSuccess: (state, action) => {
            state.isLoading = false;
            const updatedIssue = action.payload?.issue || action.payload;
            state.issues = state.issues.map((issue) =>
                issue._id === updatedIssue._id ? updatedIssue : issue
            );
            if (state.currentIssue?._id === updatedIssue._id) {
                state.currentIssue = updatedIssue;
            }
            state.error = null;
        },
        updateIssueFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Delete Issue
        deleteIssueStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        deleteIssueSuccess: (state, action) => {
            state.isLoading = false;
            const deletedId = action.payload?.id || action.payload;
            state.issues = state.issues.filter((issue) => issue._id !== deletedId);
            if (state.currentIssue?._id === deletedId) {
                state.currentIssue = null;
            }
            state.error = null;
        },
        deleteIssueFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Helper Reducers
        clearIssueError: (state) => {
            state.error = null;
        },
        clearCurrentIssue: (state) => {
            state.currentIssue = null;
        },
    },
});

export const {
    createIssueStart,
    createIssueSuccess,
    createIssueFail,
    getIssuesStart,
    getIssuesSuccess,
    getIssuesFail,
    getSingleIssueStart,
    getSingleIssueSuccess,
    getSingleIssueFail,
    updateIssueStart,
    updateIssueSuccess,
    updateIssueFail,
    deleteIssueStart,
    deleteIssueSuccess,
    deleteIssueFail,
    clearIssueError,
    clearCurrentIssue,
} = issueSlice.actions;

export default issueSlice.reducer;
