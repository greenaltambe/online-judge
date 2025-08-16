import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubmissions } from "../features/problem/problemSlice";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import CodeEditor from "../components/CodeEditor";
import "./styles/Submissions.css";

const Submissions = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { isLoading, isError, message, submissions } = useSelector(
		(state) => state.problems
	);

	const [visibleCodes, setVisibleCodes] = useState({});

	useEffect(() => {
		if (isError) console.log(message);
		dispatch(getSubmissions(id));
	}, [isError, message, dispatch, id]);

	const toggleCode = (submissionId) => {
		setVisibleCodes((prev) => ({
			...prev,
			[submissionId]: !prev[submissionId],
		}));
	};

	if (isLoading) return <Spinner />;

	return (
		<div className="submissions-container">
			<h2>Submissions</h2>
			{submissions && submissions.submissions.length > 0 ? (
				<ul>
					{submissions.submissions.map((sub) => (
						<li key={sub._id} className="submission-card">
							<div className="submission-info">
								<span>
									<strong>Status:</strong> {sub.status}
								</span>
								<span>
									<strong>Created At:</strong>{" "}
									{new Date(sub.createdAt).toLocaleString()}
								</span>
							</div>
							<button
								className="toggle-button"
								onClick={() => toggleCode(sub._id)}
							>
								{visibleCodes[sub._id]
									? "Hide Code"
									: "Show Code"}
							</button>
							{visibleCodes[sub._id] && sub.code && (
								<div className="code-container">
									<CodeEditor
										code={sub.code}
										setCode={() => {}}
										language={sub.language || "cpp"}
									/>
								</div>
							)}
						</li>
					))}
				</ul>
			) : (
				<p>No submissions found.</p>
			)}
		</div>
	);
};

export default Submissions;
