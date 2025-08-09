import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPenAlt } from "react-icons/fa";
import { createProblem, reset } from "../features/problem/problemSlice";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

function ProblemForm() {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		difficulty: "",
	});
	const { title, description, difficulty } = formData;
	const { user } = useSelector((state) => state.auth);
	const { isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.problems
	);

	const dispatch = useDispatch();

	const [hasSubmitted, setHasSubmitted] = useState(false);

	useEffect(() => {
		if (hasSubmitted) {
			if (isError) {
				toast.error(message);
				dispatch(reset());
				setHasSubmitted(false);
			}

			if (isSuccess) {
				toast.success("Problem created");
				dispatch(reset());
				setHasSubmitted(false);
			}
		}
	}, [isError, isSuccess, message, dispatch, hasSubmitted]);

	const onSubmit = (e) => {
		e.preventDefault();

		if (title === "" || description === "" || difficulty === "") {
			toast.error("Please fill in all fields");
			return;
		}

		const problemData = { title, description, difficulty };

		setHasSubmitted(true);
		dispatch(createProblem(problemData));

		setFormData({
			title: "",
			description: "",
			difficulty: "",
		});
	};

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (!user) {
		return <Spinner />;
	}

	return (
		<>
			<section className="heading">
				<h1>
					<FaPenAlt /> Hi, {user && user.name}
				</h1>
				<p>Create a new problem</p>
			</section>

			<section className="form">
				<form onSubmit={onSubmit}>
					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input
							type="text"
							className="form-control"
							id="title"
							name="title"
							value={title}
							onChange={onChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="description">Description</label>
						<textarea
							name="description"
							id="description"
							rows="5"
							value={description}
							onChange={onChange}
						></textarea>
					</div>

					<div className="form-group">
						<label htmlFor="difficulty">Difficulty</label>
						<select
							name="difficulty"
							id="difficulty"
							value={difficulty}
							onChange={onChange}
							className="form-control"
						>
							<option value="">-- Select Difficulty --</option>
							<option value="easy">Easy</option>
							<option value="medium">Medium</option>
							<option value="hard">Hard</option>
						</select>
					</div>

					<div className="form-group">
						<button type="submit" className="btn btn-block">
							Create Problem
						</button>
					</div>
				</form>
			</section>
		</>
	);
}

export default ProblemForm;
