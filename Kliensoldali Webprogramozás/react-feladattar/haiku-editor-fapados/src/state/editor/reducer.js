import { CHANGE_TEXT } from "./actions";

const initialState = '';

export const editorReducer = (state=initialState, action) => {
    const { type, payload } = action;

    if(type === CHANGE_TEXT) {
        return payload;
    }

    return state;
}
