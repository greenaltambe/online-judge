import "./Problems.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "../../components/Common/Spinner";
import { FaList } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { useProblemStore } from "../../stores/problemStore";
import { toast } from "react-toastify";

const Problems = () => {
	const navigate = useNavigate();

	const user = useAuthStore((state) => state.user);
	const { problems, getProblems, reset, isError, isLoading, message } = useProblemStore();

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		if (isError) {
			toast.error(message);
			reset();
		}

		getProblems();

		return () => {
			reset();
		};
	}, [user, navigate, isError, message, getProblems, reset]);

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
