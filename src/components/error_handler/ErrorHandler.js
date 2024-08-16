// useErrorHandling.js
import { useState } from "react";

export const useErrorHandling = () => {
	const [error, setError] = useState("");

	const handleError = (errorMsg) => {
		setError(errorMsg);
	};

	const clearError = () => {
		setError("");
	};

	return { error, handleError, clearError };
};
