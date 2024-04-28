import { Link } from "react-router-dom";

function Navbar() {
	const navItems = [
		{
			path: "/",
			label: "Home",
		},
		{ path: "/rooms", label: "Room" },
		{ path: "/booking", label: "Booking" },
	];

	return (
		<>
			<nav className="navbar-container">
				<ul className="navbar">
					{navItems.map((items) => {
						return (
							<li key={items.label} className="nav-item">
								<Link key={items.path} to={items.path}>
									{items.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
