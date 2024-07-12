import { useDispatch, useSelector } from 'react-redux';
import { move } from '../state/PokemonSlice';

function Controls() {
    const dispatch = useDispatch();
    
      
    return (
        <table>
            <tbody>
                <tr>
                    <td></td>
                    <td>
                        <button onClick={() => dispatch(move("up"))}>↑</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button onClick={() => dispatch(move("left"))}>←</button>
                    </td>
                    <td>
                        <button onClick={() => dispatch(move("down"))}>↓</button>
                    </td>
                    <td>
                        <button onClick={() => dispatch(move("right"))}>→</button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default Controls;