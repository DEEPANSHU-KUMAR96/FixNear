import { useDispatch, useSelector } from "react-redux";
import { 
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
} from "../state/authSlice";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getUser, 
    forgotPassword as forgotPasswordApi, 
    resetPassword as resetPasswordApi 
} from "../services/auth.service";

const toSerializableError = (err) => {
    if (!err) return "An unexpected error occurred";
    if (typeof err === "string") return err;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return "An unexpected error occurred";
};

const useAuth = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const register = async (name, email, password) => {
        dispatch(registerStart());
        try {
            const res = await registerUser(name, email, password);
            dispatch(registerSuccess(res));
            return res;
        } catch (err) {
            dispatch(registerFail(toSerializableError(err)));
            throw err;
        }
    };

    const login = async (email, password) => {
        dispatch(loginStart());
        try {
            const res = await loginUser(email, password);
            dispatch(loginSuccess(res));
            return res;
        } catch (err) {
            dispatch(loginFail(toSerializableError(err)));
            throw err;
        }
    };

    const logout = async () => {
        dispatch(logoutStart());
        try {
            const res = await logoutUser();
            dispatch(logoutSuccess(res));
            return res;
        } catch (err) {
            dispatch(logoutFail(toSerializableError(err)));
            throw err;
        }
    };

    const getCurrentUser = async () => {
        dispatch(getUserStart());
        try {
            const res = await getUser();
            dispatch(getUserSuccess(res));
            return res;
        } catch (err) {
            dispatch(getUserFail(toSerializableError(err)));
            throw err;
        }
    };

    const forgotPassword = async (email) => {
        dispatch(forgotPasswordStart());
        try {
            const res = await forgotPasswordApi(email);
            dispatch(forgotPasswordSuccess(res));
            return res;
        } catch (err) {
            dispatch(forgotPasswordFail(toSerializableError(err)));
            throw err;
        }
    };

    const resetPassword = async (token, password) => {
        dispatch(resetPasswordStart());
        try {
            const res = await resetPasswordApi(token, password);
            dispatch(resetPasswordSuccess(res));
            return res;
        } catch (err) {
            dispatch(resetPasswordFail(toSerializableError(err)));
            throw err;
        }
    };

    return { 
        ...authState,
        register, 
        login, 
        logout, 
        getCurrentUser, 
        forgotPassword, 
        resetPassword 
    };
};

export default useAuth;
