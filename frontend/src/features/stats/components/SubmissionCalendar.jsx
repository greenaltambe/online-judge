import { Card, Text, Group, Stack, Tooltip, Box, useMantineColorScheme } from "@mantine/core";

const getColorForCount = (count, isDark) => {
  if (count === 0) return isDark ? "#1a1b1e" : "#f1f3f5";
  if (count <= 2) return isDark ? "#0e4429" : "#d8f5a2"; // light green
  if (count <= 4) return isDark ? "#006d32" : "#b2f2bb"; // medium light green
  if (count <= 6) return isDark ? "#26a641" : "#69db7c"; // medium dark green
  return isDark ? "#39d353" : "#2f9e44"; // intense green
};

const generateCalendarGrid = (calendarData) => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 365);
  
  // Go back to the preceding Sunday to align week rows
  const dayOfWeek = start.getDay();
  start.setDate(start.getDate() - dayOfWeek);
  
  const end = new Date(today);
  // Go forward to the following Saturday to finish the last week
  const endDayOfWeek = end.getDay();
  end.setDate(end.getDate() + (6 - endDayOfWeek));

  const weeks = [];
  let currentWeek = [];
  const temp = new Date(start);

  while (temp <= end) {
    const dateStr = temp.toISOString().split("T")[0];
    const count = calendarData[dateStr] || 0;
    currentWeek.push({
      date: new Date(temp),
      dateStr,
      count,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    temp.setDate(temp.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null); // padding just in case
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

const SubmissionCalendar = ({ calendar }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const calendarData = calendar || {};
  const weeks = generateCalendarGrid(calendarData);

  // Helper to determine month labels.
  // We want to render month text if the week starts a new month, or if it's the first week.
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  let lastMonth = -1;

  const weeksWithLabels = weeks.map((week, idx) => {
    const validDay = week.find(d => d !== null);
    if (!validDay) return { week, label: "" };

    const currentMonth = validDay.date.getMonth();
    let label = "";

    if (idx === 0 || currentMonth !== lastMonth) {
      label = monthNames[currentMonth];
      lastMonth = currentMonth;
    }

    return { week, label };
  });

  return (
    <Card shadow="xs" radius="md" p="xl" withBorder>
      <Text fw={700} size="lg" mb="sm">
        Submission Timeline
      </Text>
      <Text size="xs" c="dimmed" mb="xl">
        Submissions made in the last 365 days.
      </Text>

      <Box style={{ overflowX: "auto", width: "100%" }} pb="sm">
        <Group gap={3} wrap="nowrap" align="stretch">
          {/* Day of Week Labels (Mon, Wed, Fri) on the left */}
          <Stack gap={3} pr="xs" style={{ justifyContent: "flex-end", paddingBottom: "3px" }}>
            <Box h={15} /> {/* spacer corresponding to month label */}
            <Text size="9px" c="dimmed" h={12} style={{ display: "flex", alignItems: "center" }}>Sun</Text>
            <Box h={12} /> {/* spacer for Mon */}
            <Text size="9px" c="dimmed" h={12} style={{ display: "flex", alignItems: "center" }}>Tue</Text>
            <Box h={12} /> {/* spacer for Wed */}
            <Text size="9px" c="dimmed" h={12} style={{ display: "flex", alignItems: "center" }}>Thu</Text>
            <Box h={12} /> {/* spacer for Fri */}
            <Text size="9px" c="dimmed" h={12} style={{ display: "flex", alignItems: "center" }}>Sat</Text>
          </Stack>

          {/* Grid Columns */}
          {weeksWithLabels.map(({ week, label }, wIdx) => (
            <Stack key={wIdx} gap={3} align="center">
              {/* Month Label */}
              <Box h={15} style={{ display: "flex", alignItems: "center" }}>
                <Text size="10px" fw={700} c="dimmed" style={{ whiteSpace: "nowrap" }}>
                  {label}
                </Text>
              </Box>

              {/* 7 Days in Week */}
              {week.map((day, dIdx) => {
                if (!day) return <Box key={dIdx} w={12} h={12} />;

                const tooltipLabel = `${day.count} ${
                  day.count === 1 ? "submission" : "submissions"
                } on ${day.date.toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}`;

                return (
                  <Tooltip key={day.dateStr} label={tooltipLabel} withArrow offset={4}>
                    <Box
                      w={12}
                      h={12}
                      style={{
                        borderRadius: "2px",
                        backgroundColor: getColorForCount(day.count, isDark),
                        transition: "transform 0.1s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Stack>
          ))}
        </Group>
      </Box>

      {/* Legend */}
      <Group justify="flex-end" gap="xs" mt="md" pr="xs">
        <Text size="xs" c="dimmed">Less</Text>
        <Box w={12} h={12} style={{ borderRadius: "2px", backgroundColor: getColorForCount(0, isDark) }} />
        <Box w={12} h={12} style={{ borderRadius: "2px", backgroundColor: getColorForCount(1, isDark) }} />
        <Box w={12} h={12} style={{ borderRadius: "2px", backgroundColor: getColorForCount(3, isDark) }} />
        <Box w={12} h={12} style={{ borderRadius: "2px", backgroundColor: getColorForCount(5, isDark) }} />
        <Box w={12} h={12} style={{ borderRadius: "2px", backgroundColor: getColorForCount(7, isDark) }} />
        <Text size="xs" c="dimmed">More</Text>
      </Group>
    </Card>
  );
};

export default SubmissionCalendar;
