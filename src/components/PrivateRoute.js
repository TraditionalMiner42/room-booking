// 2. PrivateRoute.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.js";

const PrivateRoute = ({ children, ...rest }) => {
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	return (
		// <Route
		// 	{...rest}
		// 	render={(props) =>
		// 		isAuthenticated ? (
		// 			<Component {...props} />
		// 		) : (
		// 			navigate("/users/signin")
		// 		)
		// 	}
		// />
		// <Route
		// 	{...rest}
		// 	element={isAuthenticated ? <Element /> : navigate("/users/signin")}
		// />
		isAuthenticated ? children : navigate("/users/signin")
	);
};

export default PrivateRoute;
