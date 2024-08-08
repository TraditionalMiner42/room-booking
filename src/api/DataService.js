import axiosInstance from "../axiosInstance.js";

const getSection = async () => {
	try {
		const response = await axiosInstance.get("/users/get_sections");
		return response;
	} catch (error) {
		if (error.response.status === 400) {
			throw new Error("Failed to get section data");
		}
	}
};

const getDivision = async () => {
	try {
		const response = await axiosInstance.get("/users/get_divisions");
		return response;
	} catch (error) {
		if (error.response.status === 400) {
			throw new Error("Failed to get division data");
		}
	}
};

const getCurrentSignInUser = async (username) => {
	try {
		const response = await axiosInstance.get("/users/get_user_name", {
			params: { username },
		});
		return response;
	} catch (error) {
		throw error;
	}
};

const signInCurrentUser = async (username, password) => {
	try {
		const response = await axiosInstance.post("/users/signin", {
			username,
			password,
		});

		console.log("Signed-in user: ", response);
		return response;
	} catch (error) {
		console.log("error: ", error);
		// Check if the error has a response object
		if (error.response) {
			if (error.response.status === 400) {
				throw new Error("Invalid username or password");
			} else {
				throw new Error(
					`Sign-in failed with status code ${error.response.status}`
				);
			}
		} else if (error.request) {
			// The request was made but no response was received
			throw new Error("No response received from the server");
		} else {
			// Something happened in setting up the request
			throw new Error(`Error in request setup: ${error.message}`);
		}
	}
};

const signUpUser = async (
	empId = null,
	fullname = null,
	division = null,
	section = null,
	username,
	password,
	checkUsername = false
) => {
	try {
		if (checkUsername) {
			// Check if username exists
			const response = await axiosInstance.post(
				"/users/signup/check_username",
				{ username }
			);
			return response;
		} else {
			// Perform actual signup
			const response = await axiosInstance.post("/users/signup", {
				empId,
				fullname,
				division,
				section,
				username,
				password,
			});
			return response;
		}
	} catch (error) {
		if (error.response && error.response.status === 409) {
			// Handle 409 conflict error for existing username
			throw new Error("Username already exists");
		}
		throw new Error("Failed to sign up");
	}
};

const fetchGetRooms = async () => {
	try {
		const response = await axiosInstance.get("/users/get_rooms");
		console.log("Rooms response:", response.data.rooms); // Check response data
		return response.data.rooms;
	} catch (error) {
		console.error("Error fetching rooms: ", error);
		throw error;
	}
};

const fetchGetBookings = async () => {
	try {
		const response = await axiosInstance.get("/users/get_bookings");
		console.log(response.data.bookings);
		return response.data.bookings;
	} catch (error) {
		console.error("Error fetching bookings: ", error);
		throw error;
	}
};

const fetchGetSignedInUser = async () => {
	try {
		const response = await axiosInstance.get("/users/get_user");
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching signed-in user: ", error);
		throw error;
	}
};

const fetchUserBookings = async (user) => {
	const params = {
		userId: user.user_id,
	};
	try {
		const response = await axiosInstance.get("/users/get_user_bookings", {
			params,
		});
		return response.data.bookings;
	} catch (error) {
		console.error("Error fetching user bookings: ", error);
		throw error;
	}
};

const fetchPostForm = async (formData) => {
	try {
		console.log("form data: ", formData);
		const response = await axiosInstance.post("/", {
			modifiedFormValues: formData,
		});
		return response;
	} catch (error) {
		console.error("Error fetching submitting the form: ", error);
		throw error;
	}
};

const insertParticipantsAndBeverages = async (meal, bookingId, editedTopic) => {
	try {
		const response = await axiosInstance.post("/users/add_more", {
			meal,
			bookingId,
			editedTopic,
		});
		return response;
	} catch (error) {
		console.log(
			"Error insert participants and beverages to particular booking: ",
			error
		);
		throw error;
	}
};

const getParticipantsAndBeverage = async () => {
	try {
		const response = await axiosInstance.get("/users/get_break_details");
		return response;
	} catch (error) {
		console.log(
			"Error get participants and beverages of particular booking: ",
			error
		);
		throw error;
	}
};

const deleteBookingFromTable = async (bookingId) => {
	try {
		const response = await axiosInstance.delete(
			`/users/delete_booking/${bookingId}`
		);
		return response;
	} catch (error) {
		console.log("Error delete selected booking: ", error);
		throw error;
	}
};

export {
	getSection,
	getDivision,
	getCurrentSignInUser,
	signInCurrentUser,
	signUpUser,
	fetchGetRooms,
	fetchGetBookings,
	fetchPostForm,
	fetchGetSignedInUser,
	fetchUserBookings,
	insertParticipantsAndBeverages,
	getParticipantsAndBeverage,
	deleteBookingFromTable,
};
