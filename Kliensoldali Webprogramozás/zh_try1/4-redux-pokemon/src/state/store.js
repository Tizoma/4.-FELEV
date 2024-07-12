import { configureStore } from '@reduxjs/toolkit';
import { pokemonReducer } from './PokemonSlice';

export const store = configureStore({
    reducer: pokemonReducer,
});
