import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { graphilogicsReducer } from "./graphilogicsSlice";
import { graphilogicsListReducer } from "./graphilogicsListSlice";
import { graphilogicsApiReducer, graphilogicsApiSlice } from "./graphilogicsApiSlice";

export const store = configureStore({
    reducer: {
        graphilogics: graphilogicsReducer,
        auth: authReducer,
        graphilogicsList: graphilogicsListReducer,
        [graphilogicsApiSlice.reducerPath]: graphilogicsApiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(graphilogicsApiSlice.middleware),
});
