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
      "#ffffff", // dark[0] - icon-dg-color / text-primary (lightest)
      "#c7c5d0", // dark[1] - variation-light
      "#a1a3ff", // dark[2] - variation-lightblue
      "#414163", // dark[3] - grid-dk
      "#414163", // dark[4] - background-dk
      "#000018", // dark[5] - foreground-dk
      "#000018", // dark[6]
      "#000027", // dark[7]
      "#000027", // dark[8]
      "#000027", // dark[9] - darkest
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
