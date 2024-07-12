import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getLoggedInUser } from "./state/authSlice";

// eslint-disable-next-line react/prop-types
export function RequireAuth({ children }) {
	const loggedInUser = useSelector(getLoggedInUser);

	if (!loggedInUser) {
		return <Navigate to="/" replace />;
	}

	return children;
}
