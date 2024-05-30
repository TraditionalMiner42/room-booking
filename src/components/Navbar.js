import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
	const navigate = useNavigate();

	const logOut = () => {
		localStorage.removeItem("accessToken");
		navigate("/users/signin");
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
			dropdown: [
				{ path: "/users/booking/history", label: "Booking History" },
				{ path: "/users/booking/upcoming", label: "Upcoming Bookings" },
				{ path: "/users/logout", label: "Log Out", action: logOut() },
			],
		},
	];

	return (
		<>
			<nav className="navbar-container">
				<ul className="navbar">
					{navItems.map((item) => {
						return (
							<li key={item.label} className="nav-item">
								{/* <Link key={items.path} to={items.path}>
									{items.label}
								</Link> */}
								{item.dropdown ? (
									<div className="dropdown">
										<span className="dropdown-toggle cursor-pointer">
											{item.label}
										</span>

										<ul className="dropdown-menu">
											{item.dropdown.map(
												(dropdownItem) => (
													<li key={dropdownItem.path}>
														{dropdownItem.path ? (
															<Link
																to={
																	dropdownItem.path
																}
															>
																{
																	dropdownItem.label
																}
															</Link>
														) : (
															<span
																onClick={
																	dropdownItem.action
																}
															>
																{
																	dropdownItem.label
																}
															</span>
														)}
													</li>
												)
											)}
										</ul>
									</div>
								) : (
									<Link to={item.path}>{item.label}</Link>
								)}
							</li>
						);
					})}
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
