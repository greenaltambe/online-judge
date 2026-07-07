import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Title, Text, Button, Group, Card, Badge, Table, ActionIcon, Stack, LoadingOverlay, Tooltip, Alert } from "@mantine/core";
import { IconArrowLeft, IconTrash, IconLock, IconWorld, IconBookmark, IconChevronRight, IconInfoCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useUserListStore } from "../../../stores/userListStore";
import { getDifficultyBadge } from "../../problems/utils/difficulty";
import { PROBLEM_TAG_MAP } from "../../problems/data/problemTags";

const UserListDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentList, getUserListById, removeProblemFromList, isLoading, isError, message, reset } = useUserListStore();

  useEffect(() => {
    getUserListById(id);
    return () => {
      reset();
    };
  }, [id, getUserListById, reset]);

  const handleRemoveProblem = async (e, problemId, problemTitle) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await removeProblemFromList(id, problemId);
    if (success) {
      notifications.show({
        title: "Problem Removed",
        message: `Successfully removed "${problemTitle}" from the list.`,
        color: "blue",
      });
      // Refresh current list details
      getUserListById(id);
    } else {
      notifications.show({
        title: "Error",
        message: message || "Failed to remove problem from list.",
        color: "red",
      });
    }
  };

  if (isError) {
    return (
      <Container size="xl" py="xl">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          component={Link}
          to="/userlists"
          mb="lg"
        >
          Back to Lists
        </Button>
        <Alert icon={<IconInfoCircle size={16} />} title="Error loading list" color="red">
          {message || "List not found or you do not have permission to view it."}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading && !currentList} />

      {currentList && (
        <Stack gap="xl">
          {/* Header Section */}
          <Group justify="space-between" align="start">
            <Stack gap="xs" style={{ flexGrow: 1 }}>
              <Button
                variant="subtle"
                color="gray"
                leftSection={<IconArrowLeft size={16} />}
                component={Link}
                to="/userlists"
                style={{ width: "fit-content" }}
                p={0}
              >
                Back to Lists
              </Button>

              <Group gap="md" mt="xs">
                <IconBookmark size={32} style={{ color: "var(--mantine-color-blue-filled)" }} />
                <Title order={1} fw={800}>
                  {currentList.name}
                </Title>
                <Badge
                  color={currentList.isPublic ? "green" : "blue"}
                  variant="light"
                  size="md"
                  leftSection={currentList.isPublic ? <IconWorld size={12} /> : <IconLock size={12} />}
                >
                  {currentList.isPublic ? "Public" : "Private"}
                </Badge>
              </Group>

              <Text c="dimmed" size="md" mt="xs" style={{ maxWidth: 800 }}>
                {currentList.description}
              </Text>
            </Stack>

            <Badge size="lg" variant="outline" color="blue" radius="md">
              {currentList.problems ? currentList.problems.length : 0} {currentList.problems?.length === 1 ? "Problem" : "Problems"}
            </Badge>
          </Group>

          {/* Problems List Section */}
          {currentList.problems && currentList.problems.length > 0 ? (
            <Card p={0} radius="md" withBorder style={{ overflow: "hidden" }}>
              <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ fontWeight: 600 }}>Problem Challenge</Table.Th>
                    <Table.Th style={{ width: 150, fontWeight: 600 }}>Difficulty</Table.Th>
                    <Table.Th style={{ width: 120, textAlign: "right", fontWeight: 600 }}>Action</Table.Th>
                    <Table.Th width={60} />
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {currentList.problems.map((problem) => (
                    <Table.Tr
                      key={problem._id}
                      className="clickable-row"
                      onClick={() => navigate(`/problems/${problem._id}`)}
                    >
                      <Table.Td>
                        <Text fw={600} size="md">
                          {problem.title}
                        </Text>
                        {problem.tags && problem.tags.length > 0 && (
                          <Group gap={6} mt={6}>
                            {problem.tags.map((tagId) => {
                              const tag = PROBLEM_TAG_MAP[tagId];
                              return tag ? (
                                <Badge key={tagId} variant="light" size="xs" color="gray" radius="sm">
                                  {tag.label}
                                </Badge>
                              ) : null;
                            })}
                          </Group>
                        )}
                      </Table.Td>

                      <Table.Td>{getDifficultyBadge(problem.difficulty)}</Table.Td>

                      <Table.Td
                        style={{ textAlign: "right" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip label="Remove from List">
                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={(e) => handleRemoveProblem(e, problem._id, problem.title)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Table.Td>

                      <Table.Td style={{ textAlign: "right" }}>
                        <IconChevronRight
                          size={18}
                          style={{ color: "var(--mantine-color-dimmed)" }}
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          ) : (
            <Card withBorder py={60} radius="md" style={{ textAlign: "center" }}>
              <Stack gap="sm" align="center">
                <IconBookmark size={48} style={{ color: "var(--mantine-color-dimmed)" }} />
                <Title order={3} fw={700}>
                  This list has no problems
                </Title>
                <Text size="sm" c="dimmed" maxW={400} mx="auto">
                  Browse through the problem challenges list to add problems and practice.
                </Text>
                <Button component={Link} to="/problems" mt="md" radius="md">
                  Browse Problems
                </Button>
              </Stack>
            </Card>
          )}
        </Stack>
      )}
    </Container>
  );
};

export default UserListDetailsPage;
