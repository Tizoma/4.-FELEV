const vowels = "öüóeuioőúaéáűí";
export const selectEditor = (state) => {
  const { editor } = state;
  const lines = editor.split("\n");
  const counts = lines.map((line) => line.split("").filter((c) => vowels.includes(c)).length);
  return {
    text: editor,
    counts,
    isHaiku: counts[0] === 5 && counts[1] === 7 && counts[2] === 5 && counts.length === 3,
  };
};