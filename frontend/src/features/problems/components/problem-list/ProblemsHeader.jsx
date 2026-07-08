import { Button, Group, Text, Title, Badge } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

const ProblemsHeader = ({ isAdmin, totalProblems }) => {
  return (
    <Group justify="space-between" align="end">
      <div>
        <Group gap="xs" align="center">
          <Title
            order={1}
            style={{
              letterSpacing: "-1px",
            }}
          >
            Coding Sandbox
          </Title>
          {totalProblems > 0 && (
            <Badge size="lg" variant="light" color="blue">
              {totalProblems}
            </Badge>
          )}
        </Group>

        <Text size="sm" c="dimmed" mt={4}>
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
