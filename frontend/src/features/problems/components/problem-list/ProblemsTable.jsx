import { Card, Skeleton, Table, Text } from "@mantine/core";

import ProblemRow from "./ProblemRow";

const ProblemsTable = ({
  problems,
  isLoading,
  isAdmin,
  navigate,
  onDelete,
  onAddToList,
}) => {
  return (
    <Card
      p={0}
      radius="md"
      withBorder
      style={{
        overflow: "hidden",
      }}
    >
      <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              style={{
                fontWeight: 600,
              }}
            >
              Problem Challenge
            </Table.Th>

            <Table.Th
              style={{
                width: 150,
                fontWeight: 600,
              }}
            >
              Difficulty
            </Table.Th>

            <Table.Th
              style={{
                width: isAdmin ? 150 : 80,
                textAlign: "right",
                fontWeight: 600,
              }}
            >
              Actions
            </Table.Th>

            <Table.Th width={60} />
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <Table.Tr key={idx}>
                <Table.Td>
                  <Skeleton height={20} radius="sm" width="50%" />
                </Table.Td>

                <Table.Td>
                  <Skeleton height={24} width={80} radius="xl" />
                </Table.Td>

                <Table.Td
                  style={{
                    textAlign: "right",
                  }}
                >
                  <Skeleton
                    circle
                    height={28}
                    style={{
                      display: "inline-block",
                    }}
                  />
                </Table.Td>

                <Table.Td>
                  <Skeleton circle height={20} />
                </Table.Td>
              </Table.Tr>
            ))
          ) : problems.length > 0 ? (
            problems.map((problem) => (
              <ProblemRow
                key={problem._id}
                problem={problem}
                isAdmin={isAdmin}
                navigate={navigate}
                onDelete={onDelete}
                onAddToList={onAddToList}
              />
            ))
          ) : (
            <Table.Tr>
              <Table.Td
                colSpan={4}
                style={{
                  textAlign: "center",
                  padding: "40px",
                }}
              >
                <Text c="dimmed" fw={500}>
                  No coding problems match your search criteria.
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Card>
  );
};

export default ProblemsTable;
