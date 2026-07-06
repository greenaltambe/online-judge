import { ActionIcon, Group, Table, Text, Tooltip, Badge } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconChevronRight, IconEdit, IconTrash } from "@tabler/icons-react";

import { getDifficultyBadge } from "../../utils/difficulty";
import { PROBLEM_TAG_MAP } from "../../data/problemTags";

const ProblemRow = ({ problem, isAdmin, navigate, onDelete }) => {
  return (
    <Table.Tr
      style={{
        cursor: "pointer",
      }}
      onClick={() => navigate(`/problems/${problem._id}`)}
    >
      <Table.Td>
        <Text fw={600} size="md">
          {problem.title}
        </Text>
        {problem.tags && problem.tags.length > 0 && (
          <Group gap={6} mt={6}>
            {problem.tags.map((tagId) => {
              const tag = PROBLEM_TAG_MAP[tagId];
              return tag ? (
                <Badge key={tagId} variant="light" size="xs" color="gray" radius="sm">
                  {tag.label}
                </Badge>
              ) : null;
            })}
          </Group>
        )}
      </Table.Td>

      <Table.Td>{getDifficultyBadge(problem.difficulty)}</Table.Td>

      {isAdmin && (
        <Table.Td
          style={{
            textAlign: "right",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Group justify="end" gap="xs">
            <Tooltip label="Edit Problem">
              <ActionIcon
                component={Link}
                to={`/problems/${problem._id}/edit`}
                color="blue"
                variant="light"
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Delete Problem">
              <ActionIcon
                color="red"
                variant="light"
                onClick={(e) => onDelete(e, problem)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Table.Td>
      )}

      <Table.Td
        style={{
          textAlign: "right",
        }}
      >
        <IconChevronRight
          size={18}
          style={{
            color: "var(--mantine-color-dimmed)",
          }}
        />
      </Table.Td>
    </Table.Tr>
  );
};

export default ProblemRow;
