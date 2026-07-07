import { Card, Text, Progress, Box, Group, Badge } from "@mantine/core";

const getLanguageColor = (lang) => {
  const l = lang.toLowerCase();
  if (l.includes("python")) return "blue";
  if (l.includes("c++") || l.includes("cpp")) return "red";
  if (l.includes("java") && !l.includes("script")) return "orange";
  if (l.includes("javascript") || l.includes("node") || l.includes("js")) return "yellow";
  if (l.includes("typescript") || l.includes("ts")) return "cyan";
  if (l.includes("go")) return "teal";
  if (l.includes("rust")) return "grape";
  return "indigo";
};

const LanguageChart = ({ languages }) => {
  const langList = languages || [];

  return (
    <Card shadow="xs" radius="md" p="xl" withBorder style={{ height: "100%" }}>
      <Text fw={700} size="lg" mb="md">
        Language Usage
      </Text>

      {langList.length === 0 ? (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            minHeight: "130px",
          }}
        >
          <Text c="dimmed" size="sm">
            No language statistics available.
          </Text>
        </Box>
      ) : (
        <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
          {/* Segmented multi-progress bar to show visual ratio in one line */}
          <Progress.Root size="xl" radius="xl" mb="xl">
            {langList.map((lang) => (
              <Progress.Section
                key={lang.language}
                value={lang.percentage}
                color={getLanguageColor(lang.language)}
              >
                {lang.percentage > 10 && (
                  <Progress.Label style={{ fontSize: "10px", fontWeight: "bold" }}>
                    {lang.language}
                  </Progress.Label>
                )}
              </Progress.Section>
            ))}
          </Progress.Root>

          {/* Detailed rows */}
          <Box style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {langList.map((lang) => (
              <Box key={lang.language}>
                <Group justify="space-between" mb={4}>
                  <Group gap="xs">
                    <Box
                      w={10}
                      h={10}
                      style={{
                        borderRadius: "50%",
                        backgroundColor: `var(--mantine-color-${getLanguageColor(lang.language)}-filled)`,
                      }}
                    />
                    <Text fw={600} size="sm">
                      {lang.language}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Badge variant="light" color={getLanguageColor(lang.language)} size="sm">
                      {lang.percentage}%
                    </Badge>
                    <Text size="xs" c="dimmed" fw={500}>
                      ({lang.count} {lang.count === 1 ? "submission" : "submissions"})
                    </Text>
                  </Group>
                </Group>
                <Progress value={lang.percentage} color={getLanguageColor(lang.language)} size="xs" radius="xl" />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default LanguageChart;
