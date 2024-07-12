import { useDispatch, useSelector } from "react-redux";
import { selectHaikus } from "./haikuSlice";

export const HaikuList = () => {
  const dispatch = useDispatch();
  const { haikus } = useSelector(selectHaikus);

  const handleSelectHaiku = () => {};

  const handleRemoveHaiku = () => {};

  return (
    <div>
      <h2>Haiku list</h2>
      <div>
        {haikus.map((haiku, i) => {
          <pre key={i} onClick={() => handleSelectHaiku(i)}>
            {haiku}
          </pre>;
        })}
        <button>Remove</button>
      </div>
    </div>
  );
};
