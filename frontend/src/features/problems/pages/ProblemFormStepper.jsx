import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Stepper, LoadingOverlay, Stack, Title, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useProblemStore } from "../../../stores/problemStore";
import { marked } from "marked";

// Subcomponents
import BasicInfoStep from "../components/form/BasicInfoStep";
import DescriptionStep from "../components/form/DescriptionStep";
import ExamplesStep from "../components/form/ExamplesStep";
import UploadFilesStep from "../components/form/UploadFilesStep";
import PreviewStep from "../components/form/PreviewStep";
import CompletedStep from "../components/form/CompletedStep";
import StepperNavigation from "../components/form/StepperNavigation";

// Utilities
import { getDifficultyColor } from "../utils/difficulty";

const ProblemFormStepper = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentProblem,
    getProblemById,
    createProblem,
    updateProblem,
    isLoading,
    isError,
    isSuccess,
    message,
    reset,
  } = useProblemStore();

  const [activeStep, setActiveStep] = useState(0);

  // Form states
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [description, setDescription] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);
  const [inputsFiles, setInputsFiles] = useState([]);
  const [outputsFiles, setOutputsFiles] = useState([]);

  // Fetch problem details if editing
  useEffect(() => {
    if (mode === "edit" && id) {
      getProblemById(id);
    }
    return () => {
      reset();
    };
  }, [mode, id, getProblemById, reset]);

  // Populate fields on edit load
  useEffect(() => {
    if (mode === "edit" && currentProblem && currentProblem.problem) {
      const prob = currentProblem.problem;
      setTitle(prob.title);
      setDifficulty(prob.difficulty || "easy");
      setDescription(prob.description);
      if (prob.testCases && prob.testCases.length > 0) {
        setTestCases(prob.testCases);
      }
    }
  }, [mode, currentProblem]);

  // Handle operation success/error notifications
  useEffect(() => {
    if (isSuccess && activeStep === (mode === "create" ? 5 : 4)) {
      notifications.show({
        title: mode === "create" ? "Problem Created" : "Problem Updated",
        message: `Successfully saved "${title}"!`,
        color: "blue",
      });
      reset();
      navigate("/problems");
    }

    if (isError) {
      notifications.show({
        title: "Operation Failed",
        message: message || "Please review fields or files.",
        color: "red",
      });
      reset();
    }
  }, [isSuccess, isError, message, reset, navigate, mode, title, activeStep]);

  const handleAddExample = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const handleRemoveExample = (idx) => {
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  const handleExampleChange = (idx, field, value) => {
    const updated = [...testCases];
    updated[idx][field] = value;
    setTestCases(updated);
  };

  // Drag and drop test files handlers
  const handleDropInputs = (files) => {
    const valid = files.filter((f) => f.name.match(/input_(\d+)/));
    const invalidCount = files.length - valid.length;

    if (invalidCount > 0) {
      notifications.show({
        title: "Invalid file name",
        message: `${invalidCount} files ignored. Input files must match the format "input_X.txt" (e.g. input_1.txt).`,
        color: "orange",
      });
    }

    setInputsFiles((prev) => [...prev, ...valid]);
  };

  const handleDropOutputs = (files) => {
    const valid = files.filter((f) => f.name.match(/output_(\d+)/));
    const invalidCount = files.length - valid.length;

    if (invalidCount > 0) {
      notifications.show({
        title: "Invalid file name",
        message: `${invalidCount} files ignored. Output files must match the format "output_X.txt" (e.g. output_1.txt).`,
        color: "orange",
      });
    }

    setOutputsFiles((prev) => [...prev, ...valid]);
  };

  const handleRemoveInputFile = (idx) => {
    setInputsFiles(inputsFiles.filter((_, i) => i !== idx));
  };

  const handleRemoveOutputFile = (idx) => {
    setOutputsFiles(outputsFiles.filter((_, i) => i !== idx));
  };

  // Compile Markdown to HTML
  const getParsedDescription = () => {
    try {
      return { __html: marked.parse(description || "") };
    } catch (e) {
      return { __html: description || "" };
    }
  };

  const handleSave = () => {
    if (!title || !description || !difficulty) {
      notifications.show({ title: "Validation Error", message: "Please fill in basic fields.", color: "red" });
      return;
    }

    if (testCases.some((tc) => !tc.input.trim() || !tc.expectedOutput.trim())) {
      notifications.show({ title: "Validation Error", message: "All example test cases must contain input and output.", color: "red" });
      return;
    }

    if (mode === "create") {
      if (inputsFiles.length === 0 || outputsFiles.length === 0) {
        notifications.show({ title: "Validation Error", message: "Please upload both input and output files.", color: "red" });
        return;
      }
      if (inputsFiles.length !== outputsFiles.length) {
        notifications.show({ title: "Validation Error", message: "Mismatched count of input and output files.", color: "red" });
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("difficulty", difficulty);
      formData.append("testCases", JSON.stringify(testCases));
      inputsFiles.forEach((f) => formData.append("inputs", f));
      outputsFiles.forEach((f) => formData.append("outputs", f));

      createProblem(formData);
    } else {
      const payload = {
        title,
        description,
        difficulty,
        testCases,
      };
      updateProblem(id, payload);
    }
  };

  const nextStep = () => {
    if (activeStep === 0 && !title.trim()) {
      notifications.show({ title: "Validation Error", message: "Please add a Title.", color: "red" });
      return;
    }
    if (activeStep === 1 && !description.trim()) {
      notifications.show({ title: "Validation Error", message: "Please write a problem description.", color: "red" });
      return;
    }
    if (activeStep === 2 && testCases.some((tc) => !tc.input.trim() || !tc.expectedOutput.trim())) {
      notifications.show({ title: "Validation Error", message: "Please fill in all examples input/output.", color: "red" });
      return;
    }
    if (mode === "create" && activeStep === 3) {
      if (inputsFiles.length === 0 || outputsFiles.length === 0) {
        notifications.show({ title: "Validation Error", message: "Upload input and output files to compile.", color: "red" });
        return;
      }
      if (inputsFiles.length !== outputsFiles.length) {
        notifications.show({ title: "Validation Error", message: "Mismatched input/output file pairs count.", color: "red" });
        return;
      }
    }
    setActiveStep((current) => current + 1);
  };

  const prevStep = () => setActiveStep((current) => current - 1);

  return (
    <Container size="xl" py="xl" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} />

      <Stack gap="xl">
        <div>
          <Title order={2} style={{ letterSpacing: "-0.5px" }}>
            {mode === "create" ? "Publish New Problem" : "Edit Coding Problem"}
          </Title>
          <Text size="sm" c="dimmed">
            Setup basic metadata, build custom description markup, and upload test execution criteria files.
          </Text>
        </div>

        <Stepper active={activeStep} onStepClick={setActiveStep} color="blue" size="sm">
          {/* Step 1: Basic Information */}
          <Stepper.Step label="Basic Information" description="Set Title and difficulty">
            <BasicInfoStep
              title={title}
              setTitle={setTitle}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          </Stepper.Step>

          {/* Step 2: Markdown Description */}
          <Stepper.Step label="Description" description="Markdown workspace">
            <DescriptionStep
              description={description}
              setDescription={setDescription}
              parsedDescription={getParsedDescription()}
            />
          </Stepper.Step>

          {/* Step 3: Examples */}
          <Stepper.Step label="Examples" description="Set visual examples">
            <ExamplesStep
              testCases={testCases}
              onAddExample={handleAddExample}
              onRemoveExample={handleRemoveExample}
              onExampleChange={handleExampleChange}
            />
          </Stepper.Step>

          {/* Step 4: Submission Files (Only in Create Mode) */}
          {mode === "create" ? (
            <Stepper.Step label="Submission Files" description="Upload compilation cases">
              <UploadFilesStep
                inputsFiles={inputsFiles}
                outputsFiles={outputsFiles}
                onDropInputs={handleDropInputs}
                onDropOutputs={handleDropOutputs}
                onRemoveInputFile={handleRemoveInputFile}
                onRemoveOutputFile={handleRemoveOutputFile}
              />
            </Stepper.Step>
          ) : null}

          {/* Step 5 / 4: Preview */}
          <Stepper.Step label="Preview" description="Verify challenge rendering">
            <PreviewStep
              title={title}
              difficulty={difficulty}
              difficultyColor={getDifficultyColor(difficulty)}
              parsedDescription={getParsedDescription()}
              testCases={testCases}
            />
          </Stepper.Step>

          {/* Final Step: Finish & Publish */}
          <Stepper.Completed>
            <CompletedStep mode={mode} />
          </Stepper.Completed>
        </Stepper>

        {/* Stepper Navigation Buttons */}
        <StepperNavigation
          activeStep={activeStep}
          mode={mode}
          isLoading={isLoading}
          onBack={prevStep}
          onNext={nextStep}
          onSave={handleSave}
        />
      </Stack>
    </Container>
  );
};

export default ProblemFormStepper;
