const ForgotPasswordReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'OTP_SENT':
            return {
                ...state,
            };
        case 'OTP_VERIFIED':
            return {
                ...state,
                otp_verified: true,
            };
        case 'RESET_PASSWORD':
            return {
                ...state,
                otp_verified: false,
                otp: '',
            };
        default:
            return state;
    }
};

export default ForgotPasswordReducer;
