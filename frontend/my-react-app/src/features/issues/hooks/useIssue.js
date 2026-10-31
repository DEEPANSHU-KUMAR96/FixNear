import { useDispatch } from "react-redux";
import{ createIssueStart, getIssuesStart, getSingleIssueStart, updateIssueStart, deleteIssueStart } from "../state/issueSlice"; 

const useIssue = () => {
    const dispatch = useDispatch();
    
    const createIssue = (data) => {
        dispatch(createIssueStart(data));
    };
    
    const getIssues = () => {
        dispatch(getIssuesStart());
    };
    
    const getSingleIssue = (id) => {
        dispatch(getSingleIssueStart(id));
    };
    
    const updateIssue = (data) => {
        dispatch(updateIssueStart(data));
    };
    
    const deleteIssue = (id) => {
        dispatch(deleteIssueStart(id));
    };
    
    return {
        createIssue,
        getIssues,
        getSingleIssue,
        updateIssue,
        deleteIssue,
    };
};

export default useIssue;