import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Group,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "../../stores/authStore";
import {
  IconTerminal2,
  IconLock,
  IconMail,
  IconArrowRight,
} from "@tabler/icons-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user, isLoading, isError, isSuccess, message, reset } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/problems");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess) {
      notifications.show({
        title: "Welcome Back",
        message: "Successfully logged in to GreenCode!",
        color: "blue",
      });
      reset();
      navigate("/problems");
    }

    if (isError) {
      notifications.show({
        title: "Authentication Failed",
        message: message || "Invalid credentials, please try again.",
        color: "red",
      });
      reset();
    }
  }, [isSuccess, isError, message, reset, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      notifications.show({
        title: "Error",
        message: "Please fill in all fields",
        color: "red",
      });
      return;
    }
    login({ email, password });
  };

  return (
    <Box
      style={{
        backgroundColor: "var(--mantine-color-body)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container size="xl" style={{ width: "100%" }}>
        <Grid gutter={80} align="center" justify="center">
          {/* Form Column */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Card p="xl" radius="md" withBorder>
              {/* Logo / Branding */}
              <Group gap="xs" mb="lg">
                <ThemeIcon variant="filled" color="blue" radius="sm">
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

              <Title order={2} mb={4}>
                Welcome Back
              </Title>
              <Text size="sm" color="dimmed" mb="xl">
                Log in to continue your coding progress.
              </Text>

              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <TextInput
                    label="Email address"
                    placeholder="you@example.com"
                    required
                    leftSection={<IconMail size={16} />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Your secure password"
                    required
                    leftSection={<IconLock size={16} />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Button
                    type="submit"
                    color="blue"
                    fullWidth
                    loading={isLoading}
                    rightSection={<IconArrowRight size={16} />}
                    mt="md"
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>

              <Text
                size="sm"
                color="dimmed"
                mt="xl"
                style={{ textAlign: "center" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "var(--mantine-color-blue-filled)",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </Text>
            </Card>
          </Grid.Col>

          {/* Code/Design Illustration Column */}
          <Grid.Col span={{ base: 12, md: 7 }} visibleFrom="md">
            <Box
              style={{
                borderRadius: "12px",
                border: "1px solid var(--mantine-color-default-border)",
                backgroundColor: "var(--mantine-color-default-hover)",
                padding: "2.5rem",
                boxShadow: "var(--mantine-shadow-md)",
              }}
            >
              <Group mb="lg" gap="xs">
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#eab308",
                  }}
                />
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                <Text
                  size="xs"
                  color="dimmed"
                  style={{ fontFamily: "var(--mantine-font-monospace)" }}
                  ml={8}
                >
                  auth_sandbox.py
                </Text>
              </Group>

              <Box
                style={{
                  fontFamily: "var(--mantine-font-monospace)",
                  fontSize: "0.9rem",
                  color: "var(--mantine-color-text)",
                  lineHeight: 1.6,
                }}
              >
                <Text style={{ color: "var(--mantine-color-blue-filled)" }}>
                  def{" "}
                  <span style={{ color: "var(--mantine-color-indigo-filled)" }}>
                    verify_identity
                  </span>
                  (user_auth):
                </Text>
                <Text>
                  &nbsp;&nbsp;&nbsp;&nbsp;""" Authenticates coder in the secure
                  sandbox """
                </Text>
                <Text>
                  &nbsp;&nbsp;&nbsp;&nbsp;token = user_auth.get_bearer_token()
                </Text>
                <Text>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{ color: "#f43f5e" }}>if</span> not
                  token.is_valid():
                </Text>
                <Text>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;raise
                  SandboxException(
                  <span style={{ color: "var(--mantine-color-red-filled)" }}>
                    "Access Denied"
                  </span>
                  )
                </Text>
                <Text>
                  &nbsp;&nbsp;&nbsp;&nbsp;print(
                  <span style={{ color: "var(--mantine-color-blue-filled)" }}>
                    "Status: Authorized | Welcome back coder"
                  </span>
                  )
                </Text>
                <Text>&nbsp;&nbsp;&nbsp;&nbsp;return token.profile</Text>
                <Text>&nbsp;</Text>
                <Text color="dimmed"># Output:</Text>
                <Text color="dimmed">
                  &gt;&gt;&gt; verify_identity(greencode_user)
                </Text>
                <Text color="blue">
                  Authorized. Environment variables loaded. Welcome back.
                </Text>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
