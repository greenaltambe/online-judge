import { Container, Title, Text, Button, Group, Stack, SimpleGrid, Card, ThemeIcon, Timeline, Badge, Divider, Box, useMantineColorScheme, ActionIcon } from "@mantine/core";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { IconTerminal2, IconRocket, IconShieldCheck, IconCpu, IconCode, IconCheck, IconArrowRight, IconHeart, IconSun, IconMoon } from "@tabler/icons-react";

const LandingPage = () => {
  const user = useAuthStore((state) => state.user);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Box style={{ backgroundColor: "var(--mantine-color-body)", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Navbar Header */}
      <Box style={{ borderBottom: "1px solid var(--mantine-color-default-border)", position: "sticky", top: 0, zIndex: 100, backgroundColor: "var(--mantine-color-body)" }}>
        <Container size="xl" h={64}>
          <Group justify="between" h="100%">
            <Group gap="xs" component={Link} to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <ThemeIcon variant="filled" color="blue" radius="sm" size="sm">
                <IconTerminal2 size={18} />
              </ThemeIcon>
              <Text size="lg" fw={800} style={{ letterSpacing: "-0.5px", background: "linear-gradient(135deg, var(--mantine-color-blue-4) 0%, var(--mantine-color-blue-7) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                GreenCode
              </Text>
            </Group>

            <Group gap="md">
              <ActionIcon variant="default" onClick={() => toggleColorScheme()} size="lg" aria-label="Toggle color scheme">
                {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>

              {user ? (
                <Button color="blue" component={Link} to="/problems" rightSection={<IconArrowRight size={16} />}>
                  Go to Workspace
                </Button>
              ) : (
                <>
                  <Button variant="subtle" color="gray" component={Link} to="/login">
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

      {/* Hero Section */}
      <Container size="xl" pt={{ base: 60, md: 100 }} pb={60}>
        <Stack align="center" gap="xl" style={{ textAlign: "center" }}>
          <Badge color="blue" variant="light" size="lg" radius="xl" py="md" px="lg">
            ✨ Introducing GreenCode v2
          </Badge>

          <Title
            order={1}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-1.5px",
              maxWidth: 900,
            }}
          >
            The Professional{" "}
            <span style={{ background: "linear-gradient(135deg, var(--mantine-color-blue-4) 0%, var(--mantine-color-blue-7) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Coding Sandbox
            </span>{" "}
            for Developers
          </Title>

          <Text size="lg" color="dimmed" maxw={650} mx="auto" style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
            Run, compile, and submit code against real-world test cases. Empower your coding journey with an integrated Monaco workspace, blazing fast execution, and modern design.
          </Text>

          <Group gap="md" justify="center" mt="md">
            <Button
              size="lg"
              color="blue"
              component={Link}
              to={user ? "/problems" : "/register"}
              rightSection={<IconArrowRight size={18} />}
              style={{ transition: "transform 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Start Coding Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              color="gray"
              component={Link}
              to="/problems"
            >
              Browse Problems
            </Button>
          </Group>

          {/* Terminal Mockup */}
          <Box
            mt={50}
            style={{
              width: "100%",
              maxWidth: 900,
              border: "1px solid var(--mantine-color-default-border)",
              borderRadius: "12px",
              backgroundColor: "var(--mantine-color-default-hover)",
              boxShadow: "var(--mantine-shadow-md)",
              overflow: "hidden",
            }}
          >
            <Group px="md" py="xs" style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }} gap="xs">
              <Box style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
              <Box style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308" }} />
              <Box style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
              <Text size="xs" color="dimmed" mx="auto" fw={500} style={{ fontFamily: "var(--mantine-font-monospace)" }}>greencode_editor.cpp</Text>
            </Group>
            <Box p="lg" style={{ textAlign: "left", fontFamily: "var(--mantine-font-monospace)" }}>
              <Text color="blue" size="sm">#include &lt;iostream&gt;</Text>
              <Text color="blue" size="sm">using namespace std;</Text>
              <Text size="sm">&nbsp;</Text>
              <Text color="blue" size="sm">int <span style={{ color: "var(--mantine-color-text)" }}>main() &#123;</span></Text>
              <Text size="sm">&nbsp;&nbsp;&nbsp;&nbsp;cout &lt;&lt; <span style={{ color: "var(--mantine-color-indigo-filled)" }}>"Welcome to the ultimate online judge platform!"</span> &lt;&lt; endl;</Text>
              <Text size="sm">&nbsp;&nbsp;&nbsp;&nbsp;return <span style={{ color: "var(--mantine-color-red-filled)" }}>0</span>;</Text>
              <Text color="blue" size="sm">&#125;</Text>
              <Divider my="md" />
              <Text color="teal" size="sm">✓ Compilation successful.</Text>
              <Text color="dimmed" size="sm">Verdict: Accepted | Time: 4ms | Memory: 1.2MB</Text>
            </Box>
          </Box>
        </Stack>
      </Container>

      <Divider />

      {/* Features Section */}
      <Container size="xl" py={80}>
        <Stack align="center" gap="xl" mb={50}>
          <Badge color="blue" variant="light" size="lg" radius="xl">Features</Badge>
          <Title order={2} style={{ fontSize: "2rem", fontWeight: 800 }}>Engineered for Visual and Technical Excellence</Title>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} gap="xl">
          <Card withBorder>
            <ThemeIcon color="blue" variant="light" size="xl" mb="md" radius="md">
              <IconCode size={24} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb="xs">Monaco Editor</Text>
            <Text size="sm" color="dimmed" style={{ lineHeight: 1.5 }}>
              Write your code with autocompletion, word wrap, and customizable fonts in the industry standard Monaco editor.
            </Text>
          </Card>

          <Card withBorder>
            <ThemeIcon color="blue" variant="light" size="xl" mb="md" radius="md">
              <IconCpu size={24} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb="xs">Sandbox Compilation</Text>
            <Text size="sm" color="dimmed" style={{ lineHeight: 1.5 }}>
              Isolated sandbox execution triggers quick compilations and tests code against multiple complex scenarios.
            </Text>
          </Card>

          <Card withBorder>
            <ThemeIcon color="blue" variant="light" size="xl" mb="md" radius="md">
              <IconShieldCheck size={24} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb="xs">Admin Console</Text>
            <Text size="sm" color="dimmed" style={{ lineHeight: 1.5 }}>
              Create, update, and manage problems, custom descriptions, custom test inputs, and expected outputs seamlessly.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>

      <Divider />

      {/* How it works Section */}
      <Container size="md" py={80}>
        <Stack align="center" gap="xl" mb={50}>
          <Badge color="blue" variant="light" size="lg" radius="xl">Workflow</Badge>
          <Title order={2} style={{ fontSize: "2rem", fontWeight: 800 }}>How GreenCode Works</Title>
        </Stack>

        <Timeline active={3} bulletSize={30} lineWidth={2} color="blue">
          <Timeline.Item bullet={<IconCheck size={16} />} title="Create Account">
            <Text color="dimmed" size="sm">Register your coder profile. It takes less than 30 seconds.</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<IconCheck size={16} />} title="Choose a Problem">
            <Text color="dimmed" size="sm">Pick any coding challenge from the filtered, categorized dashboard.</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<IconCheck size={16} />} title="Code and Run">
            <Text color="dimmed" size="sm">Type your solution in the browser, choose language, and run test examples.</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<IconRocket size={16} />} title="Submit & Get Rated">
            <Text color="dimmed" size="sm">Submit your solution for sandbox verification against strict hidden test inputs.</Text>
          </Timeline.Item>
        </Timeline>
      </Container>

      {/* Call to Action Section */}
      <Box style={{ backgroundColor: "var(--mantine-color-default-hover)" }} py={80}>
        <Container size="md">
          <Card style={{ padding: "3rem", textAlign: "center" }} withBorder>
            <Stack align="center" gap="md">
              <Title order={2} style={{ fontSize: "2.2rem" }}>Ready to upgrade your coding speed?</Title>
              <Text size="md" color="dimmed" maxw={500} mx="auto">
                Sign up today and experience a platform crafted with modern developer tools in mind.
              </Text>
              <Button
                color="blue"
                size="lg"
                component={Link}
                to="/register"
                mt="md"
                rightSection={<IconArrowRight size={18} />}
              >
                Create Free Account
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Divider />
      <Box py="lg" style={{ backgroundColor: "var(--mantine-color-body)" }}>
        <Container size="xl">
          <Group justify="between">
            <Text size="sm" color="dimmed">
              © {new Date().getFullYear()} GreenCode Online Judge. All rights reserved.
            </Text>
            <Group gap="xs">
              <Text size="xs" color="dimmed">Made with</Text>
              <IconHeart size={14} style={{ color: "#ef4444" }} />
              <Text size="xs" color="dimmed">for developers</Text>
            </Group>
          </Group>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
