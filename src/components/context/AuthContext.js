import React, { createContext, useContext, useEffect, useState } from "react";
import { signInCurrentUser } from "../../api/DataService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState({
		isAuthenticated: false,
		token: null,
	});

	//
	const login = (username, password) => {
		try {
			const response = signInCurrentUser(username, password);
			const token = response.data.jwtAccessToken;
			// Set token with localStorage after API request
			localStorage.setItem("accessToken", token);
			setAuthState({
				isAuthenticated: true,
				token: token,
			});
		} catch (error) {
			console.log(error.message);
			if (error.message) {
				throw Error(error.message);
			}
		}
	};

	const logout = () => {
		// Set isAuthenticated to false, usually after user logs out
		localStorage.removeItem("accessToken");
		setAuthState({
			isAuthenticated: false,
			token: null,
		});
	};

	// Function to check authentication status based on token presence
	const checkAuth = () => {
		const token = localStorage.getItem("accessToken");
		return !!token; // Convert token presence to boolean
	};

	useEffect(() => {
		// Initialize authentication state
		setAuthState({
			isAuthenticated: checkAuth(),
			token: localStorage.getItem("accessToken"),
		});
	}, []); // Empty dependency array to run only once on mount

	return (
		// Values can be used across other components
		<AuthContext.Provider value={{ ...authState, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
