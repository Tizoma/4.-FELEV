import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import Board from "./Board"
import Catcher from "./Catcher"
import Controls from "./Controls"
import Info from "./Info"
import { selectPlayerPokemons, selectPokeBalls, selectPosition, selectappearedPokemon } from '../state/PokemonSlice';

function App() {

  const  playerPosition  = useSelector(selectPosition);
  const appearedPokemon = useSelector(selectappearedPokemon)
  const pokeBalls = useSelector(selectPokeBalls);
  const playerPokemons = useSelector(selectPlayerPokemons);

  return (
    <div className='container'>
        <h2>Pokemon Catcher</h2>
        <div className="row">
          <div className="col s8">
            <Board playerPosition={playerPosition} ></Board>
          </div>
          <div className="col s4">
            <Catcher appearedPokemon={appearedPokemon}></Catcher>
          </div>
        </div>
        <div className="row">
          <div className="col s4">
            <Controls></Controls>
          </div>
          <div className="col s8">
            <Info pokeBalls={pokeBalls} playerPokemons={playerPokemons}></Info>
          </div>
        </div>
    </div>
  )
}

export default App
