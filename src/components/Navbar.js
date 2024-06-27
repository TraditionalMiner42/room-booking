import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
	const navigate = useNavigate();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [activeItem, setActiveItem] = useState(null);

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
			label: "Log out",
		},
	];

	return (
		<>
			<nav className="navbar-container">
				<ul className="navbar">
					{navItems.map((item) => {
						return (
							<Link
								className={`nav-item ${
									activeItem === item.path ? "active" : ""
								}`}
								to={item.path}
								onClick={() => setActiveItem(item.path)}>
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
