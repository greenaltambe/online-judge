import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Title, Text, Button, Group, Card, Badge, Table, Stack, LoadingOverlay, Alert, Progress, SimpleGrid } from "@mantine/core";
import { IconArrowLeft, IconBrain, IconPlayerPlay, IconChevronRight, IconInfoCircle, IconCheck } from "@tabler/icons-react";
import { useUserListStore } from "../../../stores/userListStore";
import { getDifficultyBadge } from "../../problems/utils/difficulty";

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentList, dueCards, reviewStats, getUserListById, getDueCards, getReviewStats, isLoading, isError, message, reset } = useUserListStore();

  useEffect(() => {
    getUserListById(id);
    getDueCards(id);
    getReviewStats(id);
    return () => {
      reset();
    };
  }, [id, getUserListById, getDueCards, getReviewStats, reset]);

  if (isError) {
    return (
      <Container size="xl" py="xl">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          component={Link}
          to={`/userlists/${id}`}
          mb="lg"
        >
          Back to List
        </Button>
        <Alert icon={<IconInfoCircle size={16} />} title="Error loading deck" color="red">
          {message || "Deck not found or access denied."}
        </Alert>
      </Container>
    );
  }

  const startReview = () => {
    if (dueCards && dueCards.length > 0 && dueCards[0].problem) {
      navigate(`/problems/${dueCards[0].problem._id}?deck=${id}`);
    }
  };

  return (
    <Container size="xl" py="xl" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading && !currentList} />

      {currentList && (
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between" align="start">
            <Stack gap="xs" style={{ flexGrow: 1 }}>
              <Button
                variant="subtle"
                color="gray"
                leftSection={<IconArrowLeft size={16} />}
                component={Link}
                to={`/userlists/${id}`}
                style={{ width: "fit-content" }}
                p={0}
              >
                Back to Deck Details
              </Button>

              <Group gap="md" mt="xs">
                <IconBrain size={32} style={{ color: "var(--mantine-color-grape-filled)" }} />
                <Title order={1} fw={800}>
                  Reviewing: {currentList.name}
                </Title>
                <Badge color="grape" variant="light" size="md">
                  Active Study Deck
                </Badge>
              </Group>
            </Stack>
          </Group>

          {/* Stats Cards */}
          {reviewStats && (
            <Card withBorder padding="md" radius="md">
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={700}>DUE TODAY</Text>
                  <Text size="xl" fw={800} c={reviewStats.dueTodayCount > 0 ? "red" : "gray"}>
                    {reviewStats.dueTodayCount}
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={700}>STUDIED TODAY</Text>
                  <Text size="xl" fw={800} c="green">
                    {reviewStats.studiedTodayCount}
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={700}>DECK PROGRESS</Text>
                  <Group gap="xs" wrap="nowrap" style={{ height: "100%" }}>
                    <Progress color="grape" value={reviewStats.progressPercent} size="sm" style={{ flexGrow: 1 }} />
                    <Text size="sm" fw={700} c="grape">{reviewStats.progressPercent}%</Text>
                  </Group>
                </Stack>
              </SimpleGrid>
            </Card>
          )}

          {/* Review Landing Controller */}
          {dueCards && dueCards.length > 0 ? (
            <Stack gap="md">
              <Card withBorder padding="xl" radius="md" style={{ textAlign: "center", backgroundColor: "var(--mantine-color-grape-light)" }}>
                <Stack gap="md" align="center">
                  <IconBrain size={48} style={{ color: "var(--mantine-color-grape-filled)" }} />
                  <Title order={2} fw={800}>
                    Study Deck Ready
                  </Title>
                  <Text size="md" maw={500} mx="auto">
                    You have <Text span fw={700} c="red">{dueCards.length}</Text> review cards waiting for active recall practice today.
                  </Text>
                  <Button
                    color="grape"
                    size="lg"
                    radius="md"
                    leftSection={<IconPlayerPlay size={18} />}
                    onClick={startReview}
                    mt="md"
                  >
                    Start Reviewing ({dueCards.length} Cards)
                  </Button>
                </Stack>
              </Card>

              {/* Due Cards List */}
              <Title order={3} fw={700} mt="lg">
                Problems Queued for Today
              </Title>
              <Card p={0} radius="md" withBorder style={{ overflow: "hidden" }}>
                <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ fontWeight: 600 }}>Problem Challenge</Table.Th>
                      <Table.Th style={{ width: 150, fontWeight: 600 }}>Difficulty</Table.Th>
                      <Table.Th width={60} />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {dueCards.map((card) => {
                      if (!card.problem) return null;
                      return (
                        <Table.Tr
                          key={card._id}
                          className="clickable-row"
                          onClick={() => navigate(`/problems/${card.problem._id}?deck=${id}`)}
                        >
                          <Table.Td>
                            <Text fw={600} size="md">
                              {card.problem.title}
                            </Text>
                          </Table.Td>
                          <Table.Td>{getDifficultyBadge(card.problem.difficulty)}</Table.Td>
                          <Table.Td style={{ textAlign: "right" }}>
                            <IconChevronRight
                              size={18}
                              style={{ color: "var(--mantine-color-dimmed)" }}
                            />
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </Card>
            </Stack>
          ) : (
            !isLoading && (
              <Card withBorder py={60} radius="md" style={{ textAlign: "center" }}>
                <Stack gap="sm" align="center">
                  <IconCheck size={48} style={{ color: "var(--mantine-color-green-filled)" }} />
                  <Title order={2} fw={800} c="green">
                    Deck Complete! 🎉
                  </Title>
                  <Text size="md" c="dimmed" style={{ maxWidth: 400 }} mx="auto">
                    You have finished reviewing all due cards in this deck for today. Check back tomorrow!
                  </Text>
                  <Button component={Link} to={`/userlists/${id}`} mt="md" radius="md">
                    Return to Deck Details
                  </Button>
                </Stack>
              </Card>
            )
          )}
        </Stack>
      )}
    </Container>
  );
};

export default ReviewPage;
