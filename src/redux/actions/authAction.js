export const SET_AUTH_DETAILS = 'SET_AUTH_DETAILS';

export const setAuthDetails = (state) => {
    return{
        type: SET_AUTH_DETAILS,
        payload: state
    }

};
