import {
  Container,
  Text,
  Button,
  Group,
  ThemeIcon,
  Box,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import { useAuthStore } from "../../../stores/authStore";
import { Link } from "react-router-dom";
import {
  IconTerminal2,
  IconArrowRight,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";

function Navbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const user = useAuthStore((state) => state.user);
  return (
    <Box
      style={{
        borderBottom: "1px solid var(--mantine-color-default-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "var(--mantine-color-body)",
      }}
    >
      <Container size="xl" h={64}>
        <Group justify="space-between" h="100%">
          <Group
            gap="xs"
            component={Link}
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ThemeIcon variant="filled" color="blue" radius="sm" size="sm">
              <IconTerminal2 size={18} />
            </ThemeIcon>
            <Text
              size="lg"
              fw={800}
              style={{
                letterSpacing: "-0.5px",
                background:
                  "linear-gradient(135deg, var(--mantine-color-blue-4) 0%, var(--mantine-color-blue-7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GreenCode
            </Text>
          </Group>

          <Group gap="md">
            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              size="lg"
              aria-label="Toggle color scheme"
            >
              {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>

            {user ? (
              <Button
                color="blue"
                component={Link}
                to="/problems"
                rightSection={<IconArrowRight size={16} />}
              >
                Go to Workspace
              </Button>
            ) : (
              <>
                <Button
                  variant="subtle"
                  color="gray"
                  component={Link}
                  to="/login"
                >
                  Sign In
                </Button>
                <Button color="blue" component={Link} to="/register">
                  Get Started
                </Button>
              </>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

export default Navbar;
