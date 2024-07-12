import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  lists: [
    {
      id: 1,
      puzzle: ["###", " # "],
    },
  ],
};

const graphilogicsListSlice = createSlice({
  name: "graphilogicsList",
  initialState,
  reducers: {
    setList: (state, { payload: puzzles }) => {
      state.lists = puzzles;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchList.fulfilled, (state, { payload: puzzles }) => {
      state.lists = puzzles;
    });
  },
});

// Reducer
export const graphilogicsListReducer = graphilogicsListSlice.reducer;

// Action
export const { setList } = graphilogicsListSlice.actions;

// Async actions
// export const fetchList = () => async (dispatch) => {
//     const response = await fetch('http://localhost:3030/puzzles');
//     const result = await response.json();
//     dispatch(setList(result.data));
// }

export const fetchList = createAsyncThunk(
  "graphilogicsList/fetchList",
  async () => {
    const response = await fetch("http://localhost:3030/puzzles");
    const result = await response.json();
    return result.data;
});
