import actionTypes from "./types";

export function addData(data) {
    return {
        type: actionTypes.addData,
        data
    };
}
