import "./ProblemForm.css";
import { useEffect, useState, Fragment } from "react";
import { FaPenAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../Common/Spinner";
import { useAuthStore } from "../../stores/authStore";
import { useProblemStore } from "../../stores/problemStore";
import BasicInfoSection from "./BasicInfoSection";
import TestCaseSection from "./TestCaseSection";
import FileUploadSection from "./FileUploadSection";

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
    inputs: [],
    outputs: [],
  });
  const { title, description, difficulty, testCases } = formData;
  const user = useAuthStore((state) => state.user);
  const { createProblem, reset, isLoading, isError, isSuccess, message } = useProblemStore();

  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (hasSubmitted) {
      if (isError) {
        toast.error(message);
        reset();
        setHasSubmitted(false);
      }

      if (isSuccess) {
        toast.success("Problem created");
        reset();
        setHasSubmitted(false);
      }
    }
  }, [isError, isSuccess, message, reset, hasSubmitted]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (title === "" || description === "" || difficulty === "") {
      toast.error("Please fill in all fields");
      return;
    }

    if (
      testCases.length === 0 ||
      testCases.some((tc) => tc.input === "" || tc.expectedOutput === "")
    ) {
      toast.error("Please fill in all test cases input and expected output");
      return;
    }

    console.log("inputs selected:", formData.inputs.length);
    console.log(formData.inputs.map((f) => f.name));

    console.log("outputs selected:", formData.outputs.length);
    console.log(formData.outputs.map((f) => f.name));

    const formDataToSend = new FormData();
    formDataToSend.append("title", title);
    formDataToSend.append("description", description);
    formDataToSend.append("difficulty", difficulty);
    formDataToSend.append("testCases", JSON.stringify(testCases));

    if (formData.inputs) {
      formData.inputs.forEach((file) => formDataToSend.append("inputs", file));
    }
    if (formData.outputs) {
      formData.outputs.forEach((file) =>
        formDataToSend.append("outputs", file),
      );
    }

    setHasSubmitted(true);

    for (const [key, value] of formDataToSend.entries()) {
      console.log(key, value instanceof File ? value.name : value);
    }
    createProblem(formDataToSend);

    setFormData({
      title: "",
      description: "",
      difficulty: "",
      testCases: [{ input: "", expectedOutput: "" }],
      inputs: [],
      outputs: [],
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
    <Fragment>
      <section className="heading">
        <h1>
          <FaPenAlt /> Hi, {user && user.name}
        </h1>
        <p>Create a new problem</p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <BasicInfoSection
            title={title}
            description={description}
            difficulty={difficulty}
            onChange={onChange}
          />
          <TestCaseSection
            testCases={testCases}
            handleTestCaseChange={handleTestCaseChange}
            removeTestCase={removeTestCase}
            addTestCase={addTestCase}
          />
          <FileUploadSection
            inputs={formData.inputs}
            outputs={formData.outputs}
            setFormData={setFormData}
          />
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Create Problem
            </button>
          </div>
        </form>
      </section>
    </Fragment>
  );
}

export default ProblemForm;
