// import { useState } from "react";
import Login from "./Login";
import Private from "./Private";
import { useAuth } from "./authContext";

function App() {
  // const [loggedInUser, setLoggedInUser] = useState(null);
  // const login = (username) => setLoggedInUser(username);
  // const logout = () => setLoggedInUser(null);

  const { loggedInUser, logout, login } = useAuth();

  return (
    <div>
      {loggedInUser ? <Private loggedInUser={loggedInUser} logout={logout} /> : <Login login={login} />}
    </div>
  );
}

export default App;
