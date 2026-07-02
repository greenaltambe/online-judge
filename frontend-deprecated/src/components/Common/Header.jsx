import "./Header.css";
import { FaSignInAlt, FaSignOutAlt, FaUser, FaList } from "react-icons/fa";
import { CiLight, CiDark } from "react-icons/ci";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useProblemStore } from "../../stores/problemStore";
import { useSubmissionStore } from "../../stores/submissionStore";
import { useEffect, useState } from "react";

const Header = () => {
	const [theme, setTheme] = useState(
		localStorage.getItem("theme") || "light"
	);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	const navigate = useNavigate();
	const { user, logout } = useAuthStore();
	const resetProblems = useProblemStore((state) => state.reset);
	const resetSubmissions = useSubmissionStore((state) => state.reset);

	const onLogOut = () => {
		logout();
		resetProblems();
		resetSubmissions();
		toast.success("Logged out successfully");
		navigate("/");
	};

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<header className="header">
			<div className="logo">
				<Link to="/">GreenCode</Link>
			</div>
			<ul>
				<li>
					<button onClick={toggleTheme} className="btn btn-theme">
						{theme === "light" ? <CiDark /> : <CiLight />}
					</button>
				</li>
				{user ? (
					<>
						<li>
							<Link to="/problems">
								<FaList /> Problems
							</Link>
						</li>
						<li>
							<button className="btn" onClick={onLogOut}>
								<FaSignOutAlt /> Logout
							</button>
						</li>
					</>
				) : (
					<>
						<li>
							<Link to={"/login"}>
								<FaSignInAlt /> Login
							</Link>
						</li>
						<li>
							<Link to={"/register"}>
								<FaUser /> Register
							</Link>
						</li>
					</>
				)}
			</ul>
		</header>
	);
};

export default Header;
