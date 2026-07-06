import { Card, Select, Stack, TextInput } from "@mantine/core";

const BasicInfoStep = ({ title, setTitle, difficulty, setDifficulty }) => {
  return (
    <Card mt="xl" p="lg" withBorder radius="md">
      <Stack gap="md">
        <TextInput
          label="Problem Title"
          placeholder="e.g. FizzBuzz, Add Two Numbers"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Select
          label="Difficulty Rating"
          value={difficulty}
          onChange={(value) => setDifficulty(value || "easy")}
          data={[
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
      </Stack>
    </Card>
  );
};

export default BasicInfoStep;
