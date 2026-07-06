import { Button, Group, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

const ProblemsHeader = ({ isAdmin }) => {
  return (
    <Group justify="space-between" align="end">
      <div>
        <Title
          order={1}
          style={{
            letterSpacing: "-1px",
          }}
        >
          Coding Sandbox
        </Title>

        <Text size="sm" c="dimmed">
          Select a challenge, run your code against compiler tests, and submit.
        </Text>
      </div>

      {isAdmin && (
        <Button
          component={Link}
          to="/problems/create"
          color="blue"
          leftSection={<IconPlus size={16} />}
        >
          New Problem
        </Button>
      )}
    </Group>
  );
};

export default ProblemsHeader;
