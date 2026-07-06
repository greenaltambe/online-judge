import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import {
  Container,
  Tabs,
  ScrollArea,
  Card,
  Group,
  Button,
  Select,
  Badge,
  Text,
  Stack,
  ActionIcon,
  Switch,
  Tooltip,
  NumberInput,
  LoadingOverlay,
  Box,
  Divider,
  Drawer,
  Grid,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconSettings,
  IconPlayerPlay,
  IconCloudUpload,
  IconCheck,
  IconX,
  IconTerminal,
  IconChevronRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useProblemStore } from "../../stores/problemStore";
import { useSubmissionStore } from "../../stores/submissionStore";
import { marked } from "marked";

// Default starter templates
const templates = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    int n;\n    if (cin >> n) {\n        cout << n * 2 << endl;\n    }\n    return 0;\n}`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            System.out.println(n * 2);\n        }\n    }\n}`,
  python: `# Write your solution here\nimport sys\n\nfor line in sys.stdin:\n    val = line.strip()\n    if val:\n        print(int(val) * 2)\n`,
};

const getDifficultyColor = (diff) => {
  const d = diff?.toLowerCase();
  if (d === "easy") return "teal";
  if (d === "medium") return "orange";
  return "red";
};

const ProblemWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  // Stores
  const {
    currentProblem,
    getProblemById,
    isLoading: isProblemLoading,
    isError: isProblemError,
    message: problemMessage,
    reset: resetProblem,
  } = useProblemStore();
  const {
    runResult,
    submissionResult,
    submissions,
    getSubmissions,
    runSolution,
    submitSolution,
    isLoading: isSubmissionLoading,
    isError: isSubmissionError,
    message: submissionMessage,
    reset: resetSubmission,
  } = useSubmissionStore();

  // Left panel tabs
  const [leftTab, setLeftTab] = useState("description");

  // Code editor states
  const [language, setLanguage] = useState(
    () => localStorage.getItem(`greencode_lang_${id}`) || "cpp",
  );
  const [code, setCode] = useState(() => {
    return (
      localStorage.getItem(`greencode_code_${id}_${language}`) ||
      templates[language] ||
      ""
    );
  });

  // Monaco settings
  const theme = colorScheme === "dark" ? "vs-dark" : "light";
  const [fontSize, setFontSize] = useState(() =>
    parseInt(localStorage.getItem("greencode_editor_fontsize") || "14"),
  );
  const [wordWrap, setWordWrap] = useState(
    () => localStorage.getItem("greencode_editor_wordwrap") === "true",
  );
  const [minimap, setMinimap] = useState(
    () => localStorage.getItem("greencode_editor_minimap") === "true",
  );
  const [autocomplete, setAutocomplete] = useState(
    () => localStorage.getItem("greencode_editor_autocomplete") !== "false",
  );

  // UI state variables
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [consoleTab, setConsoleTab] = useState("run");
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [activeSubmissionCaseIndex, setActiveSubmissionCaseIndex] = useState(0);
  const [codeViewerOpen, setCodeViewerOpen] = useState(false);
  const [viewingCode, setViewingCode] = useState("");
  const [viewingLanguage, setViewingLanguage] = useState("cpp");

  // Load problem details
  useEffect(() => {
    getProblemById(id);
    getSubmissions(id);
    return () => {
      resetProblem();
      resetSubmission();
    };
  }, [id, getProblemById, getSubmissions, resetProblem, resetSubmission]);

  // Load/Save Code state
  useEffect(() => {
    localStorage.setItem(`greencode_lang_${id}`, language);
    const cachedCode = localStorage.getItem(`greencode_code_${id}_${language}`);
    if (cachedCode) {
      setCode(cachedCode);
    } else {
      setCode(templates[language] || "");
    }
  }, [language, id]);

  const handleCodeChange = (val) => {
    setCode(val || "");
    localStorage.setItem(`greencode_code_${id}_${language}`, val || "");
  };

  // Save Settings
  useEffect(() => {
    localStorage.setItem("greencode_editor_fontsize", fontSize.toString());
    localStorage.setItem("greencode_editor_wordwrap", wordWrap.toString());
    localStorage.setItem("greencode_editor_minimap", minimap.toString());
    localStorage.setItem(
      "greencode_editor_autocomplete",
      autocomplete.toString(),
    );
  }, [fontSize, wordWrap, minimap, autocomplete]);

  // Watch errors
  useEffect(() => {
    if (isProblemError) {
      notifications.show({
        title: "Workspace Error",
        message: problemMessage,
        color: "red",
      });
    }
    if (isSubmissionError) {
      notifications.show({
        title: "Execution Error",
        message: submissionMessage,
        color: "red",
      });
    }
  }, [isProblemError, problemMessage, isSubmissionError, submissionMessage]);

  // Handle run solution
  const handleRun = () => {
    setConsoleTab("run");
    setActiveTestCaseIndex(0);
    runSolution({ problemId: id, code, language });
  };

  // Handle submit solution
  const handleSubmit = () => {
    setConsoleTab("submit");
    setActiveSubmissionCaseIndex(0);
    submitSolution({ problemId: id, code, language }).then(() => {
      getSubmissions(id); // Reload history
    });
  };

  const handleOpenSubmissionCode = (sub) => {
    setViewingCode(sub.code);
    setViewingLanguage(sub.language || "cpp");
    setCodeViewerOpen(true);
  };

  // Compile markdown description
  const renderDescription = (desc) => {
    try {
      return { __html: marked.parse(desc || "") };
    } catch (e) {
      return { __html: desc || "" };
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
      }}
    >
      {/* Workspace Sub-header */}
      <Group
        justify="space-between"
        pb="xs"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate("/problems")}
          >
            Back to Problems
          </Button>
          <Divider orientation="vertical" h={20} />
          {currentProblem && (
            <>
              <Text fw={700} size="lg">
                {currentProblem.problem.title}
              </Text>
              <Badge
                color={getDifficultyColor(currentProblem.problem.difficulty)}
                variant="light"
              >
                {currentProblem.problem.difficulty}
              </Badge>
            </>
          )}
        </Group>

        <Group>
          {/* Language select */}
          <Select
            value={language}
            onChange={(val) => setLanguage(val || "cpp")}
            data={[
              { label: "C++", value: "cpp" },
              { label: "Java", value: "java" },
              { label: "Python", value: "python" },
            ]}
            style={{ width: 120 }}
          />

          {/* Settings button */}
          <Tooltip label="Editor Settings">
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setSettingsOpen(true)}
              aria-label="Editor settings"
            >
              <IconSettings size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Main Workspace Splitter */}
      <Box style={{ flexGrow: 1, position: "relative", minHeight: 0 }} mt="sm">
        <LoadingOverlay visible={isProblemLoading} />

        {currentProblem && (
          <PanelGroup direction="horizontal">
            {/* Left Panel: Description and Submissions */}
            <Panel defaultSize={40} minSize={30}>
              <Card
                h="100%"
                p={0}
                withBorder
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Tabs
                  value={leftTab}
                  onChange={setLeftTab}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Tabs.List
                    style={{
                      borderBottom:
                        "1px solid var(--mantine-color-default-border)",
                      backgroundColor: "var(--mantine-color-default-hover)",
                    }}
                    px="md"
                  >
                    <Tabs.Tab value="description">Description</Tabs.Tab>
                    <Tabs.Tab value="submissions">
                      Submissions ({submissions ? submissions.length : 0})
                    </Tabs.Tab>
                  </Tabs.List>

                  <Box
                    style={{ flexGrow: 1, overflow: "hidden", minHeight: 0 }}
                  >
                    <Tabs.Panel value="description" h="100%">
                      <ScrollArea h="100%" p="lg">
                        <Stack gap="lg">
                          {/* Markdown render */}
                          <div
                            className="markdown-body"
                            style={{
                              lineHeight: 1.6,
                              fontSize: "0.95rem",
                            }}
                            dangerouslySetInnerHTML={renderDescription(
                              currentProblem.problem.description,
                            )}
                          />

                          <Divider />

                          {/* Render Basic Example testcases */}
                          <Text fw={700} size="md" color="blue">
                            Examples
                          </Text>
                          {currentProblem.problem.testCases &&
                            currentProblem.problem.testCases.map((tc, idx) => (
                              <Card key={idx} p="md" withBorder radius="md">
                                <Text fw={600} size="sm" color="dimmed" mb="xs">
                                  Example {idx + 1}
                                </Text>
                                <Group grow align="start" gap="md">
                                  <div>
                                    <Text
                                      size="xs"
                                      fw={700}
                                      color="dimmed"
                                      mb={4}
                                    >
                                      INPUT
                                    </Text>
                                    <Box
                                      p="xs"
                                      style={{
                                        backgroundColor:
                                          "var(--mantine-color-default-hover)",
                                        border:
                                          "1px solid var(--mantine-color-default-border)",
                                        borderRadius:
                                          "var(--mantine-radius-sm)",
                                        fontFamily:
                                          "var(--mantine-font-monospace)",
                                        fontSize: "0.85rem",
                                        overflowX: "auto",
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {tc.input}
                                    </Box>
                                  </div>
                                  <div>
                                    <Text
                                      size="xs"
                                      fw={700}
                                      color="dimmed"
                                      mb={4}
                                    >
                                      EXPECTED OUTPUT
                                    </Text>
                                    <Box
                                      p="xs"
                                      style={{
                                        backgroundColor:
                                          "var(--mantine-color-default-hover)",
                                        border:
                                          "1px solid var(--mantine-color-default-border)",
                                        borderRadius:
                                          "var(--mantine-radius-sm)",
                                        fontFamily:
                                          "var(--mantine-font-monospace)",
                                        fontSize: "0.85rem",
                                        overflowX: "auto",
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {tc.expectedOutput}
                                    </Box>
                                  </div>
                                </Group>
                              </Card>
                            ))}
                        </Stack>
                      </ScrollArea>
                    </Tabs.Panel>

                    <Tabs.Panel value="submissions" h="100%">
                      <ScrollArea h="100%" p="md">
                        {submissions && submissions.length > 0 ? (
                          <Stack gap="sm">
                            {submissions.map((sub) => (
                              <Card
                                key={sub._id}
                                p="md"
                                withBorder
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => handleOpenSubmissionCode(sub)}
                              >
                                <Group justify="between">
                                  <Group gap="sm">
                                    {sub.status === "accepted" ? (
                                      <Badge
                                        color="teal"
                                        leftSection={<IconCheck size={12} />}
                                      >
                                        Accepted
                                      </Badge>
                                    ) : (
                                      <Badge
                                        color="red"
                                        leftSection={<IconX size={12} />}
                                      >
                                        Rejected
                                      </Badge>
                                    )}
                                    <Text
                                      size="xs"
                                      color="dimmed"
                                      style={{ textTransform: "uppercase" }}
                                    >
                                      {sub.language}
                                    </Text>
                                  </Group>
                                  <Text size="xs" color="dimmed">
                                    {formatTime(sub.createdAt)}
                                  </Text>
                                </Group>
                              </Card>
                            ))}
                          </Stack>
                        ) : (
                          <Stack
                            align="center"
                            justify="center"
                            h="100%"
                            py={100}
                            gap="xs"
                          >
                            <IconTerminal
                              size={32}
                              style={{ color: "var(--mantine-color-dimmed)" }}
                            />
                            <Text color="dimmed" size="sm">
                              No submissions yet for this problem.
                            </Text>
                          </Stack>
                        )}
                      </ScrollArea>
                    </Tabs.Panel>
                  </Box>
                </Tabs>
              </Card>
            </Panel>

            {/* Resize handler between description and editor workspace */}
            <PanelResizeHandle
              style={{
                width: "4px",
                backgroundColor: "var(--mantine-color-default-border)",
                cursor: "col-resize",
                margin: "0 6px",
                borderRadius: "2px",
              }}
            />

            {/* Right Panel: Editor and compiler results */}
            <Panel defaultSize={60} minSize={40}>
              <PanelGroup direction="vertical">
                {/* Editor Container */}
                <Panel defaultSize={70} minSize={50}>
                  <Card
                    h="100%"
                    p={0}
                    withBorder
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      style={{
                        flexGrow: 1,
                        position: "relative",
                        minHeight: 0,
                      }}
                    >
                      <Editor
                        height="100%"
                        language={
                          language === "cpp"
                            ? "cpp"
                            : language === "java"
                              ? "java"
                              : "python"
                        }
                        theme={theme}
                        value={code}
                        onChange={handleCodeChange}
                        options={{
                          fontSize: fontSize,
                          wordWrap: wordWrap ? "on" : "off",
                          minimap: { enabled: minimap },
                          quickSuggestions: {
                            other: autocomplete,
                            comments: autocomplete,
                            strings: autocomplete,
                          },
                          suggestOnTriggerCharacters: autocomplete,
                          lineNumbers: "on",
                          automaticLayout: true,
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </Box>

                    {/* Action Panel Footer */}
                    <Group
                      justify="end"
                      p="xs"
                      style={{
                        backgroundColor: "var(--mantine-color-default-hover)",
                        borderTop:
                          "1px solid var(--mantine-color-default-border)",
                      }}
                    >
                      <Button
                        variant="subtle"
                        color="gray"
                        leftSection={<IconPlayerPlay size={16} />}
                        onClick={handleRun}
                        loading={isSubmissionLoading}
                      >
                        Run Code
                      </Button>
                      <Button
                        color="blue"
                        leftSection={<IconCloudUpload size={16} />}
                        onClick={handleSubmit}
                        loading={isSubmissionLoading}
                      >
                        Submit
                      </Button>
                    </Group>
                  </Card>
                </Panel>

                {/* Resize handler between editor and bottom console */}
                <PanelResizeHandle
                  style={{
                    height: "4px",
                    backgroundColor: "var(--mantine-color-default-border)",
                    cursor: "row-resize",
                    margin: "6px 0",
                    borderRadius: "2px",
                  }}
                />

                {/* Console results */}
                <Panel defaultSize={30} minSize={20}>
                  <Card
                    h="100%"
                    p={0}
                    withBorder
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Tabs
                      value={consoleTab}
                      onChange={setConsoleTab}
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Tabs.List
                        style={{
                          borderBottom:
                            "1px solid var(--mantine-color-default-border)",
                          backgroundColor: "var(--mantine-color-default-hover)",
                        }}
                        px="md"
                      >
                        <Tabs.Tab
                          value="run"
                          leftSection={<IconTerminal size={14} />}
                        >
                          Console Run Results
                        </Tabs.Tab>
                        <Tabs.Tab
                          value="submit"
                          leftSection={<IconCheck size={14} />}
                        >
                          Submission Results
                        </Tabs.Tab>
                      </Tabs.List>

                      <Box
                        style={{
                          flexGrow: 1,
                          overflow: "hidden",
                          minHeight: 0,
                        }}
                      >
                        {/* Run Results Tab */}
                        <Tabs.Panel value="run" h="100%">
                          {isSubmissionLoading && consoleTab === "run" ? (
                            <Group justify="center" align="center" h="100%">
                              <Stack align="center" gap="xs">
                                <LoadingOverlay
                                  visible
                                  overlayProps={{
                                    blur: 0,
                                    color: "transparent",
                                  }}
                                />
                                <Text size="sm" color="dimmed" mt={40}>
                                  Executing compiler tests...
                                </Text>
                              </Stack>
                            </Group>
                          ) : runResult && runResult.response ? (
                            <Grid
                              gutter={0}
                              h="100%"
                              style={{ display: "flex" }}
                            >
                              {/* Case list selector */}
                              <Grid.Col
                                span={3}
                                style={{
                                  borderRight:
                                    "1px solid var(--mantine-color-default-border)",
                                  backgroundColor:
                                    "var(--mantine-color-default-hover)",
                                  height: "100%",
                                }}
                              >
                                <ScrollArea h="100%">
                                  <Stack gap={0}>
                                    {runResult.response.map((tc, idx) => (
                                      <Box
                                        key={idx}
                                        onClick={() =>
                                          setActiveTestCaseIndex(idx)
                                        }
                                        p="sm"
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor:
                                            activeTestCaseIndex === idx
                                              ? "var(--mantine-color-default)"
                                              : "transparent",
                                          borderLeft:
                                            activeTestCaseIndex === idx
                                              ? "3px solid var(--mantine-color-blue-filled)"
                                              : "3px solid transparent",
                                        }}
                                      >
                                        <Group gap="xs">
                                          {tc.passed ? (
                                            <IconCheck
                                              size={14}
                                              style={{
                                                color:
                                                  "var(--mantine-color-teal-filled)",
                                              }}
                                            />
                                          ) : (
                                            <IconX
                                              size={14}
                                              style={{
                                                color:
                                                  "var(--mantine-color-red-filled)",
                                              }}
                                            />
                                          )}
                                          <Text
                                            size="sm"
                                            fw={
                                              activeTestCaseIndex === idx
                                                ? 700
                                                : 500
                                            }
                                            color={tc.passed ? "teal" : "red"}
                                          >
                                            Case {idx + 1}
                                          </Text>
                                        </Group>
                                      </Box>
                                    ))}
                                  </Stack>
                                </ScrollArea>
                              </Grid.Col>

                              {/* Case detailed report */}
                              <Grid.Col span={9} style={{ height: "100%" }}>
                                <ScrollArea h="100%" p="md">
                                  {runResult.response[activeTestCaseIndex] && (
                                    <Stack gap="sm">
                                      <Group justify="between">
                                        <Text fw={700} size="sm">
                                          Case Details
                                        </Text>
                                        {runResult.response[activeTestCaseIndex]
                                          .passed ? (
                                          <Badge color="teal" size="sm">
                                            Passed
                                          </Badge>
                                        ) : (
                                          <Badge color="red" size="sm">
                                            Failed
                                          </Badge>
                                        )}
                                      </Group>

                                      <div>
                                        <Text size="xs" color="dimmed" mb={4}>
                                          INPUT
                                        </Text>
                                        <Box
                                          p="xs"
                                          style={{
                                            backgroundColor:
                                              "var(--mantine-color-default-hover)",
                                            border:
                                              "1px solid var(--mantine-color-default-border)",
                                            borderRadius:
                                              "var(--mantine-radius-sm)",
                                            fontFamily:
                                              "var(--mantine-font-monospace)",
                                            fontSize: "0.8rem",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {
                                            runResult.response[
                                              activeTestCaseIndex
                                            ].input
                                          }
                                        </Box>
                                      </div>

                                      <div>
                                        <Text size="xs" color="dimmed" mb={4}>
                                          EXPECTED OUTPUT
                                        </Text>
                                        <Box
                                          p="xs"
                                          style={{
                                            backgroundColor:
                                              "var(--mantine-color-default-hover)",
                                            border:
                                              "1px solid var(--mantine-color-default-border)",
                                            borderRadius:
                                              "var(--mantine-radius-sm)",
                                            fontFamily:
                                              "var(--mantine-font-monospace)",
                                            fontSize: "0.8rem",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {
                                            runResult.response[
                                              activeTestCaseIndex
                                            ].expectedOutput
                                          }
                                        </Box>
                                      </div>

                                      <div>
                                        <Text
                                          size="xs"
                                          color={
                                            runResult.response[
                                              activeTestCaseIndex
                                            ].passed
                                              ? "dimmed"
                                              : "red"
                                          }
                                          mb={4}
                                        >
                                          ACTUAL OUTPUT
                                        </Text>
                                        <Box
                                          p="xs"
                                          style={{
                                            backgroundColor:
                                              "var(--mantine-color-default-hover)",
                                            border:
                                              "1px solid var(--mantine-color-default-border)",
                                            borderRadius:
                                              "var(--mantine-radius-sm)",
                                            fontFamily:
                                              "var(--mantine-font-monospace)",
                                            fontSize: "0.8rem",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {
                                            runResult.response[
                                              activeTestCaseIndex
                                            ].output
                                          }
                                        </Box>
                                      </div>
                                    </Stack>
                                  )}
                                </ScrollArea>
                              </Grid.Col>
                            </Grid>
                          ) : (
                            <Stack
                              align="center"
                              justify="center"
                              h="100%"
                              gap="xs"
                            >
                              <IconTerminal
                                size={24}
                                style={{ color: "var(--mantine-color-dimmed)" }}
                              />
                              <Text color="dimmed" size="xs">
                                Click 'Run Code' to test your solution.
                              </Text>
                            </Stack>
                          )}
                        </Tabs.Panel>

                        {/* Submit Results Tab */}
                        <Tabs.Panel value="submit" h="100%">
                          {isSubmissionLoading && consoleTab === "submit" ? (
                            <Group justify="center" align="center" h="100%">
                              <Stack align="center" gap="xs">
                                <LoadingOverlay
                                  visible
                                  overlayProps={{
                                    blur: 0,
                                    color: "transparent",
                                  }}
                                />
                                <Text size="sm" color="dimmed" mt={40}>
                                  Submitting to Sandbox Judgement...
                                </Text>
                              </Stack>
                            </Group>
                          ) : submissionResult ? (
                            <Grid
                              gutter={0}
                              h="100%"
                              style={{ display: "flex" }}
                            >
                              {/* Left index */}
                              <Grid.Col
                                span={3}
                                style={{
                                  borderRight:
                                    "1px solid var(--mantine-color-default-border)",
                                  backgroundColor:
                                    "var(--mantine-color-default-hover)",
                                  height: "100%",
                                }}
                              >
                                <ScrollArea h="100%">
                                  <Box
                                    p="sm"
                                    style={{
                                      borderBottom:
                                        "1px solid var(--mantine-color-default-border)",
                                    }}
                                  >
                                    <Text size="xs" color="dimmed">
                                      SUBMISSION VERDICT
                                    </Text>
                                    <Badge
                                      color={
                                        submissionResult.status === "accepted"
                                          ? "teal"
                                          : "red"
                                      }
                                      fullWidth
                                      size="md"
                                      mt={5}
                                    >
                                      {submissionResult.status === "accepted"
                                        ? "Accepted"
                                        : "Wrong Answer"}
                                    </Badge>
                                  </Box>
                                  <Stack gap={0}>
                                    {submissionResult.results &&
                                      submissionResult.results.map(
                                        (tc, idx) => (
                                          <Box
                                            key={idx}
                                            onClick={() =>
                                              setActiveSubmissionCaseIndex(idx)
                                            }
                                            p="sm"
                                            style={{
                                              cursor: "pointer",
                                              backgroundColor:
                                                activeSubmissionCaseIndex ===
                                                idx
                                                  ? "var(--mantine-color-default)"
                                                  : "transparent",
                                              borderLeft:
                                                activeSubmissionCaseIndex ===
                                                idx
                                                  ? "3px solid var(--mantine-color-blue-filled)"
                                                  : "3px solid transparent",
                                            }}
                                          >
                                            <Group gap="xs">
                                              {tc.passed ? (
                                                <IconCheck
                                                  size={14}
                                                  style={{
                                                    color:
                                                      "var(--mantine-color-teal-filled)",
                                                  }}
                                                />
                                              ) : (
                                                <IconX
                                                  size={14}
                                                  style={{
                                                    color:
                                                      "var(--mantine-color-red-filled)",
                                                  }}
                                                />
                                              )}
                                              <Text
                                                size="sm"
                                                fw={
                                                  activeSubmissionCaseIndex ===
                                                  idx
                                                    ? 700
                                                    : 500
                                                }
                                              >
                                                Test Case {idx + 1}
                                              </Text>
                                            </Group>
                                          </Box>
                                        ),
                                      )}
                                  </Stack>
                                </ScrollArea>
                              </Grid.Col>

                              {/* Right details */}
                              <Grid.Col span={9} style={{ height: "100%" }}>
                                <ScrollArea h="100%" p="md">
                                  {submissionResult.results &&
                                  submissionResult.results[
                                    activeSubmissionCaseIndex
                                  ] ? (
                                    <Stack gap="sm">
                                      <Text fw={700} size="sm">
                                        Sandbox Logs
                                      </Text>

                                      <div>
                                        <Text size="xs" color="dimmed" mb={4}>
                                          INPUT
                                        </Text>
                                        <Box
                                          p="xs"
                                          style={{
                                            backgroundColor:
                                              "var(--mantine-color-default-hover)",
                                            border:
                                              "1px solid var(--mantine-color-default-border)",
                                            borderRadius:
                                              "var(--mantine-radius-sm)",
                                            fontFamily:
                                              "var(--mantine-font-monospace)",
                                            fontSize: "0.8rem",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {
                                            submissionResult.results[
                                              activeSubmissionCaseIndex
                                            ].input
                                          }
                                        </Box>
                                      </div>

                                      <div>
                                        <Text size="xs" color="dimmed" mb={4}>
                                          EXPECTED OUTPUT
                                        </Text>
                                        <Box
                                          p="xs"
                                          style={{
                                            backgroundColor:
                                              "var(--mantine-color-default-hover)",
                                            border:
                                              "1px solid var(--mantine-color-default-border)",
                                            borderRadius:
                                              "var(--mantine-radius-sm)",
                                            fontFamily:
                                              "var(--mantine-font-monospace)",
                                            fontSize: "0.8rem",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {
                                            submissionResult.results[
                                              activeSubmissionCaseIndex
                                            ].expectedOutput
                                          }
                                        </Box>
                                      </div>

                                      <div>
                                        <Text
                                          size="xs"
                                          color={
                                            submissionResult.results[
                                              activeSubmissionCaseIndex
                                            ].passed
                                              ? "dimmed"
                                              : "red"
                                          }
                                          mb={4}
                                        >
                                          ACTUAL RUNTIME OUTPUT
                                        </Text>
                                        <Box
                                          p="xs"
                                          style={{
                                            backgroundColor:
                                              "var(--mantine-color-default-hover)",
                                            border:
                                              "1px solid var(--mantine-color-default-border)",
                                            borderRadius:
                                              "var(--mantine-radius-sm)",
                                            fontFamily:
                                              "var(--mantine-font-monospace)",
                                            fontSize: "0.8rem",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {
                                            submissionResult.results[
                                              activeSubmissionCaseIndex
                                            ].output
                                          }
                                        </Box>
                                      </div>
                                    </Stack>
                                  ) : (
                                    <Text color="dimmed" size="xs" p="md">
                                      All cases executed successfully.
                                    </Text>
                                  )}
                                </ScrollArea>
                              </Grid.Col>
                            </Grid>
                          ) : (
                            <Stack
                              align="center"
                              justify="center"
                              h="100%"
                              gap="xs"
                            >
                              <IconTerminal
                                size={24}
                                style={{ color: "var(--mantine-color-dimmed)" }}
                              />
                              <Text color="dimmed" size="xs">
                                Submit solution to trigger database logs
                                verdict.
                              </Text>
                            </Stack>
                          )}
                        </Tabs.Panel>
                      </Box>
                    </Tabs>
                  </Card>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        )}
      </Box>

      {/* Editor Settings Drawer */}
      <Drawer
        opened={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Monaco Editor Preferences"
        position="right"
        size="md"
      >
        <Stack gap="lg" mt="md">
          {/* Font Size Selector */}
          <NumberInput
            label="Font Size (px)"
            value={fontSize}
            onChange={(val) => setFontSize(typeof val === "number" ? val : 14)}
            min={10}
            max={24}
          />

          {/* Word Wrap */}
          <Group justify="between">
            <div>
              <Text size="sm" fw={500}>
                Enable Word Wrap
              </Text>
              <Text size="xs" color="dimmed">
                Wrap lines that exceed screen width
              </Text>
            </div>
            <Switch
              checked={wordWrap}
              onChange={(e) => setWordWrap(e.currentTarget.checked)}
              color="blue"
            />
          </Group>

          {/* Minimap */}
          <Group justify="between">
            <div>
              <Text size="sm" fw={500}>
                Show Minimap
              </Text>
              <Text size="xs" color="dimmed">
                Display editor outline on right
              </Text>
            </div>
            <Switch
              checked={minimap}
              onChange={(e) => setMinimap(e.currentTarget.checked)}
              color="blue"
            />
          </Group>

          {/* Autocomplete */}
          <Group justify="between">
            <div>
              <Text size="sm" fw={500}>
                Smart Suggestions
              </Text>
              <Text size="xs" color="dimmed">
                Trigger code snippet autocomplete
              </Text>
            </div>
            <Switch
              checked={autocomplete}
              onChange={(e) => setAutocomplete(e.currentTarget.checked)}
              color="blue"
            />
          </Group>

          <Button
            color="blue"
            fullWidth
            onClick={() => setSettingsOpen(false)}
            mt="md"
          >
            Save Preferences
          </Button>
        </Stack>
      </Drawer>

      {/* Code Viewer Drawer for Submissions */}
      <Drawer
        opened={codeViewerOpen}
        onClose={() => setCodeViewerOpen(false)}
        title="Submitted Code Solution"
        position="right"
        size="lg"
      >
        <Box
          style={{
            height: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
          }}
          mt="md"
        >
          <Group justify="between" mb="xs">
            <Badge color="blue" variant="outline">
              Language: {viewingLanguage.toUpperCase()}
            </Badge>
            <Text size="xs" color="dimmed">
              Read-only view
            </Text>
          </Group>
          <Box
            style={{
              flexGrow: 1,
              border: "1px solid var(--mantine-color-default-border)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Editor
              height="100%"
              language={viewingLanguage}
              theme={theme}
              value={viewingCode}
              options={{
                readOnly: true,
                fontSize: fontSize,
                minimap: { enabled: false },
                lineNumbers: "on",
                automaticLayout: true,
              }}
            />
          </Box>
          <Button color="gray" onClick={() => setCodeViewerOpen(false)} mt="md">
            Close Viewer
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ProblemWorkspace;
