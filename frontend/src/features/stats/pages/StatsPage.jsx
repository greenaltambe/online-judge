import { useEffect } from "react";
import { Container, Grid, Title, Center, Loader, Alert, Button, Stack, Text, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { useStatsStore } from "../../../stores/statsStore";

import StatsCard from "../components/StatsCard";
import DifficultyChart from "../components/DifficultyChart";
import LanguageChart from "../components/LanguageChart";
import TagChart from "../components/TagChart";
import RecentActivity from "../components/RecentActivity";
import SubmissionCalendar from "../components/SubmissionCalendar";

const StatsPage = () => {
  const {
    overview,
    difficulty,
    languages,
    tags,
    activity,
    calendar,
    isLoading,
    isError,
    message,
    getStatsDashboard,
    reset,
  } = useStatsStore();

  useEffect(() => {
    getStatsDashboard();

    return () => {
      reset();
    };
  }, [getStatsDashboard, reset]);

  // Handle errors using notifications
  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Statistics Load Failed",
        message: message || "Could not retrieve portfolio activity details.",
        color: "red",
      });
    }
  }, [isError, message]);

  if (isLoading && !overview) {
    return (
      <Center style={{ minHeight: "70vh" }}>
        <Stack align="center" gap="xs">
          <Loader size="lg" color="blue" />
          <Text size="sm" c="dimmed" fw={500}>
            Assembling statistics dashboard...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (isError && !overview) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error loading statistics"
          color="red"
          radius="md"
        >
          <Text size="sm" mb="md">
            {message || "We encountered an issue fetching your submissions dashboard details."}
          </Text>
          <Button
            leftSection={<IconRefresh size={14} />}
            variant="outline"
            color="red"
            onClick={getStatsDashboard}
          >
            Retry Loading
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header Title */}
        <Box>
          <Title order={1} fw={800} style={{ letterSpacing: "-0.5px" }}>
            Performance & Stats
          </Title>
          <Text c="dimmed" size="sm" mt={3} fw={500}>
            Analyze your progress, coding patterns, and tags.
          </Text>
        </Box>

        {/* Overview Metric Cards Row */}
        <Group gap="md" grow>
          <StatsCard overview={overview} />
        </Group>

        {/* Breakdown Row: Difficulty Circle vs Language Stack */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DifficultyChart difficulty={difficulty} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <LanguageChart languages={languages} />
          </Grid.Col>
        </Grid>

        {/* Contributions Heatmap */}
        <SubmissionCalendar calendar={calendar} />

        {/* Lower Row: Tag Analytics vs Recent Activity */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TagChart tags={tags} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <RecentActivity activity={activity} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

// Simple helper to avoid React runtime error for using Box without importing
import { Box } from "@mantine/core";

export default StatsPage;
