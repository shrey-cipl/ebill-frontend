import { createContext, useContext, useMemo, useReducer } from 'react';
import ForgotPasswordReducer from './ForgotPasswordContext.reducer';
import axios from '../../config/axios';
import { useAuth } from '../JWTContext/AuthContext.provider';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const illegalStateFunction = async (...args: any) => {
    throw new Error(
        'You must wrap your components in <ForgotPasswordContextProvider />',
    );
};

const initialData = {
    otp: '',
    otp_verified: false,
    sendOtp: illegalStateFunction,
    verifyOtp: illegalStateFunction,
    resetPassword: illegalStateFunction,
};

export const ForgotPasswordContext = createContext(initialData);

interface ForgotPasswordContextProviderProps {
    children: React.ReactNode;
}

export const useForgotPassword = () => useContext(ForgotPasswordContext);

function ForgotPasswordContextProvider({
    children,
}: ForgotPasswordContextProviderProps) {
    const auth = useAuth();
    const [state, dispatch] = useReducer(ForgotPasswordReducer, initialData);
    // const router = useRouter();

    const sendOtp = async (phone_num: string) => {
        const response = await axios.post('/api/user/getOtp', {
            phone_num,
        });
        dispatch({
            type: 'OTP_SENT',
            payload: {},
        });
        return response.data.otp; // TODO: Remove this
    };
    // const verifyOtp = async (phone_num: string, otp: string) => {
    //     // const response = await axios.post("/api/user/getOtp", {
    //     //   phone_num: phone_num,
    //     // });
    //     dispatch({
    //         type: 'OTP_VERIFIED',
    //         payload: {},
    //     });
    // };

    const resetPassword = async (
        password: string,
        confirm_password: string,
    ) => {
        await axios.post('/api/user/resetPassword', {
            password,
            confirm_password,
        });
        auth.signOut();
        dispatch({
            type: 'RESET_PASSWORD',
            payload: {},
        });
    };

    const globalContextValue = useMemo(
        () =>
            ({
                ...state,
                sendOtp,
                resetPassword,
                // verifyOtp,
            } as any),
        [state],
    );

    return (
        <ForgotPasswordContext.Provider value={globalContextValue}>
            {children}
        </ForgotPasswordContext.Provider>
    );
}

export default ForgotPasswordContextProvider;
