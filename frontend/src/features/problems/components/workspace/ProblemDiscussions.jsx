import { useEffect, useState } from "react";
import { Stack, Box, Title, Text, Textarea, Button, Loader, Center, Alert } from "@mantine/core";
import { IconMessage, IconAlertCircle } from "@tabler/icons-react";
import { useDiscussionStore } from "../../../../stores/discussionStore";
import { useAuthStore } from "../../../../stores/authStore";
import DiscussionItem from "./DiscussionItem";

const ProblemDiscussions = ({ problemId }) => {
  const { user } = useAuthStore();
  const {
    discussions,
    isLoading,
    isError,
    message,
    getDiscussions,
    addComment,
    editComment,
    deleteComment,
    voteComment,
    reset,
  } = useDiscussionStore();

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (problemId) {
      getDiscussions(problemId);
    }
    return () => {
      reset();
    };
  }, [problemId, getDiscussions, reset]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    await addComment(problemId, { content: newComment });
    setNewComment("");
  };

  const handleAddReply = async (content, parentId) => {
    await addComment(problemId, { content, parentId });
  };

  const handleEditComment = async (commentId, content) => {
    await editComment(problemId, commentId, content);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(problemId, commentId);
  };

  const handleVoteComment = async (commentId) => {
    await voteComment(problemId, commentId);
  };

  return (
    <Box
      h="100%"
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--mantine-color-body)",
      }}
    >
      {/* Scrollable Discussions List */}
      <Box style={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Title order={3} size="h4" fw={700} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <IconMessage size={20} style={{ color: "var(--mantine-color-blue-filled)" }} />
              Discussions ({discussions.length})
            </Title>
          </Group>

          {isError && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" radius="md">
              {message || "Could not retrieve discussion comments."}
            </Alert>
          )}

          {isLoading && discussions.length === 0 ? (
            <Center py="xl">
              <Loader size="md" />
            </Center>
          ) : discussions.length === 0 ? (
            <Center py="xl" style={{ flexDirection: "column", border: "1px dashed var(--mantine-color-default-border)", borderRadius: "var(--mantine-radius-md)" }}>
              <IconMessage size={36} style={{ color: "var(--mantine-color-dimmed)" }} />
              <Text size="sm" c="dimmed" mt="xs" fw={500}>
                No discussions yet. Start the conversation!
              </Text>
            </Center>
          ) : (
            <Stack gap="md">
              {discussions.map((comment) => (
                <DiscussionItem
                  key={comment._id}
                  comment={comment}
                  problemId={problemId}
                  currentUser={user}
                  onVote={handleVoteComment}
                  onAddReply={handleAddReply}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Input area at the bottom */}
      <Box
        p="md"
        style={{
          borderTop: "1px solid var(--mantine-color-default-border)",
          backgroundColor: "var(--mantine-color-default-hover)",
        }}
      >
        <Stack gap="xs">
          <Textarea
            placeholder="Share your thoughts, solution ideas, or ask a question..."
            value={newComment}
            onChange={(e) => setNewComment(e.currentTarget.value)}
            minRows={2}
            maxRows={4}
            autosize
            radius="md"
          />
          <Group justify="end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isLoading}
              radius="md"
            >
              Post Comment
            </Button>
          </Group>
        </Stack>
      </Box>
    </Box>
  );
};

// Simple import helpers
import { Group } from "@mantine/core";

export default ProblemDiscussions;
