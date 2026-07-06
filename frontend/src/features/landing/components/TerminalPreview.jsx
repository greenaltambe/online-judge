import { Box, Divider, Group, Text } from "@mantine/core";

const TerminalPreview = () => {
  return (
    <Box
      mt={50}
      style={{
        width: "100%",
        maxWidth: 900,
        border: "1px solid var(--mantine-color-default-border)",
        borderRadius: "12px",
        backgroundColor: "var(--mantine-color-default-hover)",
        boxShadow: "var(--mantine-shadow-md)",
        overflow: "hidden",
      }}
    >
      <Group
        px="md"
        py="xs"
        gap="xs"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Box
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ef4444",
          }}
        />

        <Box
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#eab308",
          }}
        />

        <Box
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#22c55e",
          }}
        />

        <Text
          size="xs"
          c="dimmed"
          mx="auto"
          fw={500}
          style={{
            fontFamily: "var(--mantine-font-monospace)",
          }}
        >
          greencode_editor.cpp
        </Text>
      </Group>

      <Box
        p="lg"
        style={{
          textAlign: "left",
          fontFamily: "var(--mantine-font-monospace)",
        }}
      >
        <Text c="blue" size="sm">
          #include &lt;iostream&gt;
        </Text>

        <Text c="blue" size="sm">
          using namespace std;
        </Text>

        <Text size="sm">&nbsp;</Text>

        <Text c="blue" size="sm">
          int{" "}
          <span style={{ color: "var(--mantine-color-text)" }}>
            main() &#123;
          </span>
        </Text>

        <Text size="sm">
          &nbsp;&nbsp;&nbsp;&nbsp;cout &lt;&lt;{" "}
          <span style={{ color: "var(--mantine-color-indigo-filled)" }}>
            "Welcome to the ultimate online judge platform!"
          </span>{" "}
          &lt;&lt; endl;
        </Text>

        <Text size="sm">
          &nbsp;&nbsp;&nbsp;&nbsp;return{" "}
          <span style={{ color: "var(--mantine-color-red-filled)" }}>0</span>;
        </Text>

        <Text c="blue" size="sm">
          &#125;
        </Text>

        <Divider my="md" />

        <Text c="teal" size="sm">
          ✓ Compilation successful.
        </Text>

        <Text c="dimmed" size="sm">
          Verdict: Accepted | Time: 4ms | Memory: 1.2MB
        </Text>
      </Box>
    </Box>
  );
};

export default TerminalPreview;
