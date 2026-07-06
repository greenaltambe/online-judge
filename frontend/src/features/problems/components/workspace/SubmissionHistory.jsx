import { ScrollArea, Stack, Card, Group, Badge, Text } from "@mantine/core";
import { IconCheck, IconX, IconTerminal } from "@tabler/icons-react";

const SubmissionHistory = ({ submissions, onOpenSubmissionCode }) => {
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
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
              onClick={() => onOpenSubmissionCode(sub)}
            >
              <Group justify="between">
                <Group gap="sm">
                  {sub.status === "accepted" ? (
                    <Badge color="teal" leftSection={<IconCheck size={12} />}>
                      Accepted
                    </Badge>
                  ) : (
                    <Badge color="red" leftSection={<IconX size={12} />}>
                      Rejected
                    </Badge>
                  )}
                  <Text
                    size="xs"
                    c="dimmed"
                    style={{ textTransform: "uppercase" }}
                  >
                    {sub.language}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  {formatTime(sub.createdAt)}
                </Text>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : (
        <Stack align="center" justify="center" h="100%" py={100} gap="xs">
          <IconTerminal
            size={32}
            style={{ color: "var(--mantine-color-dimmed)" }}
          />
          <Text c="dimmed" size="sm">
            No submissions yet for this problem.
          </Text>
        </Stack>
      )}
    </ScrollArea>
  );
};

export default SubmissionHistory;
