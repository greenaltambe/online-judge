import { Card, Text, Group, Box, useMantineColorScheme } from "@mantine/core";
import { IconTrophy, IconCloudUpload, IconAward, IconFlame } from "@tabler/icons-react";

const StatsCard = ({ overview }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const { solvedCount, totalSubmissions, acceptanceRate, currentStreak, longestStreak } = overview || {
    solvedCount: 0,
    totalSubmissions: 0,
    acceptanceRate: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  const cardData = [
    {
      title: "Solved Problems",
      value: solvedCount,
      desc: "Unique challenges resolved",
      icon: <IconTrophy size={32} style={{ color: "var(--mantine-color-blue-filled)" }} />,
      gradient: "linear-gradient(135deg, rgba(34, 139, 230, 0.1) 0%, rgba(34, 139, 230, 0) 100%)",
      border: "1px solid var(--mantine-color-blue-light)",
    },
    {
      title: "Total Submissions",
      value: totalSubmissions,
      desc: "Total code runs executed",
      icon: <IconCloudUpload size={32} style={{ color: "var(--mantine-color-indigo-filled)" }} />,
      gradient: "linear-gradient(135deg, rgba(76, 110, 245, 0.1) 0%, rgba(76, 110, 245, 0) 100%)",
      border: "1px solid var(--mantine-color-indigo-light)",
    },
    {
      title: "Acceptance Rate",
      value: `${acceptanceRate}%`,
      desc: "Ratio of accepted runs",
      icon: <IconAward size={32} style={{ color: "var(--mantine-color-teal-filled)" }} />,
      gradient: "linear-gradient(135deg, rgba(18, 184, 134, 0.1) 0%, rgba(18, 184, 134, 0) 100%)",
      border: "1px solid var(--mantine-color-teal-light)",
    },
    {
      title: "Activity Streak",
      value: `${currentStreak} Days`,
      desc: `Best streak: ${longestStreak} days`,
      icon: <IconFlame size={32} style={{ color: "var(--mantine-color-orange-filled)" }} />,
      gradient: "linear-gradient(135deg, rgba(253, 126, 20, 0.1) 0%, rgba(253, 126, 20, 0) 100%)",
      border: "1px solid var(--mantine-color-orange-light)",
    },
  ];

  return (
    <>
      {cardData.map((card, idx) => (
        <Card
          key={idx}
          shadow="xs"
          radius="md"
          p="md"
          style={{
            flex: "1 1 220px",
            background: isDark ? "var(--mantine-color-dark-8)" : "var(--mantine-color-white)",
            border: card.border,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--mantine-shadow-xs)";
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                {card.title}
              </Text>
              <Text size="xl" fw={800} mt={5} style={{ fontSize: "1.8rem", lineHeight: 1.1 }}>
                {card.value}
              </Text>
              <Text size="xs" c="dimmed" mt={4} fw={500}>
                {card.desc}
              </Text>
            </Box>
            <Box
              p={8}
              style={{
                borderRadius: "var(--mantine-radius-md)",
                background: card.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </Box>
          </Group>
        </Card>
      ))}
    </>
  );
};

export default StatsCard;
