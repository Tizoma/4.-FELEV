import cn from 'classnames'
import { isForest } from '../utils/utils';
import './Board.css';

export default function Board(playerPosition) {
    //console.log(playerPosition.playerPosition.x);
    return (
        <table className='board-table'>
            <tbody>
                {Array.from({ length: 5 }).map((_, y) => (
                    <tr key={y}>
                        {Array.from({ length: 5 }).map((_, x) => (
                            <td key={x} className={cn({'player': playerPosition.playerPosition.x === x && playerPosition.playerPosition.y === y,'forest': isForest({ x: x, y: y})})}>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}