import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";

const CTASection = () => {
  return (
    <Box
      py={80}
      style={{
        backgroundColor: "var(--mantine-color-default-hover)",
      }}
    >
      <Container size="md">
        <Card
          withBorder
          style={{
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <Stack align="center" gap="md">
            <Title
              order={2}
              style={{
                fontSize: "2.2rem",
              }}
            >
              Ready to upgrade your coding speed?
            </Title>

            <Text size="md" c="dimmed" maw={500} mx="auto">
              Sign up today and experience a platform crafted with modern
              developer tools in mind.
            </Text>

            <Button
              mt="md"
              size="lg"
              color="blue"
              component={Link}
              to="/register"
              rightSection={<IconArrowRight size={18} />}
            >
              Create Free Account
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export default CTASection;
