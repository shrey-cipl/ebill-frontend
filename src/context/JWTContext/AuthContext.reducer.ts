const INITIALIZE = 'INITIALIZE';
const SIGN_IN = 'SIGN_IN';
const SIGN_OUT = 'SIGN_OUT';
const SIGN_UP = 'SIGN_UP';

const AuthReducer = (state: any, action: any) => {
    console.log(action.type, "payload")
    switch (action.type) {
        case INITIALIZE:
            return {
                isAuthenticated: true,
                isInitialized: true,
                user: action.payload.user,
            };
        case SIGN_IN:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
            };
        case SIGN_OUT:
            return {
                ...state,
                isAuthenticated: false,
                user: {},
                otr_id:''
            };
        default:
            return state;
    }
};

export default AuthReducer;
