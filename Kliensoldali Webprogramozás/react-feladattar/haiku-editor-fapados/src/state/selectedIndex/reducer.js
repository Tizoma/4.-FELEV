import { SELECT_HAIKU } from "./actions";


const initialState = null;

export const selectedIndexReducer = (state=initialState, action) => {
    const { type, payload } = action;

    if(type === SELECT_HAIKU) {
        return payload;
    }

    return state;
}