// UserContext.js
import React, { createContext, useState } from "react";
import usersData from "../users/users.js"; // Import the users data

// Create the context
export const UserContext = createContext();

// Create the provider
export const UserProvider = ({ children }) => {
	const [foundUser, setFoundUser] = useState(null);

	return (
		<UserContext.Provider
			value={{ foundUser, setFoundUser, users: usersData }}
		>
			{children}
		</UserContext.Provider>
	);
};
