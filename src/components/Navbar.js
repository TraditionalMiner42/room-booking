import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.js";

function Navbar() {
	const navigate = useNavigate();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [activeItem, setActiveItem] = useState(null);
	const { isAuthenticated, logout } = useAuth();

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const navItems = [
		{
			path: "/",
			label: "Home",
		},
		{ path: "/users/rooms", label: "Book a Room" },
		{
			path: "/users/bookings",
			label: "My Booking",
			// dropdown: [
			// 	{ path: "/users/booking/history", label: "Booking History" },
			// 	{
			// 		path: "/users/signin",
			// 		label: "Log Out",
			// 	},
			// ],
		},
		{
			path: "/users/signin",
			label: isAuthenticated ? `Log out` : `Sign in`,
		},
	];

	// useEffect(() => console.log("isLogin: ", checkAuth));

	return (
		<>
			<nav className="navbar-container fixed top-0 left-0 w-full mb-14 bg-white border-b-2 border-gray-200 z-10">
				<ul className="flex justify-end">
					{navItems.map((item, index) => {
						return (
							<Link
								key={index}
								className={`nav-item ${
									activeItem === item.path ? "active" : ""
								}`}
								to={item.path}
								onClick={() => {
									setActiveItem(item.path);
									item.label === "Log out" && logout();
								}}>
								{item.label}
							</Link>
						);
					})}
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
