import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editor: "",
  selectedIndex: null,
  haikus: [
    `Téged vártalak
Mint hajnali fényt éjjel
Félve-remélve`,
  ],
};

const haikuSlice = createSlice({
  name: "haikus",
  initialState,
  reducers: {
    changeText: (state, { payload }) => {
      state.editor = payload;
    },
    addHaiku: (state, { payload: haiku }) => {
      state.haikus.push(haiku);
    },
    selectHaiku: (state, { payload: index }) => {
      state.selectedIndex = index;
      state.editor = state.haikus[index];
    },
    modifyHaiku: (state, { payload: text }) => {
      if (state.selectedIndex) {
        state.haikus[state.selectedIndex] = text;
        state.selectedIndex = null;
      }
    },
  },
});

// reducers
export const haikuReducer = haikuSlice.reducer;

// actions
export const { changeText, addHaiku, selectHaiku, modifyHaiku } = haikuSlice.actions;

// selectors
const vowels = "öüóeuioőúaéáűí";
export const selectorEditor = (state) => {
  const { editor } = state;
  const lines = editor.split("\n");
  const counts = lines.map((line) => line.split("").filter((c) => vowels.includes(c)).length);
  return {
    text: editor,
    counts,
    isHaiku: counts[0] === 5 && counts[1] === 7 && counts[2] === 5 && counts.length === 3,
  };
};

export const selectHaikus = (state) => ({
  haikus: state.haikus,
  selectedIndex: state.selectedIndex,
});
