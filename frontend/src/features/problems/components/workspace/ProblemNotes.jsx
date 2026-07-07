import { useEffect, useState } from "react";
import { Box, Group, Title, Text, Textarea, Button, Loader, Center, Tooltip, Alert } from "@mantine/core";
import { IconLock, IconTrash, IconCircleCheck, IconAlertTriangle } from "@tabler/icons-react";
import { useNoteStore } from "../../../../stores/noteStore";

const formatTime = (date) => {
  if (!date) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const ProblemNotes = ({ problemId }) => {
  const {
    note,
    isLoading,
    isSaving,
    isError,
    message,
    getNote,
    saveNote,
    deleteNote,
    reset,
  } = useNoteStore();

  const [content, setContent] = useState("");
  const [status, setStatus] = useState(""); // "", "waiting", "saving", "saved", "error"
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (problemId) {
      getNote(problemId);
    }
    return () => {
      reset();
    };
  }, [problemId, getNote, reset]);

  // Sync state when note object loads from backend
  useEffect(() => {
    if (note) {
      setContent(note.content || "");
      if (note.updatedAt) {
        setLastSaved(new Date(note.updatedAt));
        setStatus("saved");
      } else {
        setLastSaved(null);
        setStatus("");
      }
    }
  }, [note]);

  // Debounced auto-save effect
  useEffect(() => {
    // Avoid saving initial fetch on mount
    if (note && content === note.content) {
      return;
    }

    setStatus("waiting");
    const delayDebounceFn = setTimeout(async () => {
      setStatus("saving");
      try {
        await saveNote(problemId, content);
        setLastSaved(new Date());
        setStatus("saved");
      } catch (err) {
        setStatus("error");
      }
    }, 1000); // 1-second debounce

    return () => clearTimeout(delayDebounceFn);
  }, [content, problemId, saveNote, note]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this note?")) {
      await deleteNote(problemId);
      setContent("");
      setStatus("");
      setLastSaved(null);
    }
  };

  const handleTextareaChange = (e) => {
    const text = e.currentTarget.value;
    if (text.length <= 5000) {
      setContent(text);
    }
  };

  if (isLoading && !note) {
    return (
      <Center py="xl" h="100%">
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <Box
      h="100%"
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--mantine-color-body)",
        padding: "16px",
      }}
    >
      {/* Header section */}
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <Title order={3} size="h4" fw={700}>
            My Notes
          </Title>
          <Tooltip label="Notes are strictly private to your account. No one else can see them." withArrow>
            <Box style={{ display: "flex", alignItems: "center", cursor: "help" }}>
              <IconLock size={16} style={{ color: "var(--mantine-color-dimmed)" }} />
            </Box>
          </Tooltip>
        </Group>

        {content && (
          <Button
            size="xs"
            variant="subtle"
            color="red"
            leftSection={<IconTrash size={14} />}
            onClick={handleDelete}
          >
            Delete Note
          </Button>
        )}
      </Group>

      {isError && (
        <Alert icon={<IconAlertTriangle size={16} />} title="Sync Error" color="red" radius="md" mb="sm">
          {message || "We encountered an issue saving your note details."}
        </Alert>
      )}

      {/* Editor text area taking remaining space */}
      <Textarea
        placeholder="Write down your solution ideas, complexity analysis, or private notes here..."
        value={content}
        onChange={handleTextareaChange}
        style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        styles={{
          wrapper: { flexGrow: 1, display: "flex", flexDirection: "column" },
          input: { flexGrow: 1, resize: "none", fontFamily: "var(--mantine-font-family-monospace)" },
        }}
        mb="sm"
      />

      {/* Bottom status bar */}
      <Group justify="space-between" align="center" style={{ borderTop: "1px solid var(--mantine-color-default-border)", paddingTop: "12px" }}>
        {/* Save Status indicators */}
        <Box>
          {status === "waiting" && (
            <Text size="xs" c="dimmed" fw={500}>
              Typing...
            </Text>
          )}
          {status === "saving" && (
            <Group gap={4} align="center">
              <Loader size={10} color="blue" />
              <Text size="xs" c="blue" fw={600}>
                Saving...
              </Text>
            </Group>
          )}
          {status === "saved" && lastSaved && (
            <Group gap={4} align="center">
              <IconCircleCheck size={14} style={{ color: "var(--mantine-color-teal-filled)" }} />
              <Text size="xs" c="dimmed" fw={500}>
                Saved at {formatTime(lastSaved)}
              </Text>
            </Group>
          )}
          {status === "error" && (
            <Text size="xs" c="red" fw={700}>
              Auto-save failed!
            </Text>
          )}
        </Box>

        {/* Character Count */}
        <Text size="xs" c={content.length >= 4800 ? "red" : "dimmed"} fw={600}>
          {content.length} / 5000 characters
        </Text>
      </Group>
    </Box>
  );
};

export default ProblemNotes;
