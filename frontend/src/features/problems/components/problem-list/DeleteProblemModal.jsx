import { Button, Group, Modal, Stack, Text } from "@mantine/core";

const DeleteProblemModal = ({ opened, onClose, problem, onConfirm }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Problem Deletion"
      centered
    >
      <Stack gap="md" mt="md">
        <Text size="sm">
          Are you sure you want to delete <strong>{problem?.title}</strong>?
          This action permanently removes all testcase files and cannot be
          undone.
        </Text>

        <Group justify="end">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Cancel
          </Button>

          <Button color="red" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteProblemModal;
