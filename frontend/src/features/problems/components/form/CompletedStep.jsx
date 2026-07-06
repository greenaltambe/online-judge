import { Card, Text, ThemeIcon, Title } from "@mantine/core";

import { IconCheck } from "@tabler/icons-react";

const CompletedStep = ({ mode }) => {
  return (
    <Card
      mt="xl"
      p="xl"
      withBorder
      radius="md"
      style={{
        textAlign: "center",
      }}
    >
      <ThemeIcon mx="auto" mb="md" color="blue" size={50} radius="xl">
        <IconCheck size={30} />
      </ThemeIcon>

      <Title order={3}>Form Complete!</Title>

      <Text mt="xs" mx="auto" maw={450} size="sm" c="dimmed">
        {mode === "create"
          ? "All example cases loaded and sandbox file uploads configured. Click Save below to publish."
          : "All properties have been updated. Click Save below to store your changes."}
      </Text>
    </Card>
  );
};

export default CompletedStep;
