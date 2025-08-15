import "./styles/ProblemForm.css";
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
		testCases: [
			{
				input: "",
				expectedOutput: "",
			},
		],
	});
	const { title, description, difficulty, testCases } = formData;
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

		if (
			testCases.length === 0 ||
			testCases.some((testCase) => {
				testCase.input === "" || testCase.expectedOutput === "";
			})
		) {
			toast.error(
				"Please fill in all test cases input and expected output"
			);
			return;
		}

		const problemData = { title, description, difficulty, testCases };

		setHasSubmitted(true);
		dispatch(createProblem(problemData));

		setFormData({
			title: "",
			description: "",
			difficulty: "",
			testCases: [
				{
					input: "",
					expectedOutput: "",
				},
			],
		});
	};

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const handleTestCaseChange = (index, e) => {
		const { name, value } = e.target;
		const updatedTestCases = [...testCases];
		updatedTestCases[index][name] = value;
		setFormData({ ...formData, testCases: updatedTestCases });
	};

	const addTestCase = () => {
		setFormData({
			...formData,
			testCases: [...testCases, { input: "", expectedOutput: "" }],
		});
	};

	const removeTestCase = (index) => {
		const updatedTestCases = testCases.filter((_, i) => i !== index);
		setFormData({ ...formData, testCases: updatedTestCases });
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
						<label>Test Cases</label>
						{testCases.map((tc, index) => (
							<div key={index} className="testcase-row">
								<textarea
									name="input"
									placeholder="Input"
									value={tc.input}
									onChange={(e) =>
										handleTestCaseChange(index, e)
									}
								/>
								<textarea
									name="expectedOutput"
									placeholder="Expected Output"
									value={tc.expectedOutput}
									onChange={(e) =>
										handleTestCaseChange(index, e)
									}
								/>
								<button
									type="button"
									onClick={() => removeTestCase(index)}
									className="btn"
								>
									Remove
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={addTestCase}
							className="btn"
						>
							+ Add Test Case
						</button>
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
