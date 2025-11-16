import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";

import App from "./App.tsx";

import "./styles/globals.scss";

const theme = createTheme({
  fontFamily: "Righteous",
  primaryColor: "blue",
  colors: {
    dark: [
      "#ffffff",
      "#c7c5d0",
      "#a1a3ff",
      "#414163",
      "#414163",
      "#000018",
      "#000018",
      "#000027",
      "#000027",
      "#000027",
    ],
  },
  defaultRadius: "sm",
  primaryShade: { light: 6, dark: 4 },
});

createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={theme} defaultColorScheme="light">
    <App />
  </MantineProvider>
);
