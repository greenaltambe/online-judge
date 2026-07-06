import { Badge, Stack, Title } from "@mantine/core";

const SectionHeading = ({ badge, title }) => {
  return (
    <Stack align="center" gap="xl" mb={50}>
      <Badge color="blue" variant="light" size="lg" radius="xl">
        {badge}
      </Badge>

      <Title
        order={2}
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        {title}
      </Title>
    </Stack>
  );
};

export default SectionHeading;
