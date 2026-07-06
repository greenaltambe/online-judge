import { Card, Text, ThemeIcon } from "@mantine/core";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card withBorder>
      <ThemeIcon color="blue" variant="light" size="xl" mb="md" radius="md">
        <Icon size={24} />
      </ThemeIcon>

      <Text fw={700} size="lg" mb="xs">
        {title}
      </Text>

      <Text
        size="sm"
        c="dimmed"
        style={{
          lineHeight: 1.5,
        }}
      >
        {description}
      </Text>
    </Card>
  );
};

export default FeatureCard;
