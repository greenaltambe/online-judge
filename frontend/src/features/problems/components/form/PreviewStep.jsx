import { Badge, Card, Divider, Stack, Text, Title } from "@mantine/core";

const PreviewStep = ({
  title,
  difficulty,
  difficultyColor,
  parsedDescription,
  testCases,
}) => {
  return (
    <Card mt="xl" p="lg" withBorder radius="md">
      <Stack gap="md">
        <div>
          <Text size="xs" c="dimmed" fw={700}>
            TITLE PREVIEW
          </Text>

          <Title order={3} mt={2}>
            {title || "Untitled Problem"}
          </Title>

          <Badge mt="xs" color={difficultyColor}>
            {difficulty}
          </Badge>
        </div>

        <Divider />

        <div>
          <Text size="xs" c="dimmed" fw={700} mb="xs">
            DESCRIPTION PREVIEW
          </Text>

          <Card p="md" withBorder radius="md">
            <div
              className="markdown-body"
              style={{
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={parsedDescription}
            />
          </Card>
        </div>

        <div>
          <Text size="xs" c="dimmed" fw={700} mb="xs">
            EXAMPLES PREVIEW
          </Text>

          {testCases.map((tc, idx) => (
            <Card key={idx} mt="xs" p="xs" withBorder>
              <Text size="xs" fw={700} c="blue">
                Example #{idx + 1}
              </Text>

              <Text size="xs" c="dimmed" mt={4}>
                Input: {tc.input}
              </Text>

              <Text size="xs" c="dimmed">
                Output: {tc.expectedOutput}
              </Text>
            </Card>
          ))}
        </div>
      </Stack>
    </Card>
  );
};

export default PreviewStep;
