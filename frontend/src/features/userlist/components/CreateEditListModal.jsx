import { useEffect, useState } from "react";
import { Modal, TextInput, Textarea, Switch, Button, Stack, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useUserListStore } from "../../../stores/userListStore";

const CreateEditListModal = ({ opened, onClose, list = null }) => {
  const { createUserList, updateUserList, isLoading, message } = useUserListStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [spacedRepetitionEnabled, setSpacedRepetitionEnabled] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (opened) {
      if (list) {
        setName(list.name || "");
        setDescription(list.description || "");
        setIsPublic(list.isPublic || false);
        setSpacedRepetitionEnabled(list.spacedRepetitionEnabled || false);
      } else {
        setName("");
        setDescription("");
        setIsPublic(false);
        setSpacedRepetitionEnabled(false);
      }
      setErrors({});
    }
  }, [opened, list]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    let hasError = false;
    const newErrors = {};

    if (!trimmedName) {
      newErrors.name = "Name is required";
      hasError = true;
    }
    if (!trimmedDesc) {
      newErrors.description = "Description is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      name: trimmedName,
      description: trimmedDesc,
      isPublic,
      spacedRepetitionEnabled,
    };

    let success = false;
    if (list) {
      success = await updateUserList(list._id, payload);
    } else {
      success = await createUserList(payload);
    }

    if (success) {
      notifications.show({
        title: list ? "List Updated" : "List Created",
        message: `"${trimmedName}" has been ${list ? "updated" : "created"} successfully.`,
        color: "green",
      });
      onClose();
    } else {
      notifications.show({
        title: "Error",
        message: message || "Failed to save user list",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={list ? "Edit List" : "Create New List"}
      centered
      radius="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="List Name"
            placeholder="e.g. Blind 75, Dynamic Programming"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
            data-autofocus
          />

          <Textarea
            label="Description"
            placeholder="What is this list about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            required
            rows={3}
          />

          <Switch
            label="Make this list public"
            description="Anyone logged in will be able to view public lists"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.currentTarget.checked)}
          />

          <Switch
            label="Enable Spaced Repetition"
            description="Turn this list into an active study deck with Anki-style review schedules"
            checked={spacedRepetitionEnabled}
            onChange={(e) => setSpacedRepetitionEnabled(e.currentTarget.checked)}
          />

          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {list ? "Save Changes" : "Create List"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateEditListModal;
