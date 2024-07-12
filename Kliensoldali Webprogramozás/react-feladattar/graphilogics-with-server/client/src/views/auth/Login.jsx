import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useLoginMutation } from "../../state/graphilogicsApiSlice";
import { useDispatch } from "react-redux";
import { login } from "../../state/authSlice";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [authLogin] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = data;
    const newErrors = {};

    if (username === "") {
      newErrors.username = "Username is required!";
    }

    if (password === "") {
      newErrors.password = "Password is required!";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).length > 0) {
      return;
    }

    try {
      const result = await authLogin({
        strategy: "local",
        email: username,
        password,
      }).unwrap();
      // console.log(result);
      dispatch(login({ user: result.user, token: result.accessToken }));
      navigate("/", { replace: true });
    } catch (error) {
      setErrors({ username: "Login error" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Username"
          value={data.username}
          name="username"
          onChange={handleChange}
          isInvalid={!!errors.username}
        />
        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
      </FloatingLabel>

      <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
        <Form.Control
          type="password"
          placeholder="Password"
          value={data.password}
          name="password"
          onChange={handleChange}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
      </FloatingLabel>

      <Button type="submit">Bejelentkezés</Button>
    </form>
  );
};
