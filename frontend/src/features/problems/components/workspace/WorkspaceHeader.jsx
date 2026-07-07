import { Group, Button, Divider, Text, Badge, Select, Tooltip, ActionIcon } from "@mantine/core";
import { IconArrowLeft, IconSettings, IconBookmark } from "@tabler/icons-react";
import { getDifficultyColor } from "../../utils/difficulty";

const WorkspaceHeader = ({
  currentProblem,
  language,
  onLanguageChange,
  onOpenSettings,
  onBack,
  onAddToList,
}) => {
  return (
    <Group
      justify="space-between"
      pb="xs"
      style={{
        borderBottom: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Group>
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBack}
        >
          Back to Problems
        </Button>
        <Divider orientation="vertical" h={20} />
        {currentProblem && (
          <>
            <Text fw={700} size="lg">
              {currentProblem.problem.title}
            </Text>
            <Badge
              color={getDifficultyColor(currentProblem.problem.difficulty)}
              variant="light"
            >
              {currentProblem.problem.difficulty}
            </Badge>
          </>
        )}
      </Group>

      <Group>
        {/* Language select */}
        <Select
          value={language}
          onChange={onLanguageChange}
          data={[
            { label: "C++", value: "cpp" },
            { label: "Java", value: "java" },
            { label: "Python", value: "python" },
          ]}
          style={{ width: 120 }}
        />

        {/* Add to list button */}
        <Tooltip label="Add to List">
          <ActionIcon
            variant="default"
            size="lg"
            onClick={onAddToList}
            aria-label="Add to list"
          >
            <IconBookmark size={18} />
          </ActionIcon>
        </Tooltip>

        {/* Settings button */}
        <Tooltip label="Editor Settings">
          <ActionIcon
            variant="default"
            size="lg"
            onClick={onOpenSettings}
            aria-label="Editor settings"
          >
            <IconSettings size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
};

export default WorkspaceHeader;
