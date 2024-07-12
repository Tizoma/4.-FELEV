import { NavLink } from "react-router-dom";

export function Navbar(loggedInUser) {
	console.log(loggedInUser.loggedInUser);
	return (
		<>
			<nav>
				<NavLink to="/">Jobhunter</NavLink>
				{loggedInUser.loggedInUser ? (
					<>
						<p>{loggedInUser.loggedInUser}</p>
						<NavLink to="profile">Profile</NavLink>
					</>
				) : (
					<>
						<NavLink to="registration">Regisztráció</NavLink>
						<NavLink to="login">Login</NavLink>
					</>
				)}
			</nav>
		</>
	);
}
