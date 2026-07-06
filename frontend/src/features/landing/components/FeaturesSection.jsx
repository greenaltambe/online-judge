import { Container, SimpleGrid } from "@mantine/core";

import FeatureCard from "./FeatureCard";
import SectionHeading from "./SectionHeading";
import { features } from "../data/features";

const FeaturesSection = () => {
  return (
    <Container size="xl" py={80}>
      <SectionHeading
        badge="Features"
        title="Engineered for Visual and Technical Excellence"
      />

      <SimpleGrid cols={{ base: 1, sm: 3 }} gap="xl">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default FeaturesSection;
