// import { configureStore } from "@reduxjs/toolkit";
// import { haikuReducer } from "../features/haiku/haikuSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { editorReducer } from "./editor/reducer";
import { selectedIndexReducer } from "./selectedIndex/reducer";
import { haikusReducer } from "./haikus/reducer";


// export const store = configureStore({
//     reducer: haikuReducer,
// });

const rootReducer = combineReducers({
    editor: editorReducer,
    selectedIndex: selectedIndexReducer,
    haikus: haikusReducer,
});

export const store = configureStore({
    reducer: rootReducer,
})

