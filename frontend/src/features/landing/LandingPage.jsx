import { Box, Divider } from "@mantine/core";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import WorkflowSection from "./components/WorkflowSection";
import CTASection from "./components/CTASection";

const LandingPage = () => {
  return (
    <Box
      style={{
        backgroundColor: "var(--mantine-color-body)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <HeroSection />
      <Divider />
      <FeaturesSection />
      <Divider />
      <WorkflowSection />
      <CTASection />
      <Divider />
      <Footer />
    </Box>
  );
};

export default LandingPage;
