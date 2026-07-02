import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Stepper, Button, Group, TextInput, Select, Textarea, Card, Text, Title, Grid, Divider, ActionIcon, List, ThemeIcon, Box, LoadingOverlay, Alert, Stack, ScrollArea, Badge } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconFile, IconX, IconPlus, IconTrash, IconCheck, IconChevronRight, IconChevronLeft, IconAlertCircle } from "@tabler/icons-react";
import { useProblemStore } from "../../stores/problemStore";
import { marked } from "marked";

const getDifficultyColor = (diff) => {
  const d = diff?.toLowerCase();
  if (d === "easy") return "teal";
  if (d === "medium") return "orange";
  return "red";
};

const ProblemFormStepper = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProblem, getProblemById, createProblem, updateProblem, isLoading, isError, isSuccess, message, reset } = useProblemStore();

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
    // Filter and validate files matching input_(\d+)
    const valid = files.filter(f => f.name.match(/input_(\d+)/));
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
    // Filter and validate files matching output_(\d+)
    const valid = files.filter(f => f.name.match(/output_(\d+)/));
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
    // Validations
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

      // Build Multipart Form Data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("difficulty", difficulty);
      formData.append("testCases", JSON.stringify(testCases));
      inputsFiles.forEach((f) => formData.append("inputs", f));
      outputsFiles.forEach((f) => formData.append("outputs", f));

      createProblem(formData);
    } else {
      // Edit problem sends JSON payload
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
          <Text size="sm" color="dimmed">
            Setup basic metadata, build custom description markup, and upload test execution criteria files.
          </Text>
        </div>

        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          color="blue"
          size="sm"
        >
          {/* Step 1: Basic Information */}
          <Stepper.Step label="Basic Information" description="Set Title and difficulty">
            <Card mt="xl" p="lg" withBorder radius="md">
              <Stack gap="md">
                <TextInput
                  label="Problem Title"
                  placeholder="e.g. FizzBuzz, Add Two Numbers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <Select
                  label="Difficulty Rating"
                  value={difficulty}
                  onChange={(val) => setDifficulty(val || "easy")}
                  data={[
                    { label: "Easy", value: "easy" },
                    { label: "Medium", value: "medium" },
                    { label: "Hard", value: "hard" },
                  ]}
                />
              </Stack>
            </Card>
          </Stepper.Step>

          {/* Step 2: Markdown Description */}
          <Stepper.Step label="Description" description="Markdown workspace">
            <Grid mt="xl" gutter="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card h="100%" p="md" withBorder radius="md">
                  <Text fw={600} size="sm" color="blue" mb={5}>Markdown Editor</Text>
                  <Textarea
                    placeholder="Write problem details using Github flavored Markdown syntax..."
                    minRows={12}
                    maxRows={20}
                    autosize
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{ fontFamily: "var(--mantine-font-monospace)" }}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card h="100%" p="md" withBorder radius="md" style={{ minHeight: 280 }}>
                  <Text fw={600} size="sm" color="blue" mb="md">Live Preview</Text>
                  <ScrollArea h={300}>
                    <div
                      className="markdown-body"
                      style={{ lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={getParsedDescription()}
                    />
                  </ScrollArea>
                </Card>
              </Grid.Col>
            </Grid>
          </Stepper.Step>

          {/* Step 3: Examples */}
          <Stepper.Step label="Examples" description="Set visual examples">
            <Stack gap="md" mt="xl">
              {testCases.map((tc, idx) => (
                <Card key={idx} p="md" withBorder radius="md">
                  <Group justify="between" mb="xs">
                    <Text fw={600} size="sm" color="blue">Example #{idx + 1}</Text>
                    {testCases.length > 1 && (
                      <ActionIcon variant="light" color="red" onClick={() => handleRemoveExample(idx)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                  <Grid>
                    <Grid.Col span={6}>
                      <Textarea
                        label="Example Input"
                        placeholder="e.g. 5"
                        value={tc.input}
                        onChange={(e) => handleExampleChange(idx, "input", e.target.value)}
                        required
                        minRows={3}
                        style={{ fontFamily: "var(--mantine-font-monospace)" }}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Textarea
                        label="Expected Output"
                        placeholder="e.g. 10"
                        value={tc.expectedOutput}
                        onChange={(e) => handleExampleChange(idx, "expectedOutput", e.target.value)}
                        required
                        minRows={3}
                        style={{ fontFamily: "var(--mantine-font-monospace)" }}
                      />
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}

              <Button
                variant="light"
                color="blue"
                onClick={handleAddExample}
                leftSection={<IconPlus size={16} />}
                style={{ alignSelf: "start" }}
              >
                Add Example Case
              </Button>
            </Stack>
          </Stepper.Step>

          {/* Step 4: Submission Files (Only in Create Mode) */}
          {mode === "create" ? (
            <Stepper.Step label="Submission Files" description="Upload compilation cases">
              <Stack gap="md" mt="xl">
                <Alert color="blue" icon={<IconAlertCircle size={16} />}>
                  Please upload paired input/output testcase files. Files must be named strictly as: 
                  <strong>input_1.txt / output_1.txt</strong>, <strong>input_2.txt / output_2.txt</strong> etc.
                </Alert>

                <Grid gutter="xl">
                  {/* Inputs Dropzone */}
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card p="md" withBorder radius="md">
                      <Text fw={600} size="sm" mb="xs" color="dimmed">Input Files (input_*.txt)</Text>
                      <Dropzone onDrop={handleDropInputs} maxFiles={20} accept={["text/plain"]} style={{ border: "2px dashed var(--mantine-color-default-border)", padding: "1.5rem", borderRadius: "8px", textAlign: "center", cursor: "pointer" }}>
                        <Group justify="center" gap="sm">
                          <IconUpload size={24} style={{ color: "var(--mantine-color-blue-filled)" }} />
                          <div>
                            <Text size="sm" inline>Drag & drop or Click to choose input files</Text>
                            <Text size="xs" color="dimmed" inline mt={5}>Supports text plain format up to 20 files</Text>
                          </div>
                        </Group>
                      </Dropzone>

                      {inputsFiles.length > 0 && (
                        <List mt="md" spacing="xs" size="sm">
                          {inputsFiles.map((file, idx) => (
                            <List.Item
                              key={idx}
                              icon={
                                <ThemeIcon color="blue" size={20} radius="xl">
                                  <IconFile size={12} />
                                </ThemeIcon>
                              }
                            >
                              <Group justify="between" style={{ display: "inline-flex", width: "calc(100% - 24px)" }}>
                                <Text size="xs" truncate>{file.name}</Text>
                                <ActionIcon size="xs" color="red" variant="subtle" onClick={() => handleRemoveInputFile(idx)}>
                                  <IconX size={12} />
                                </ActionIcon>
                              </Group>
                            </List.Item>
                          ))}
                        </List>
                      )}
                    </Card>
                  </Grid.Col>

                  {/* Outputs Dropzone */}
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card p="md" withBorder radius="md">
                      <Text fw={600} size="sm" mb="xs" color="dimmed">Output Files (output_*.txt)</Text>
                      <Dropzone onDrop={handleDropOutputs} maxFiles={20} accept={["text/plain"]} style={{ border: "2px dashed var(--mantine-color-default-border)", padding: "1.5rem", borderRadius: "8px", textAlign: "center", cursor: "pointer" }}>
                        <Group justify="center" gap="sm">
                          <IconUpload size={24} style={{ color: "var(--mantine-color-blue-filled)" }} />
                          <div>
                            <Text size="sm" inline>Drag & drop or Click to choose output files</Text>
                            <Text size="xs" color="dimmed" inline mt={5}>Supports text plain format up to 20 files</Text>
                          </div>
                        </Group>
                      </Dropzone>

                      {outputsFiles.length > 0 && (
                        <List mt="md" spacing="xs" size="sm">
                          {outputsFiles.map((file, idx) => (
                            <List.Item
                              key={idx}
                              icon={
                                <ThemeIcon color="blue" size={20} radius="xl">
                                  <IconFile size={12} />
                                </ThemeIcon>
                              }
                            >
                              <Group justify="between" style={{ display: "inline-flex", width: "calc(100% - 24px)" }}>
                                <Text size="xs" truncate>{file.name}</Text>
                                <ActionIcon size="xs" color="red" variant="subtle" onClick={() => handleRemoveOutputFile(idx)}>
                                  <IconX size={12} />
                                </ActionIcon>
                              </Group>
                            </List.Item>
                          ))}
                        </List>
                      )}
                    </Card>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Stepper.Step>
          ) : null}

          {/* Step 5 / 4: Preview */}
          <Stepper.Step label="Preview" description="Verify challenge rendering">
            <Card mt="xl" p="lg" withBorder radius="md">
              <Stack gap="md">
                <div>
                  <Text size="xs" color="dimmed" fw={700}>TITLE PREVIEW</Text>
                  <Title order={3} mt={2}>{title || "Untitled Problem"}</Title>
                  <Badge color={getDifficultyColor(difficulty)} mt="xs">{difficulty}</Badge>
                </div>

                <Divider />

                <div>
                  <Text size="xs" color="dimmed" fw={700} mb="xs">DESCRIPTION PREVIEW</Text>
                  <Card p="md" withBorder radius="md">
                    <div
                      className="markdown-body"
                      style={{ lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={getParsedDescription()}
                    />
                  </Card>
                </div>

                <div>
                  <Text size="xs" color="dimmed" fw={700} mb="xs">EXAMPLES PREVIEW</Text>
                  {testCases.map((tc, idx) => (
                    <Card key={idx} p="xs" mt="xs" withBorder>
                      <Text size="xs" fw={700} color="blue">Example #{idx + 1}</Text>
                      <Text size="xs" color="dimmed" mt={4}>Input: {tc.input}</Text>
                      <Text size="xs" color="dimmed">Output: {tc.expectedOutput}</Text>
                    </Card>
                  ))}
                </div>
              </Stack>
            </Card>
          </Stepper.Step>

          {/* Final Step: Finish & Publish */}
          <Stepper.Completed>
            <Card mt="xl" p="xl" style={{ textAlign: "center" }} withBorder radius="md">
              <ThemeIcon color="blue" size={50} radius="xl" mx="auto" mb="md">
                <IconCheck size={30} />
              </ThemeIcon>
              <Title order={3}>Form Complete!</Title>
              <Text size="sm" color="dimmed" mt="xs" maxw={450} mx="auto">
                {mode === "create" 
                  ? "All example cases loaded and sandbox file uploads configured. Click Save below to publish to the platform." 
                  : "All properties have been modified. Click Save below to update in the database."}
              </Text>
            </Card>
          </Stepper.Completed>
        </Stepper>

        {/* Stepper Navigation Buttons */}
        <Group justify="end" mt="xl" style={{ borderTop: "1px solid var(--mantine-color-default-border)", paddingTop: "1rem" }}>
          {activeStep > 0 && (
            <Button variant="subtle" color="gray" leftSection={<IconChevronLeft size={16} />} onClick={prevStep}>
              Back
            </Button>
          )}

          {activeStep < (mode === "create" ? 5 : 4) ? (
            <Button color="blue" rightSection={<IconChevronRight size={16} />} onClick={nextStep}>
              Next Step
            </Button>
          ) : (
            <Button color="blue" onClick={handleSave} loading={isLoading}>
              Save Problem
            </Button>
          )}
        </Group>
      </Stack>
    </Container>
  );
};

export default ProblemFormStepper;
