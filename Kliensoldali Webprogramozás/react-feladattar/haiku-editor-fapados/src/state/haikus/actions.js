export const ADD_HAIKU = "ADD_HAIKU";
export const MODIFY_HAIKU = "MODIFY_HAIKU";
export const REMOVE_HAIKU = "REMOVE_HAIKU";

export const addHaiku = (haiku) => ({
    type: ADD_HAIKU,
    payload: haiku,
});

export const modifyHaiku = (haiku) => ({
    type: MODIFY_HAIKU,
    payload: haiku,
});

export const removeHaiku = () => ({
    type: REMOVE_HAIKU,
});
