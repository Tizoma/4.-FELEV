import { useState } from "react";
import Login from "./Login";
import Private from "./Private";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const login = (username) => setLoggedInUser(username);
  const logout = () => setLoggedInUser(null);
  return <div>{loggedInUser ? <Private loggedInUser={loggedInUser} /> : <Login />}</div>;
}

export default App;
