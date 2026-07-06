import React from "react";
import { Container, Text, Group, Box } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

function Footer() {
  return (
    <Box py="lg" style={{ backgroundColor: "var(--mantine-color-body)" }}>
      <Container size="xl">
        <Group justify="space-between">
          <Text size="sm" color="dimmed">
            © {new Date().getFullYear()} GreenCode Online Judge. All rights
            reserved.
          </Text>
          <Group gap="xs">
            <Text size="xs" color="dimmed">
              Made with
            </Text>
            <IconHeart size={14} style={{ color: "#ef4444" }} />
            <Text size="xs" color="dimmed">
              for developers
            </Text>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

export default Footer;
