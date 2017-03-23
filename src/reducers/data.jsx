import actionTypes from "../actions/types";

const defaultState = {};

export default function adminReducer(state = defaultState, action = {}) {
    switch (action.type) {
        case actionTypes.addData:
            return {...state, ...action.data};
        default:
            return state;
    }
}
