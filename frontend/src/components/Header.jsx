import { FaSignInAlt, FaSignOutAlt, FaUser, FaList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	const onLogOut = () => {
		dispatch(logout());
		dispatch(reset());
		navigate("/");
	};

	return (
		<header className="header">
			<div className="logo">
				<Link to="/">GreenCode</Link>
			</div>
			<ul>
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
