import { ADD_HAIKU } from "./actions";

const initialState = [];

export const haikusReducer = (state=initialState, action) => {
    const { type, payload } = action;

    if(type === ADD_HAIKU) {
        return [...state, payload];
    }

    return state;
}