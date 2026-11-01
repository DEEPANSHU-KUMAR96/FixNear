import { useDispatch, useSelector } from "react-redux";
import { 
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
    clearCurrentIssue
} from "../state/issueSlice";
import {
    createIssue as createIssueApi,
    getAllIssues as getAllIssuesApi,
    getMyIssues as getMyIssuesApi,
    getSingleIssue as getSingleIssueApi,
    updateIssue as updateIssueApi,
    updateIssueStatus as updateIssueStatusApi,
    deleteIssue as deleteIssueApi,
    searchIssues as searchIssuesApi
} from "../services/issue.service";

const toSerializableError = (err) => {
    if (!err) return "An unexpected error occurred";
    if (typeof err === "string") return err;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return "An unexpected error occurred";
};

const useIssue = () => {
    const dispatch = useDispatch();
    const issueState = useSelector((state) => state.issues);

    const createIssue = async (issueData) => {
        dispatch(createIssueStart());
        try {
            const res = await createIssueApi(issueData);
            const created = res?.issue || res;
            dispatch(createIssueSuccess(created));
            return res;
        } catch (err) {
            dispatch(createIssueFail(toSerializableError(err)));
            throw err;
        }
    };

    const fetchAllIssues = async () => {
        dispatch(getIssuesStart());
        try {
            const res = await getAllIssuesApi();
            const list = res?.issues || res || [];
            dispatch(getIssuesSuccess(list));
            return list;
        } catch (err) {
            dispatch(getIssuesFail(toSerializableError(err)));
            throw err;
        }
    };

    const fetchMyIssues = async () => {
        dispatch(getIssuesStart());
        try {
            const res = await getMyIssuesApi();
            const list = res?.issues || res || [];
            dispatch(getIssuesSuccess(list));
            return list;
        } catch (err) {
            dispatch(getIssuesFail(toSerializableError(err)));
            throw err;
        }
    };

    const fetchSingleIssue = async (id) => {
        dispatch(getSingleIssueStart());
        try {
            const res = await getSingleIssueApi(id);
            const issue = res?.issue || res;
            dispatch(getSingleIssueSuccess(issue));
            return issue;
        } catch (err) {
            dispatch(getSingleIssueFail(toSerializableError(err)));
            throw err;
        }
    };

    const updateExistingIssue = async (id, updates) => {
        dispatch(updateIssueStart());
        try {
            const res = await updateIssueApi(id, updates);
            const updated = res?.issue || res;
            dispatch(updateIssueSuccess(updated));
            return updated;
        } catch (err) {
            dispatch(updateIssueFail(toSerializableError(err)));
            throw err;
        }
    };

    const updateStatus = async (id, status) => {
        dispatch(updateIssueStart());
        try {
            const res = await updateIssueStatusApi(id, status);
            const updated = res?.issue || res;
            dispatch(updateIssueSuccess(updated));
            return updated;
        } catch (err) {
            dispatch(updateIssueFail(toSerializableError(err)));
            throw err;
        }
    };

    const removeIssue = async (id) => {
        dispatch(deleteIssueStart());
        try {
            const res = await deleteIssueApi(id);
            dispatch(deleteIssueSuccess(id));
            return res;
        } catch (err) {
            dispatch(deleteIssueFail(toSerializableError(err)));
            throw err;
        }
    };

    const searchUserIssues = async (query) => {
        dispatch(getIssuesStart());
        try {
            const res = await searchIssuesApi(query);
            const list = res?.issues || res || [];
            dispatch(getIssuesSuccess(list));
            return list;
        } catch (err) {
            dispatch(getIssuesFail(toSerializableError(err)));
            throw err;
        }
    };

    return {
        ...issueState,
        createIssue,
        fetchAllIssues,
        fetchMyIssues,
        fetchSingleIssue,
        updateExistingIssue,
        updateStatus,
        removeIssue,
        searchUserIssues,
        clearError: () => dispatch(clearIssueError()),
        clearCurrent: () => dispatch(clearCurrentIssue())
    };
};

export default useIssue;
