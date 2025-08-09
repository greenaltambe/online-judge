import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Spinner from "../components/Spinner";
import { FaList } from "react-icons/fa";
import { getProblems, reset } from "../features/problem/problemSlice";
import { toast } from "react-toastify";

const Problems = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = useSelector((state) => state.auth.user);
	const { problems, isError, isLoading, message } = useSelector(
		(state) => state.problems
	);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}

		if (isError) {
			toast.error(message);
			dispatch(reset());
		}

		dispatch(getProblems());

		return () => {
			dispatch(reset());
		};
	}, [user, navigate, isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<>
			<section className="heading">
				<h1>
					<FaList /> Problems
				</h1>
				<p>Here are all the problems</p>
			</section>

			<section className="problems">
				{problems.length > 0 ? (
					<>
						<div className="problems-header">
							<div>Problem</div>
							<div>Difficulty</div>
						</div>
						{problems.map((problem) => (
							<Link
								to={`/problems/${problem._id}`}
								key={problem._id}
								className="problem-list-item"
							>
								<h3>{problem.title}</h3>
								<p
									className={`problem-difficulty ${problem.difficulty.toLowerCase()}`}
								>
									{problem.difficulty}
								</p>
							</Link>
						))}
					</>
				) : (
					<h3 className="no-problems-message">No problems</h3>
				)}
			</section>
		</>
	);
};

export default Problems;
