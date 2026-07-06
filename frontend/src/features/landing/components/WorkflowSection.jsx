import { Container, Text, Timeline } from "@mantine/core";

import SectionHeading from "./SectionHeading";
import { workflow } from "../data/workflow";

const WorkflowSection = () => {
  return (
    <Container size="md" py={80}>
      <SectionHeading badge="Workflow" title="How GreenCode Works" />

      <Timeline active={3} bulletSize={30} lineWidth={2} color="blue">
        {workflow.map((step) => {
          const Icon = step.icon;

          return (
            <Timeline.Item
              key={step.title}
              bullet={<Icon size={16} />}
              title={step.title}
            >
              <Text c="dimmed" size="sm">
                {step.description}
              </Text>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Container>
  );
};

export default WorkflowSection;
