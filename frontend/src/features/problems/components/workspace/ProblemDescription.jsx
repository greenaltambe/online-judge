import { ScrollArea, Stack, Divider, Text, Card, Group, Box, Badge } from "@mantine/core";
import { marked } from "marked";
import { PROBLEM_TAG_MAP } from "../../data/problemTags";

const ProblemDescription = ({ description, testCases, tags }) => {
  const renderDescription = (desc) => {
    try {
      return { __html: marked.parse(desc || "") };
    } catch (e) {
      return { __html: desc || "" };
    }
  };

  return (
    <ScrollArea h="100%" p="lg">
      <Stack gap="lg">
        {/* Markdown render */}
        <div
          className="markdown-body"
          style={{
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
          dangerouslySetInnerHTML={renderDescription(description)}
        />

        {tags && tags.length > 0 && (
          <Group gap="xs">
            {tags.map((tagId) => {
              const tag = PROBLEM_TAG_MAP[tagId];
              return tag ? (
                <Badge key={tagId} variant="outline" color="blue">
                  {tag.label}
                </Badge>
              ) : null;
            })}
          </Group>
        )}

        <Divider />

        {/* Render Basic Example testcases */}
        <Text fw={700} size="md" color="blue">
          Examples
        </Text>
        {testCases &&
          testCases.map((tc, idx) => (
            <Card key={idx} p="md" withBorder radius="md">
              <Text fw={600} size="sm" c="dimmed" mb="xs">
                Example {idx + 1}
              </Text>
              <Group grow align="start" gap="md">
                <div>
                  <Text size="xs" fw={700} c="dimmed" mb={4}>
                    INPUT
                  </Text>
                  <Box
                    p="xs"
                    style={{
                      backgroundColor: "var(--mantine-color-default-hover)",
                      border: "1px solid var(--mantine-color-default-border)",
                      borderRadius: "var(--mantine-radius-sm)",
                      fontFamily: "var(--mantine-font-monospace)",
                      fontSize: "0.85rem",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {tc.input}
                  </Box>
                </div>
                <div>
                  <Text size="xs" fw={700} c="dimmed" mb={4}>
                    EXPECTED OUTPUT
                  </Text>
                  <Box
                    p="xs"
                    style={{
                      backgroundColor: "var(--mantine-color-default-hover)",
                      border: "1px solid var(--mantine-color-default-border)",
                      borderRadius: "var(--mantine-radius-sm)",
                      fontFamily: "var(--mantine-font-monospace)",
                      fontSize: "0.85rem",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {tc.expectedOutput}
                  </Box>
                </div>
              </Group>
            </Card>
          ))}
      </Stack>
    </ScrollArea>
  );
};

export default ProblemDescription;
