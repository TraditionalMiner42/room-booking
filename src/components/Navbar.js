import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.js";

function Navbar() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [activeItem, setActiveItem] = useState(null);
	const { isAuthenticated, logout } = useAuth();

	const navItems = [
		{
			path: "/",
			label: "Home",
		},
		{
			path: "/users/bookings",
			label: "My Booking",
			// dropdown: [
			// 	{ path: "/users/booking/history", label: "Booking History" },
			// 	{
			// 		path: "/users/signin",
			// 		label: "Log Out
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
								className={`px-2 sm:px-5 md:px-6 lg:px-8 py-4 relative ${
									activeItem === item.path
										? "text-slate-800"
										: "text-slate-500"
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
