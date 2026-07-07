import { useState } from "react";
import { Box, Group, Text, Avatar, Button, ActionIcon, Badge, Textarea, Stack, Tooltip } from "@mantine/core";
import { IconThumbUp, IconCornerDownRight, IconEdit, IconTrash, IconDeviceFloppy, IconX } from "@tabler/icons-react";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DiscussionItem = ({ comment, problemId, currentUser, onVote, onAddReply, onEdit, onDelete, isReply = false }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const author = comment.user || { name: "Deleted User", role: "user" };
  const initials = author.name ? author.name.charAt(0).toUpperCase() : "?";
  
  const isAuthor = currentUser && author._id && currentUser._id === author._id;
  const isAdmin = currentUser && currentUser.role === "admin";
  const hasUpvoted = currentUser && comment.upvotes && comment.upvotes.includes(currentUser._id);
  const voteCount = comment.upvotes ? comment.upvotes.length : 0;

  const handleVoteClick = () => {
    if (onVote) {
      onVote(comment._id);
    }
  };

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    if (onAddReply) {
      onAddReply(replyContent, comment._id);
    }
    setReplyContent("");
    setIsReplying(false);
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    if (onEdit) {
      onEdit(comment._id, editContent);
    }
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (onDelete && window.confirm("Are you sure you want to delete this comment?")) {
      onDelete(comment._id);
    }
  };

  return (
    <Box
      p="sm"
      style={{
        borderRadius: "var(--mantine-radius-md)",
        border: isReply ? "none" : "1px solid var(--mantine-color-default-border)",
        backgroundColor: isReply ? "transparent" : "var(--mantine-color-body)",
        position: "relative",
      }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group gap="xs" align="flex-start" style={{ minWidth: 0, flexGrow: 1 }}>
          <Avatar
            color={author.role === "admin" ? "red" : "blue"}
            radius="xl"
            size={isReply ? "sm" : "md"}
          >
            {initials}
          </Avatar>
          
          <Box style={{ minWidth: 0, flexGrow: 1 }}>
            <Group gap="xs" wrap="nowrap" align="center">
              <Text size="sm" fw={700} truncate>
                {author.name}
              </Text>
              
              {author.role === "admin" && (
                <Badge color="red" size="xs" variant="filled">
                  Admin
                </Badge>
              )}

              <Text size="xs" c="dimmed">
                {formatDate(comment.createdAt)}
              </Text>

              {comment.editedAt && (
                <Tooltip label={`Edited on ${formatDate(comment.editedAt)}`}>
                  <Text size="10px" c="dimmed" style={{ fontStyle: "italic", cursor: "help" }}>
                    (edited)
                  </Text>
                </Tooltip>
              )}
            </Group>

            {isEditing ? (
              <Stack gap="xs" mt="xs">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.currentTarget.value)}
                  autosize
                  minRows={2}
                  radius="md"
                />
                <Group gap="xs">
                  <Button
                    size="xs"
                    color="blue"
                    leftSection={<IconDeviceFloppy size={12} />}
                    onClick={handleEditSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    size="xs"
                    variant="default"
                    leftSection={<IconX size={12} />}
                    onClick={() => {
                      setEditContent(comment.content);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Group>
              </Stack>
            ) : (
              <Text size="sm" mt="xs" style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
                {comment.content}
              </Text>
            )}

            {/* Actions row */}
            {!isEditing && (
              <Group gap="md" mt="sm">
                {/* Upvote Button */}
                <Button
                  size="xs"
                  variant={hasUpvoted ? "filled" : "light"}
                  color="blue"
                  leftSection={<IconThumbUp size={12} />}
                  onClick={handleVoteClick}
                  radius="xl"
                  styles={{
                    root: { height: "24px", padding: "0 10px" }
                  }}
                >
                  {voteCount}
                </Button>

                {/* Reply toggle button (only for top-level comments) */}
                {!isReply && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    leftSection={<IconCornerDownRight size={12} />}
                    onClick={() => setIsReplying(!isReplying)}
                    styles={{
                      root: { height: "24px", padding: "0 8px" }
                    }}
                  >
                    Reply
                  </Button>
                )}

                {/* Edit (author only) */}
                {isAuthor && (
                  <Tooltip label="Edit comment">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="gray"
                      onClick={() => setIsEditing(true)}
                    >
                      <IconEdit size={14} />
                    </ActionIcon>
                  </Tooltip>
                )}

                {/* Delete (author or admin) */}
                {(isAuthor || isAdmin) && (
                  <Tooltip label="Delete comment">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={handleDeleteClick}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            )}
          </Box>
        </Group>
      </Group>

      {/* Reply input field */}
      {isReplying && (
        <Stack gap="xs" mt="md" pl={isReply ? 0 : "xl"}>
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.currentTarget.value)}
            minRows={2}
            autosize
            radius="md"
          />
          <Group gap="xs">
            <Button size="xs" color="blue" onClick={handleReplySubmit}>
              Submit Reply
            </Button>
            <Button size="xs" variant="default" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
          </Group>
        </Stack>
      )}

      {/* Render child comments recursively (replies list) */}
      {!isReply && comment.replies && comment.replies.length > 0 && (
        <Stack
          gap="xs"
          mt="md"
          pl="xl"
          style={{
            borderLeft: "2px solid var(--mantine-color-default-border)",
          }}
        >
          {comment.replies.map((reply) => (
            <DiscussionItem
              key={reply._id}
              comment={reply}
              problemId={problemId}
              currentUser={currentUser}
              onVote={onVote}
              onEdit={onEdit}
              onDelete={onDelete}
              isReply={true}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default DiscussionItem;
