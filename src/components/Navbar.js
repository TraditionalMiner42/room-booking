import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
	const navigate = useNavigate();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
			dropdown: [
				{ path: "/users/booking/history", label: "Booking History" },
				{
					path: "/users/signin",
					label: "Log Out",
				},
			],
		},
	];

	return (
		<>
			<nav className="navbar-container">
				<ul className="navbar">
					{navItems.map((item) => {
						return (
							// <li key={item.label} className="nav-item">
							<>
								{item.dropdown ? (
									<button
										className="nav-item float-left"
										onMouseEnter={toggleDropdown}
										onMouseLeave={toggleDropdown}
									>
										{item.label}

										<div
											className={`dropdown-menu ${
												isDropdownOpen ? "open" : ""
											}`}
										>
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
										</div>
									</button>
								) : (
									<Link className="nav-item" to={item.path}>
										{item.label}
									</Link>
								)}
							</>
							// </li>
						);
					})}
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
