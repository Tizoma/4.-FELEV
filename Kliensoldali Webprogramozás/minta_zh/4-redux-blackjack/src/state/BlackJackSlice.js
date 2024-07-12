import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { getValueOfCards } from '../utils/blackJackUtils';

const initialState = {
    deck: [],
    hands: {
        player: [],
        dealer: [],
    },
    isGameStarted: false,
    isPlayerRoundDone: false,
    roundWinner: null,
    winnings: {
        player: 0,
        dealer: 0,
    },
};

export const BlackJackSlice = createSlice({
    name: 'blackjack',
    initialState,
    reducers: {
        newGame: state => {
            state.deck = _.shuffle([...Array(52).keys()]);
            console.log(state.deck);
            state.hands.dealer = [];
            state.hands.player = [];
            state.isGameStarted = true;
            state.isPlayerRoundDone = false;
            state.roundWinner = null;
        },
        nextCard: (state, { payload: isPlayer }) => {
            if (!state.isPlayerRoundDone) {
                isPlayer
                    ? state.hands.player.push(state.deck[0])
                    : state.hands.dealer.push(state.deck[0]);
                state.deck.splice(0, 1);
                state.isPlayerRoundDone = getValueOfCards(state.hands.player) > 21;
            }
        },
        playerRoundDone: state => {
            state.isPlayerRoundDone = true;
        },
        dealerRound: state => {
            if (state.isPlayerRoundDone) {
                while (getValueOfCards(state.hands.dealer) <= 16) {
                    state.hands.dealer.push(state.deck[0]);
                    state.deck.splice(0, 1);
                }
                const dealerValue = getValueOfCards(state.hands.dealer);
                const playerValue = getValueOfCards(state.hands.player);

                if (dealerValue > 21 || (playerValue <= 21 && playerValue > dealerValue)) {
                    state.winnings.player++;
                    state.roundWinner = 'Player';
                } else {
                    state.winnings.dealer++;
                    state.roundWinner = 'Dealer';
                }
            }
        },
    },
});

// Actions
export const { newGame, nextCard, playerRoundDone, dealerRound } = BlackJackSlice.actions;

// Reducer
export const blackJackReducer = BlackJackSlice.reducer;

// Selector
export const selectRound = state => ({
    handOfDealer: state.hands.dealer,
    handOfPlayer: state.hands.player,
    isPlayerDone: state.isPlayerRoundDone,
    winner: state.roundWinner,
});
export const selectIsGameStarted = state => state.isGameStarted;
export const selectWinnings = state => state.winnings;
