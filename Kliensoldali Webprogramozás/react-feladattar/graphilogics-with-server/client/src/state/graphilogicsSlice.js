import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  solution: [" # ", "###", " # "],
  table: ["   ", "   ", "   "],
  isSolutionChecked: false,
};

const graphilogicsSlice = createSlice({
  name: "graphilogics",
  initialState,
  reducers: {
    startGame: (state) => {
      state.solution = [
        "### #  ##### ###",
        "#   #    #   #  ",
        "### #    #   ###",
        "#   #    #   #  ",
        "### ###  #   ###",
      ];
      state.table = [
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
      ];
      state.isSolutionChecked = false;
    },
    clickCell: (state, { payload }) => {
      const { i: indI, j: indJ } = payload;
      if (state.table[indI][indJ] === " ") {
        state.table = state.table.map((row, i) => (i === indI ? row.slice(0, indJ) + "#" + row.slice(indJ + 1) : row));
      } else {
        state.table = state.table.map((row, i) => (i === indI ? row.slice(0, indJ) + " " + row.slice(indJ + 1) : row));
      }
    },
    startSolutionCheck: (state) => {
      state.isSolutionChecked = true;
    },
    stopSolutionCheck: (state) => {
      state.isSolutionChecked = false;
    },
  },
});

// Actions
export const { startGame, clickCell, startSolutionCheck, stopSolutionCheck } = graphilogicsSlice.actions;

// Async Actions
export const checkSolution = createAsyncThunk(
  "graphilogics/checkSolution",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(startSolutionCheck());
    setTimeout(() => {
      thunkAPI.dispatch(stopSolutionCheck());
    }, 3000);
});

// Reducer
export const graphilogicsReducer = graphilogicsSlice.reducer;

// Selector
export const getSolution = (state) => state.graphilogics.solution;
export const getTable = (state) => state.graphilogics.table;
export const getIsSolutionChecked = (state) => state.graphilogics.isSolutionChecked;

export const getLeftNumbers = (state) => doTheThing(state.graphilogics.solution);
export const getTopNumbers = (state) =>
  doTheThing(transpose(state.graphilogics.solution.map((row) => row.split(""))).map((row) => row.join("")));

// Utils
const doTheThing = (matrix) =>
  matrix
    .map((row) =>
      row
        .replaceAll(/\s+/g, " ")
        .split(" ")
        .filter((r) => r.length > 0)
    )
    .map((r) => r.map((c) => c.length));
const transpose = (matrix) => matrix[0].map((_, i) => matrix.map((row) => row[i]));
