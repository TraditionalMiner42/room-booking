import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const login = async (credentials) => {
		try {
			setIsAuthenticated(true);
		} catch (error) {}
	};

	const logout = () => {
		// Your logic to set isAuthenticated to false, usually after user logs out
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
