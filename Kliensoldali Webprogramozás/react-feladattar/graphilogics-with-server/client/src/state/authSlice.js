import { createSlice } from "@reduxjs/toolkit"

const initialState = { user: null, token: null }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, { payload: { user, token } }) => {
            state.user = user;
            state.token = token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }
});

// Reducer
export const authReducer = authSlice.reducer;

// Actions
export const { login, logout } = authSlice.actions;

// Selectors
export const getLoggedInUser = (state) => state.auth.user;
export const getAuthToken = (state) => state.auth.token;
