import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./App.jsx";

// Import Mantine and custom CSS styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "./index.css";

// Create custom theme with elegant colors
const theme = createTheme({
  fontFamily: "'Inter', sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', monospace",
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        size: "sm",
      },
    },
    Card: {
      defaultProps: {
        withBorder: true,
        padding: "md",
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" zIndex={2000} />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
