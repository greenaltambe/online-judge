import { useEffect } from "react";
import { Modal, Checkbox, Stack, Text, ScrollArea, Box, Loader, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useUserListStore } from "../../../stores/userListStore";

const AddProblemToListModal = ({ opened, onClose, problem }) => {
  const { userLists, getUserLists, addProblemToList, removeProblemFromList, isLoading } = useUserListStore();

  useEffect(() => {
    if (opened) {
      getUserLists();
    }
  }, [opened, getUserLists]);

  const handleToggleList = async (list, isChecked) => {
    if (!problem) return;

    let success = false;
    if (isChecked) {
      success = await addProblemToList(list._id, problem._id);
      if (success) {
        notifications.show({
          title: "Added to List",
          message: `Added "${problem.title}" to list "${list.name}".`,
          color: "green",
          autoClose: 2000,
        });
      }
    } else {
      success = await removeProblemFromList(list._id, problem._id);
      if (success) {
        notifications.show({
          title: "Removed from List",
          message: `Removed "${problem.title}" from list "${list.name}".`,
          color: "blue",
          autoClose: 2000,
        });
      }
    }
  };

  if (!problem) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Add Problem to Lists`}
      centered
      radius="md"
    >
      <Box pb="md">
        <Text size="sm" c="dimmed" mb="md">
          Select which lists to include <Text span fw={700} c="var(--mantine-color-text)">{problem.title}</Text> in.
        </Text>

        {isLoading && userLists.length === 0 ? (
          <Group justify="center" py="xl">
            <Loader size="sm" />
          </Group>
        ) : userLists.length > 0 ? (
          <ScrollArea.Autosize maxHeight={300}>
            <Stack gap="sm">
              {userLists.map((list) => {
                const isContained = list.problems && list.problems.some((p) => {
                  const pid = typeof p === "object" ? p._id : p;
                  return pid.toString() === problem._id.toString();
                });

                return (
                  <Checkbox
                    key={list._id}
                    label={list.name}
                    description={list.description}
                    checked={isContained}
                    onChange={(e) => handleToggleList(list, e.currentTarget.checked)}
                  />
                );
              })}
            </Stack>
          </ScrollArea.Autosize>
        ) : (
          <Box style={{ textAlign: "center" }} py="lg">
            <Text size="sm" c="dimmed">
              You haven't created any user lists yet.
            </Text>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddProblemToListModal;
