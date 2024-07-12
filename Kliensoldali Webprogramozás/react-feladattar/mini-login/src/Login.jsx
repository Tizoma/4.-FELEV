import { useRef, useState } from "react";

// eslint-disable-next-line react/prop-types, no-unused-vars
const Login = ({ login }) => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const newErrors = {};

    if(username === "") {
      newErrors.username = "Username is required!";
    }

    if(password === "") {
      newErrors.password = "Password is required!";
    } else if(password !== "asdfasdf") {
      newErrors.password = "Wrong password!";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).length > 0) {
      return;
    }

    login(username);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Felhasználónév: </label>
      <input ref={usernameRef} type="text" id="username" name="username" label="Felhasználónév" />
      {errors.username && <div>{errors.username}</div>}
      <br />
      <label htmlFor="password">Jelszó: </label>
      <input ref={passwordRef} type="password" id="password" name="password" label="Jelszó" />
      {errors.password && <div>{errors.password}</div>}
      <br />
      <button type="submit"> Elküld</button>
    </form>
  );
};

export default Login;
