import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Hand from './view/Hand';
import _ from 'lodash';
import {
    dealerRound,
    newGame,
    nextCard,
    playerRoundDone,
    selectIsGameStarted,
    selectRound,
    selectWinnings,
} from './state/BlackJackSlice';

function App() {
    // const handOfDealer = [0, 1, 2, 3];
    // const handOfPlayer = [38, 13];
    // const isPlayerDone = true;
    // const winner = 'Player';

    const dispatch = useDispatch();
    const { handOfDealer, handOfPlayer, isPlayerDone, winner } = useSelector(selectRound);
    const isGameStarted = useSelector(selectIsGameStarted);
    const winnings = useSelector(selectWinnings);

    return (
        <div className="container">
            <h1>Simple Blackjack</h1>

            {isGameStarted ? (
                <>
                    <h2>Dealer ({winnings.dealer}):</h2>
                    <Hand cards={handOfDealer}></Hand>
                    <button disabled={!isPlayerDone} onClick={() => dispatch(dealerRound())}>
                        Play Dealer
                    </button>
                    <h2>Player ({winnings.player}):</h2>
                    <Hand cards={handOfPlayer}></Hand>
                    <button disabled={isPlayerDone} onClick={() => dispatch(nextCard(true))}>Get New Card</button>
                    <button disabled={isPlayerDone} onClick={() => dispatch(playerRoundDone())}>Stop</button>
                    <button onClick={() => dispatch(newGame())}>New Game</button>
                    {winner && <p className="result">{winner} won!</p>}
                </>
            ) : (
                <button onClick={() => dispatch(newGame())}>New Game</button>
            )}
        </div>
    );
}

export default App;
