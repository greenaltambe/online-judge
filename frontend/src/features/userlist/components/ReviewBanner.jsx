import { useState, useEffect } from "react";
import { Paper, Group, Button, Text, ActionIcon, Stack, Tooltip } from "@mantine/core";
import { IconBrain, IconX, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useUserListStore } from "../../../stores/userListStore";

const ReviewBanner = ({ listId, problemId, autoReveal = false }) => {
  const navigate = useNavigate();
  const { currentList, getUserListById, submitReview, isLoading } = useUserListStore();
  const [controlsRevealed, setControlsRevealed] = useState(false);

  useEffect(() => {
    if (listId) {
      getUserListById(listId);
    }
  }, [listId, getUserListById]);

  useEffect(() => {
    if (autoReveal) {
      setControlsRevealed(true);
    }
  }, [autoReveal]);

  const handleRate = async (rating) => {
    const success = await submitReview(listId, problemId, rating);
    if (success) {
      notifications.show({
        title: "Review Saved",
        message: "Recall rating has been recorded.",
        color: "green",
      });
      // Redirect to the review controller page which handles routing to the next due card
      navigate(`/userlists/${listId}/review`);
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to record recall rating.",
        color: "red",
      });
    }
  };

  if (!currentList) return null;

  return (
    <Paper
      shadow="sm"
      p="sm"
      withBorder
      style={{
        backgroundColor: "var(--mantine-color-grape-light)",
        borderLeft: "4px solid var(--mantine-color-grape-filled)",
        borderRadius: "4px",
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm">
          <IconBrain style={{ color: "var(--mantine-color-grape-filled)" }} />
          <Stack gap={0}>
            <Text fw={700} size="sm" c="grape.9">
              Active Review Deck: {currentList.name}
            </Text>
            <Text size="xs" c="dimmed">
              Solve the challenge, then rate your recall ease factor below to schedule the next review.
            </Text>
          </Stack>
        </Group>

        <Group gap="sm" align="center">
          {!controlsRevealed ? (
            <Button
              size="xs"
              color="grape"
              leftSection={<IconEye size={14} />}
              onClick={() => setControlsRevealed(true)}
            >
              Reveal Review Controls
            </Button>
          ) : (
            <Group gap="xs">
              <Button
                size="xs"
                color="red"
                variant="filled"
                onClick={() => handleRate(1)}
                disabled={isLoading}
              >
                Again
              </Button>
              <Button
                size="xs"
                color="orange"
                variant="filled"
                onClick={() => handleRate(2)}
                disabled={isLoading}
              >
                Hard
              </Button>
              <Button
                size="xs"
                color="blue"
                variant="filled"
                onClick={() => handleRate(3)}
                disabled={isLoading}
              >
                Good
              </Button>
              <Button
                size="xs"
                color="green"
                variant="filled"
                onClick={() => handleRate(4)}
                disabled={isLoading}
              >
                Easy
              </Button>
            </Group>
          )}

          <Tooltip label="Exit Study Session">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => navigate(`/userlists/${listId}/review`)}
            >
              <IconX size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
};

export default ReviewBanner;
