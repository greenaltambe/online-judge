import {
  Card,
  Group,
  SegmentedControl,
  Select,
  TextInput,
} from "@mantine/core";

import { IconSearch } from "@tabler/icons-react";

const ProblemFilters = ({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  sortBy,
  setSortBy,
}) => {
  return (
    <Card p="md" withBorder radius="md">
      <Group justify="between" gap="md">
        <TextInput
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftSection={<IconSearch size={16} />}
          style={{
            flexGrow: 1,
            maxWidth: 400,
          }}
        />

        <Group gap="md">
          <SegmentedControl
            value={difficulty}
            onChange={setDifficulty}
            data={[
              {
                label: "All",
                value: "all",
              },
              {
                label: "Easy",
                value: "easy",
              },
              {
                label: "Medium",
                value: "medium",
              },
              {
                label: "Hard",
                value: "hard",
              },
            ]}
          />

          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value || "newest")}
            data={[
              {
                label: "Newest First",
                value: "newest",
              },
              {
                label: "Title (A-Z)",
                value: "title",
              },
              {
                label: "Difficulty",
                value: "difficulty",
              },
            ]}
          />
        </Group>
      </Group>
    </Card>
  );
};

export default ProblemFilters;
