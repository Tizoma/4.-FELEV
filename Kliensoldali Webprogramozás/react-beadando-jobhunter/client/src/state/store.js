import { configureStore } from "@reduxjs/toolkit";
import { jobhunterApiReducer, jobhunterApiSlice } from "./jobhunterApiSlice";
import { authReducer } from "./authSlice";
export const store = configureStore({
	reducer: {
		auth: authReducer,
		[jobhunterApiSlice.reducerPath]: jobhunterApiReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(jobhunterApiSlice.middleware),
});
