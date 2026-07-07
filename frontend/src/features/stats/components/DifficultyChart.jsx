import { Card, Text, Group, Stack, RingProgress, Progress, Box } from "@mantine/core";

const DifficultyChart = ({ difficulty }) => {
  const easySolved = difficulty?.easy?.solved || 0;
  const easyTotal = difficulty?.easy?.total || 0;
  const mediumSolved = difficulty?.medium?.solved || 0;
  const mediumTotal = difficulty?.medium?.total || 0;
  const hardSolved = difficulty?.hard?.solved || 0;
  const hardTotal = difficulty?.hard?.total || 0;

  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalProblems = easyTotal + mediumTotal + hardTotal;
  const overallPercentage = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;

  const easyPercent = easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0;
  const mediumPercent = mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0;
  const hardPercent = hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0;

  // Let's create sections for the RingProgress representing relative proportions of solved problems
  const sections = [];
  if (totalSolved > 0) {
    sections.push({ value: (easySolved / totalSolved) * overallPercentage, color: "teal", tooltip: `Easy: ${easySolved}` });
    sections.push({ value: (mediumSolved / totalSolved) * overallPercentage, color: "orange", tooltip: `Medium: ${mediumSolved}` });
    sections.push({ value: (hardSolved / totalSolved) * overallPercentage, color: "red", tooltip: `Hard: ${hardSolved}` });
  }

  return (
    <Card shadow="xs" radius="md" p="xl" withBorder style={{ height: "100%" }}>
      <Text fw={700} size="lg" mb="md">
        Difficulty Breakdown
      </Text>

      <Group justify="center" align="center" gap="xl" style={{ flexGrow: 1 }}>
        <RingProgress
          size={160}
          thickness={14}
          roundCaps
          sections={sections.length > 0 ? sections : [{ value: 0, color: "gray" }]}
          label={
            <Box ta="center">
              <Text fw={800} size="xl" style={{ fontSize: "2rem", lineHeight: 1.1 }}>
                {totalSolved}
              </Text>
              <Text size="xs" c="dimmed" fw={500}>
                / {totalProblems} Solved
              </Text>
            </Box>
          }
        />

        <Stack gap="md" style={{ flex: 1, minWidth: "180px" }}>
          <div>
            <Group justify="space-between" mb={4}>
              <Text fw={700} size="xs" c="teal.7">
                Easy
              </Text>
              <Text size="xs" fw={600}>
                {easySolved} <Text span c="dimmed" fw={500}>/ {easyTotal}</Text>
              </Text>
            </Group>
            <Progress value={easyPercent} color="teal" size="sm" radius="xl" />
          </div>

          <div>
            <Group justify="space-between" mb={4}>
              <Text fw={700} size="xs" c="orange.7">
                Medium
              </Text>
              <Text size="xs" fw={600}>
                {mediumSolved} <Text span c="dimmed" fw={500}>/ {mediumTotal}</Text>
              </Text>
            </Group>
            <Progress value={mediumPercent} color="orange" size="sm" radius="xl" />
          </div>

          <div>
            <Group justify="space-between" mb={4}>
              <Text fw={700} size="xs" c="red.7">
                Hard
              </Text>
              <Text size="xs" fw={600}>
                {hardSolved} <Text span c="dimmed" fw={500}>/ {hardTotal}</Text>
              </Text>
            </Group>
            <Progress value={hardPercent} color="red" size="sm" radius="xl" />
          </div>
        </Stack>
      </Group>
    </Card>
  );
};

export default DifficultyChart;
