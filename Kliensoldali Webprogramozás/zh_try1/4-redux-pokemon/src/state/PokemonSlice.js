import { createSlice } from '@reduxjs/toolkit';
import { getRandomNumber, getRandomPokemon, isForest } from '../utils/utils';

const initialState = {
    playerPosition:{
         x: 0,
         y: 0
     },
     playerPokemons: [],
     appearedPokemon: null,
     pokeBall: 10,
 };

 export const PokemonSlice = createSlice({
    name: "pokemon",
    initialState,
    reducers : {
        move : (state, { payload: direction }) => {
            if(direction==="up" && state.playerPosition.y>0){
                state.playerPosition.y-=1;
            }
            else if(direction==="left" && state.playerPosition.x>0){
                state.playerPosition.x-=1;
            }
            else if(direction==="down" && state.playerPosition.y<5){
                state.playerPosition.y+=1;
            }
            else if(direction==="right" && state.playerPosition.x<50){
                state.playerPosition.x+=1;
            }
            if(isForest(state.playerPosition)){
                const c = getRandomNumber(0,100);
                if(c<60){
                    state.appearedPokemon=getRandomPokemon();
                }
            }
        },
        throwBall: state => {
            if(state.pokeBall>0){
                state.playerPokemons.push(state.appearedPokemon);
                state.pokeBall-=1;
            }
        },
    },
 });

 //Actions
 export const { move ,throwBall} = PokemonSlice.actions;

 // Reducer
export const pokemonReducer = PokemonSlice.reducer;

//Selectors
export const selectPosition = state => state.playerPosition;
export const selectappearedPokemon = state => state.appearedPokemon;
export const selectPokeBalls = state => state.pokeBall;
export const selectPlayerPokemons = state => state.playerPokemons;