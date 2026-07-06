import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";

import { IconPlus, IconTrash } from "@tabler/icons-react";

const ExamplesStep = ({
  testCases,
  onAddExample,
  onRemoveExample,
  onExampleChange,
}) => {
  return (
    <Stack gap="md" mt="xl">
      {testCases.map((testCase, index) => (
        <Card key={index} p="md" withBorder radius="md">
          <Group justify="between" mb="xs">
            <Text fw={600} size="sm" c="blue">
              Example #{index + 1}
            </Text>

            {testCases.length > 1 && (
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => onRemoveExample(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </Group>

          <Grid>
            <Grid.Col span={6}>
              <Textarea
                label="Example Input"
                placeholder="e.g. 5"
                value={testCase.input}
                onChange={(e) =>
                  onExampleChange(index, "input", e.target.value)
                }
                minRows={3}
                required
                style={{
                  fontFamily: "var(--mantine-font-monospace)",
                }}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Textarea
                label="Expected Output"
                placeholder="e.g. 10"
                value={testCase.expectedOutput}
                onChange={(e) =>
                  onExampleChange(index, "expectedOutput", e.target.value)
                }
                minRows={3}
                required
                style={{
                  fontFamily: "var(--mantine-font-monospace)",
                }}
              />
            </Grid.Col>
          </Grid>
        </Card>
      ))}

      <Button
        variant="light"
        color="blue"
        leftSection={<IconPlus size={16} />}
        onClick={onAddExample}
        style={{
          alignSelf: "start",
        }}
      >
        Add Example Case
      </Button>
    </Stack>
  );
};

export default ExamplesStep;
