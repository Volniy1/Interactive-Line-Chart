import { useMantineColorScheme, ActionIcon } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

import Chart from "./components/Chart";

import s from "./styles/App.module.scss";

export default function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <div className={`${s.page}`}>
      <main className={s.main}>
        <div className={s.header}>
          <p> ARTHUR KOSHELENKO: Interactive Line Chart </p>
          <ActionIcon
            onClick={toggleColorScheme}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
            className={s.themeToggle}
          >
            {colorScheme === "dark" ? (
              <IconSun size={20} stroke={1.5} />
            ) : (
              <IconMoon size={20} stroke={1.5} />
            )}
          </ActionIcon>
        </div>
        <Chart />
      </main>
    </div>
  );
}
