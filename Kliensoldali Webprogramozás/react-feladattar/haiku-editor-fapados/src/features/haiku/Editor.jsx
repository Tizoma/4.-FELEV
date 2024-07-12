
import { useDispatch, useSelector } from "react-redux";
import styles from "./Editor.module.css";
// import { addHaiku, modifyHaiku, selectorEditor } from "./haikuSlice";
// import { changeText } from "./haikuSlice";
import { selectEditor } from "../../state/editor/selectors";
import { addHaiku, modifyHaiku } from "../../state/haikus/actions";
import { changeText } from "../../state/editor/actions";

export const Editor = () => {
  // const { text, counts, isHaiku } = useSelector(selectorEditor);
  const { text, counts, isHaiku } = useSelector(selectEditor);
  const dispatch = useDispatch();

  const handleInput = (e) => {
    // console.log(changeText(e.target.value));
    dispatch(changeText(e.target.value))
  }

  const handleNewHaiku = () => {
    dispatch(addHaiku(text));
  }

  const handleModifyHaiku = () => {
    dispatch(modifyHaiku(text));
  }

  return (
    <div>
      <textarea
        rows="4"
        cols="40"
        className={isHaiku ? styles.good : styles.wrong}
        value={text}
        onChange={handleInput}
      ></textarea>
      <p>Vowels per row: { counts.join(', ') }</p>
      {isHaiku && <button onClick={handleNewHaiku}>Add</button>}
      {isHaiku && <button onClick={handleModifyHaiku}>Save</button>}
    </div>
  );
};
