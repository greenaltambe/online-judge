import { Button, Group } from "@mantine/core";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const StepperNavigation = ({
  activeStep,
  mode,
  isLoading,
  onBack,
  onNext,
  onSave,
}) => {
  const lastStep = mode === "create" ? 5 : 4;

  return (
    <Group
      justify="end"
      mt="xl"
      style={{
        borderTop: "1px solid var(--mantine-color-default-border)",
        paddingTop: "1rem",
      }}
    >
      {activeStep > 0 && (
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconChevronLeft size={16} />}
          onClick={onBack}
        >
          Back
        </Button>
      )}

      {activeStep < lastStep ? (
        <Button
          color="blue"
          rightSection={<IconChevronRight size={16} />}
          onClick={onNext}
        >
          Next Step
        </Button>
      ) : (
        <Button color="blue" loading={isLoading} onClick={onSave}>
          Save Problem
        </Button>
      )}
    </Group>
  );
};

export default StepperNavigation;
