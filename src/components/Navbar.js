import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.js";
import { Menu } from "antd";

function Navbar() {
	const [activeItem, setActiveItem] = useState("/");
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
			//   { path: '/users/booking/history', label: 'Booking History' },
			//   {
			//     path: '/users/signin',
			//     label: 'Log Out',
			//   },
			// ],
		},
		{
			path: "/users/signin",
			label: isAuthenticated ? "Log out" : "Sign in",
		},
	];

	return (
		<Menu
			mode="horizontal"
			selectedKeys={[activeItem]}
			className="navbar-container flex justify-end fixed top-0 left-0 w-full bg-white border-b-2 border-gray-200 z-10">
			{navItems.map((item, index) => {
				return (
					<Menu.Item
						key={item.path}
						className="text-base px-8 py-4"
						onClick={() => {
							setActiveItem(item.path);
							if (item.label === "Log out") logout();
						}}>
						<Link to={item.path}>{item.label}</Link>
					</Menu.Item>
				);
			})}
		</Menu>
	);
}

export default Navbar;
