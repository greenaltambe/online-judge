import {
  Card,
  Group,
  SegmentedControl,
  Select,
  TextInput,
  MultiSelect,
  Stack,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { PROBLEM_TAGS, TAG_CATEGORIES } from "../../data/problemTags";

const ProblemFilters = ({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  sortBy,
  setSortBy,
  tags,
  setTags,
}) => {
  const selectData = TAG_CATEGORIES.map((category) => ({
    group: category,
    items: PROBLEM_TAGS.filter((tag) => tag.category === category).map((tag) => ({
      value: tag.id,
      label: tag.label,
    })),
  })).filter((group) => group.items.length > 0);

  return (
    <Card p="md" withBorder radius="md">
      <Stack gap="md">
        <Group gap="md" grow>
          <TextInput
            placeholder="Search problems by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{
              flexGrow: 1,
            }}
          />

          <MultiSelect
            placeholder="Filter by tags (e.g. Array, DFS)..."
            data={selectData}
            value={tags}
            onChange={setTags}
            searchable
            clearable
            nothingFoundMessage="No tags found"
            style={{
              flexGrow: 1,
            }}
          />
        </Group>

        <Group justify="space-between" gap="md">
          <SegmentedControl
            value={difficulty}
            onChange={setDifficulty}
            data={[
              {
                label: "All Problems",
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
      </Stack>
    </Card>
  );
};

export default ProblemFilters;
