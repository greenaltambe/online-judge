import { Drawer, Stack, NumberInput, Group, Text, Switch, Button } from "@mantine/core";

const EditorSettingsDrawer = ({
  opened,
  onClose,
  fontSize,
  setFontSize,
  wordWrap,
  setWordWrap,
  minimap,
  setMinimap,
  autocomplete,
  setAutocomplete,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Monaco Editor Preferences"
      position="right"
      size="md"
    >
      <Stack gap="lg" mt="md">
        {/* Font Size Selector */}
        <NumberInput
          label="Font Size (px)"
          value={fontSize}
          onChange={(val) => setFontSize(typeof val === "number" ? val : 14)}
          min={10}
          max={24}
        />

        {/* Word Wrap */}
        <Group justify="between">
          <div>
            <Text size="sm" fw={500}>
              Enable Word Wrap
            </Text>
            <Text size="xs" c="dimmed">
              Wrap lines that exceed screen width
            </Text>
          </div>
          <Switch
            checked={wordWrap}
            onChange={(e) => setWordWrap(e.currentTarget.checked)}
            color="blue"
          />
        </Group>

        {/* Minimap */}
        <Group justify="between">
          <div>
            <Text size="sm" fw={500}>
              Show Minimap
            </Text>
            <Text size="xs" c="dimmed">
              Display editor outline on right
            </Text>
          </div>
          <Switch
            checked={minimap}
            onChange={(e) => setMinimap(e.currentTarget.checked)}
            color="blue"
          />
        </Group>

        {/* Autocomplete */}
        <Group justify="between">
          <div>
            <Text size="sm" fw={500}>
              Smart Suggestions
            </Text>
            <Text size="xs" c="dimmed">
              Trigger code snippet autocomplete
            </Text>
          </div>
          <Switch
            checked={autocomplete}
            onChange={(e) => setAutocomplete(e.currentTarget.checked)}
            color="blue"
          />
        </Group>

        <Button color="blue" fullWidth onClick={onClose} mt="md">
          Save Preferences
        </Button>
      </Stack>
    </Drawer>
  );
};

export default EditorSettingsDrawer;
