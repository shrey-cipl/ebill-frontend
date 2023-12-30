const UserReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'UPDATE_CANDIDATES':
            return {};
        case 'EDUCATION_DETAILS_UPDATE':
            return {};
        case 'FAMILY_HISTORY_UPDATE':
            return {};
        case 'WORK_EXPERIENCE_UPDATE':
            return {};
        case 'GET_WORK_EXPERIENCE':
            return {};
        case 'GET_FAMILY_HISTORY':
            return {};
        case 'GET_BASIC_DETAILS':
            return {};
        case 'GET_EDUCATION_DETAILS':
            return {};
        default:
            return state;
    }
};

export default UserReducer;
