import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Title, Text, Table, Badge, Button, Group, Stack, TextInput, SegmentedControl, Select, Skeleton, ActionIcon, Tooltip, Card, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useProblemStore } from "../../stores/problemStore";
import { useAuthStore } from "../../stores/authStore";
import { IconSearch, IconPlus, IconTrash, IconEdit, IconChevronRight } from "@tabler/icons-react";

const ProblemsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { problems, getProblems, deleteProblem, isLoading, isError, message, reset } = useProblemStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);

  useEffect(() => {
    getProblems();
    return () => {
      reset();
    };
  }, [getProblems, reset]);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Error fetching problems",
        message: message || "Please check backend connection.",
        color: "red",
      });
      reset();
    }
  }, [isError, message, reset]);

  // Filter & Sort Logic
  const filteredProblems = problems.filter((prob) => {
    const matchesSearch = prob.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      difficulty === "all" || prob.difficulty.toLowerCase() === difficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "difficulty") {
      const weight = { easy: 1, medium: 2, hard: 3 };
      return weight[a.difficulty.toLowerCase()] - weight[b.difficulty.toLowerCase()];
    }
    return new Date(b.createdAt) - new Date(a.createdAt); // newest first
  });

  const handleDeleteClick = (e, problem) => {
    e.preventDefault();
    e.stopPropagation();
    setProblemToDelete(problem);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!problemToDelete) return;
    await deleteProblem(problemToDelete._id);
    notifications.show({
      title: "Problem Removed",
      message: `"${problemToDelete.title}" has been deleted successfully.`,
      color: "blue",
    });
    setDeleteModalOpen(false);
    setProblemToDelete(null);
  };

  const getDifficultyBadge = (diff) => {
    const d = diff.toLowerCase();
    if (d === "easy") return <Badge color="teal" variant="light">Easy</Badge>;
    if (d === "medium") return <Badge color="orange" variant="light">Medium</Badge>;
    return <Badge color="red" variant="light">Hard</Badge>;
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header Block */}
        <Group justify="between" align="end">
          <div>
            <Title order={1} style={{ letterSpacing: "-1px" }}>
              Coding Sandbox
            </Title>
            <Text size="sm" color="dimmed">
              Select a challenge, run your code against compiler tests, and submit.
            </Text>
          </div>

          {user && user.role === "admin" && (
            <Button
              color="blue"
              leftSection={<IconPlus size={16} />}
              component={Link}
              to="/problems/create"
            >
              New Problem
            </Button>
          )}
        </Group>

        {/* Filter Controls Row */}
        <Card p="md" withBorder radius="md">
          <Group justify="between" gap="md">
            <TextInput
              placeholder="Search problems by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flexGrow: 1, maxWidth: 400 }}
            />

            <Group gap="md">
              <SegmentedControl
                value={difficulty}
                onChange={setDifficulty}
                data={[
                  { label: "All", value: "all" },
                  { label: "Easy", value: "easy" },
                  { label: "Medium", value: "medium" },
                  { label: "Hard", value: "hard" },
                ]}
              />

              <Select
                value={sortBy}
                onChange={(val) => setSortBy(val || "newest")}
                data={[
                  { label: "Newest First", value: "newest" },
                  { label: "Title (A-Z)", value: "title" },
                  { label: "Difficulty", value: "difficulty" },
                ]}
              />
            </Group>
          </Group>
        </Card>

        {/* Problems Table */}
        <Card p={0} radius="md" withBorder style={{ overflow: "hidden" }}>
          <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ fontWeight: 600 }}>Problem Challenge</Table.Th>
                <Table.Th style={{ fontWeight: 600, width: 150 }}>Difficulty</Table.Th>
                {user && user.role === "admin" && (
                  <Table.Th style={{ fontWeight: 600, width: 120, textAlign: "right" }}>Actions</Table.Th>
                )}
                <Table.Th style={{ width: 60 }}></Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td>
                      <Skeleton height={20} radius="sm" width="50%" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={24} radius="xl" width={80} />
                    </Table.Td>
                    {user && user.role === "admin" && (
                      <Table.Td style={{ textAlign: "right" }}>
                        <Skeleton height={28} circle style={{ display: "inline-block" }} />
                      </Table.Td>
                    )}
                    <Table.Td>
                      <Skeleton height={20} circle />
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : sortedProblems.length > 0 ? (
                sortedProblems.map((prob) => (
                  <Table.Tr
                    key={prob._id}
                    onClick={() => navigate(`/problems/${prob._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Table.Td>
                      <Text fw={600} size="md">
                        {prob.title}
                      </Text>
                    </Table.Td>
                    <Table.Td>{getDifficultyBadge(prob.difficulty)}</Table.Td>
                    {user && user.role === "admin" && (
                      <Table.Td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                        <Group justify="end" gap="xs">
                          <Tooltip label="Edit Problem">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              component={Link}
                              to={`/problems/${prob._id}/edit`}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>

                          <Tooltip label="Delete Problem">
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={(e) => handleDeleteClick(e, prob)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    )}
                    <Table.Td style={{ textAlign: "right" }}>
                      <IconChevronRight size={18} style={{ color: "var(--mantine-color-dimmed)" }} />
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={user?.role === "admin" ? 4 : 3} style={{ textAlign: "center", padding: "40px" }}>
                    <Text color="dimmed" fw={500}>
                      No coding problems match your search criteria.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Problem Deletion"
        centered
      >
        <Stack gap="md" mt="md">
          <Text size="sm">
            Are you sure you want to delete the problem <strong>{problemToDelete?.title}</strong>? This action will permanently remove all inputs/outputs test files from storage and is irreversible.
          </Text>
          <Group justify="end" mt="md">
            <Button variant="subtle" color="gray" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ProblemsPage;
