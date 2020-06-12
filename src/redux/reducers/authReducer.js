import {
    SET_AUTH_DETAILS,
} from '../actions/authAction';

const initialState = {};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUTH_DETAILS: {
            return {
                ...state,
                ...(action.payload),
            };
        }
        default: {
            return state
        }
    }
}

