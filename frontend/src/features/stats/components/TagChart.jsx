import { Card, Text, Tabs, Progress, Group, Box, Badge } from "@mantine/core";
import { IconChecklist, IconAlertTriangle } from "@tabler/icons-react";

const getRateColor = (rate) => {
  if (rate < 40) return "red";
  if (rate < 70) return "orange";
  return "teal";
};

const TagRow = ({ tag, displayMetric, isLast }) => {
  return (
    <Box
      py="xs"
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Group justify="space-between" mb={4}>
        <Group gap="xs">
          <Badge variant="light" color="blue" radius="sm">
            {tag.label}
          </Badge>
        </Group>
        <Group gap="sm">
          {displayMetric === "solved" ? (
            <Badge variant="filled" color="blue" size="sm">
              {tag.solvedCount} Solved
            </Badge>
          ) : (
            <Badge variant="filled" color={getRateColor(tag.acceptanceRate)} size="sm">
              {tag.acceptanceRate}% Rate
            </Badge>
          )}
          <Text size="xs" c="dimmed" fw={500}>
            {tag.totalCount} submissions
          </Text>
        </Group>
      </Group>

      <Group gap="xs" align="center">
        <Text size="xs" c="dimmed" fw={500} style={{ minWidth: "90px" }}>
          Acceptance Rate:
        </Text>
        <Progress
          value={tag.acceptanceRate}
          color={getRateColor(tag.acceptanceRate)}
          size="sm"
          radius="xl"
          style={{ flex: 1 }}
        />
        <Text size="xs" fw={700} c={getRateColor(tag.acceptanceRate)}>
          {tag.acceptanceRate}%
        </Text>
      </Group>
    </Box>
  );
};

const TagChart = ({ tags }) => {
  const mostSolved = tags?.mostSolved || [];
  const weakest = tags?.weakest || [];

  return (
    <Card shadow="xs" radius="md" p="xl" withBorder style={{ height: "100%" }}>
      <Text fw={700} size="lg" mb="md">
        Tag Analytics
      </Text>

      <Tabs defaultValue="solved" color="blue">
        <Tabs.List mb="md">
          <Tabs.Tab value="solved" leftSection={<IconChecklist size={14} />}>
            Most Solved
          </Tabs.Tab>
          <Tabs.Tab value="weakest" leftSection={<IconAlertTriangle size={14} />}>
            Weakest Areas
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="solved">
          {mostSolved.length === 0 ? (
            <Box py="xl" ta="center">
              <Text size="sm" c="dimmed">
                No solved tags available yet. Solve problems to populate this analysis!
              </Text>
            </Box>
          ) : (
            <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {mostSolved.map((tag, index) => (
                <TagRow key={tag.tagId} tag={tag} displayMetric="solved" isLast={index === mostSolved.length - 1} />
              ))}
            </Box>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="weakest">
          {weakest.length === 0 ? (
            <Box py="xl" ta="center">
              <Text size="sm" c="dimmed">
                No submission tag statistics available.
              </Text>
            </Box>
          ) : (
            <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {weakest.map((tag, index) => (
                <TagRow key={tag.tagId} tag={tag} displayMetric="rate" isLast={index === weakest.length - 1} />
              ))}
            </Box>
          )}
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};

export default TagChart;
