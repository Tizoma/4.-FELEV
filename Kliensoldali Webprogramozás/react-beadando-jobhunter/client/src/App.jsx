import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Login.jsx";
import { Profile } from "./Profile.jsx";
import { RequireAuth } from "./RequireAuth.jsx";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";
import { Register } from "./Register.jsx";
import { NewJob } from "./NewJob.jsx";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="login" element={<Login />}></Route>
					<Route path="registration" element={<Register />}></Route>
					<Route path="newjob" element={<NewJob />}></Route>
					<Route
						path="profile"
						element={
							<RequireAuth>
								<Profile />
							</RequireAuth>
						}
					></Route>
					<Route path="*" element={<Navigate to="/" />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
