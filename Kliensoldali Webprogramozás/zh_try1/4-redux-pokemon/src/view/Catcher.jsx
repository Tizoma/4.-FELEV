import { useDispatch } from 'react-redux';
import { throwBall } from '../state/PokemonSlice';

function Catcher(appearedPokemon) {
    const dispatch = useDispatch();
    return (
        <div>
            <div>
                <p>A wild {appearedPokemon.appearedPokemon} appeared!</p>
                <div>
                    <img src={`./src/assets/${appearedPokemon.appearedPokemon}.png`} alt="bulbasaur" />
                </div>
                <button onClick={() => dispatch(throwBall())}>Throw Poké Ball</button>
            </div>
        </div>
    );
}

export default Catcher;