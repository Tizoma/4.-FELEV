import { configureStore } from '@reduxjs/toolkit';
import { blackJackReducer } from './BlackJackSlice';

export const store = configureStore({
    reducer: blackJackReducer,
});
