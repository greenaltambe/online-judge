import { useEffect, useState } from "react";
import { Container, Title, Text, Button, Group, Grid, Card, Badge, ActionIcon, Stack, LoadingOverlay, Tooltip, Alert, Modal, Progress } from "@mantine/core";
import { IconPlus, IconEdit, IconTrash, IconLock, IconWorld, IconBookmark, IconInfoCircle, IconBrain } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useUserListStore } from "../../../stores/userListStore";
import CreateEditListModal from "../components/CreateEditListModal";

const UserListsPage = () => {
  const navigate = useNavigate();
  const { userLists, getUserLists, deleteUserList, isLoading, isError, message } = useUserListStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingList, setEditingList] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  useEffect(() => {
    getUserLists();
  }, [getUserLists]);

  const handleCreateClick = () => {
    setEditingList(null);
    setModalOpen(true);
  };

  const handleEditClick = (e, list) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingList(list);
    setModalOpen(true);
  };

  const handleDeleteClick = (e, list) => {
    e.preventDefault();
    e.stopPropagation();
    setListToDelete(list);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!listToDelete) return;
    const success = await deleteUserList(listToDelete._id);
    if (success) {
      notifications.show({
        title: "List Deleted",
        message: `"${listToDelete.name}" has been deleted successfully.`,
        color: "blue",
      });
    } else {
      notifications.show({
        title: "Error",
        message: message || "Failed to delete list",
        color: "red",
      });
    }
    setDeleteConfirmOpen(false);
    setListToDelete(null);
  };

  return (
    <Container size="xl" py="xl" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading && userLists.length === 0} />

      <Group justify="space-between" mb="xl">
        <Stack gap={4}>
          <Title order={1} fw={800}>
            My Lists
          </Title>
          <Text c="dimmed" size="sm">
            Create lists to group coding problems and track your learning progress.
          </Text>
        </Stack>

        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateClick}
          color="blue"
          radius="md"
        >
          Create List
        </Button>
      </Group>

      {isError && (
        <Alert icon={<IconInfoCircle size={16} />} title="Error loading lists" color="red" mb="xl">
          {message || "Please check your network connection."}
        </Alert>
      )}

      {userLists.length > 0 ? (
        <Grid gutter="md">
          {userLists.map((list) => (
            <Grid.Col key={list._id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card
                className="user-list-card"
                withBorder
                padding="lg"
                radius="md"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                onClick={() => navigate(`/userlists/${list._id}`)}
              >
                <Group justify="space-between" mb="xs">
                  <Group gap={6}>
                    <Badge
                      color={list.isPublic ? "green" : "blue"}
                      variant="light"
                      leftSection={list.isPublic ? <IconWorld size={12} /> : <IconLock size={12} />}
                    >
                      {list.isPublic ? "Public" : "Private"}
                    </Badge>

                    {list.spacedRepetitionEnabled && (
                      <Badge
                        color="grape"
                        variant="light"
                        leftSection={<IconBrain size={12} />}
                      >
                        Deck
                      </Badge>
                    )}
                  </Group>

                  <Group gap={6}>
                    <Tooltip label="Edit Details">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={(e) => handleEditClick(e, list)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete List">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={(e) => handleDeleteClick(e, list)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Stack gap={8} style={{ flexGrow: 1 }} mt="xs">
                  <Group gap="xs" wrap="nowrap">
                    <IconBookmark size={20} style={{ color: "var(--mantine-color-blue-filled)" }} />
                    <Title order={3} size="h4" truncate="end" style={{ maxWidth: 220 }}>
                      {list.name}
                    </Title>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={2} style={{ flexGrow: 1 }}>
                    {list.description}
                  </Text>

                  {list.spacedRepetitionEnabled && list.srStats && (
                    <Stack gap={4} mt="sm">
                      <Group justify="space-between" align="center">
                        <Text size="xs" fw={700} c="grape">
                          Review Progress ({list.srStats.progressPercent}%)
                        </Text>
                        {list.srStats.dueTodayCount > 0 ? (
                          <Badge color="red" size="xs" variant="filled">
                            {list.srStats.dueTodayCount} due
                          </Badge>
                        ) : (
                          <Badge color="gray" size="xs" variant="light">
                            Caught up
                          </Badge>
                        )}
                      </Group>
                      <Progress color="grape" value={list.srStats.progressPercent} size="xs" radius="xl" />
                    </Stack>
                  )}
                </Stack>

                <Group justify="space-between" mt="lg" style={{ borderTop: "1px solid var(--mantine-color-default-border)", paddingTop: "12px" }}>
                  <Text size="xs" c="dimmed">
                    Updated {new Date(list.updatedAt || list.createdAt).toLocaleDateString()}
                  </Text>
                  <Text size="xs" fw={700} c="blue">
                    {list.problems ? list.problems.length : 0} {list.problems?.length === 1 ? "Problem" : "Problems"}
                  </Text>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        !isLoading && (
          <Card withBorder py={60} radius="md" style={{ textAlign: "center" }}>
            <Stack gap="sm" align="center">
              <IconBookmark size={48} style={{ color: "var(--mantine-color-dimmed)" }} />
              <Title order={3} fw={700}>
                No Lists Yet
              </Title>
              <Text size="sm" c="dimmed" style={{ maxWidth: 400 }} mx="auto">
                Organize coding tasks by creating lists for review patterns, cheat sheets, or target companies.
              </Text>
              <Button onClick={handleCreateClick} mt="md" radius="md">
                Create Your First List
              </Button>
            </Stack>
          </Card>
        )
      )}

      {/* Create / Edit Modal */}
      <CreateEditListModal opened={modalOpen} onClose={() => setModalOpen(false)} list={editingList} />

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete List"
        centered
        radius="md"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete <Text span fw={700}>{listToDelete?.name}</Text>? This action is permanent and cannot be undone.
          </Text>
          <Group justify="end" mt="md">
            <Button variant="default" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete}>
              Delete Permanently
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default UserListsPage;
