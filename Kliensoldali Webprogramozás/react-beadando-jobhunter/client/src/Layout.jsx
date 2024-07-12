import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { getLoggedInUser, logout } from "./state/authSlice";

// eslint-disable-next-line react/prop-types
export function Layout() {
	const loggedInUser = useSelector(getLoggedInUser);
	const dispatch = useDispatch();
	function handleLogout() {
		dispatch(logout());
	}
	return (
		<>
			<nav className="bg-slate-700 py-4">
				<NavLink className="m-7 text-gray-50 font-sans font-semibold" to="/">
					Álláshirdetések
				</NavLink>
				{loggedInUser ? (
					loggedInUser.role === "company" ? (
						<>
							<NavLink className="m-7 text-gray-50 font-sans font-semibold" to="profile">
								Profilom
							</NavLink>
							<NavLink className="m-7 text-gray-50 font-sans font-semibold" to="newjob">
								Álláshirdetés hozzáadása
							</NavLink>
							<NavLink className="m-7 text-gray-50 font-sans font-semibold" to="/" onClick={() => handleLogout()}>
								Kijelentkezés
							</NavLink>
						</>
					) : (
						<>
							<NavLink className="m-7 text-gray-50 font-sans font-semibold" to="profile">
								Profilom
							</NavLink>
							<NavLink className="m-7 text-gray-50 font-sans font-semibold" to="/" onClick={() => handleLogout()}>
								Kijelentkezés
							</NavLink>
						</>
					)
				) : (
					<>
						<NavLink className="m-7 text-gray-50 font-sans font-semibold" to="registration">
							Regisztráció
						</NavLink>
						<NavLink className="m-7 text-gray-50 font-sans font-semibold" to="login">
							Bejelentkezés
						</NavLink>
					</>
				)}
			</nav>
			<Outlet />
		</>
	);
}
