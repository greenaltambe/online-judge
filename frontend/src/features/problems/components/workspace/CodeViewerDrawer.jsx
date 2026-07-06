import { Drawer, Box, Group, Badge, Text, Button } from "@mantine/core";
import Editor from "@monaco-editor/react";

const CodeViewerDrawer = ({
  opened,
  onClose,
  code,
  language,
  theme,
  fontSize,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Submitted Code Solution"
      position="right"
      size="lg"
    >
      <Box
        style={{
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
        }}
        mt="md"
      >
        <Group justify="between" mb="xs">
          <Badge color="blue" variant="outline">
            Language: {language.toUpperCase()}
          </Badge>
          <Text size="xs" c="dimmed">
            Read-only view
          </Text>
        </Group>
        <Box
          style={{
            flexGrow: 1,
            border: "1px solid var(--mantine-color-default-border)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Editor
            height="100%"
            language={language}
            theme={theme}
            value={code}
            options={{
              readOnly: true,
              fontSize: fontSize,
              minimap: { enabled: false },
              lineNumbers: "on",
              automaticLayout: true,
            }}
          />
        </Box>
        <Button color="gray" onClick={onClose} mt="md">
          Close Viewer
        </Button>
      </Box>
    </Drawer>
  );
};

export default CodeViewerDrawer;
