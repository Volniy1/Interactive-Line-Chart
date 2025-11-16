import { Card, ColorSwatch, Divider, Group, Stack, Text } from "@mantine/core";

import CalendarIcon from "@public/media/calendar.svg?react";
import TrophyIcon from "@public/media/trophy.svg?react";

import s from "./ToolTip.module.scss";

type PayloadEntry = {
  dataKey?: string;
  value?: number;
  name?: string;
  color?: string;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: readonly PayloadEntry[];
  label?: string | number;
  dateToStandart: (
    date: string,
    format: "month" | "day-month" | "full"
  ) => string;
}

export default function CustomTooltip({
  active,
  payload,
  label,
  dateToStandart,
}: CustomTooltipProps) {
  if (!active || !payload || !label) return null;

  const bigestValue = Math.max(
    ...payload.map((v) => (!!v.value ? v.value : 0))
  );

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      miw={200}
      p="12px"
      className={s.tooltip}
    >
      <Stack gap={12}>
        <Group gap="8px" align="center">
          <CalendarIcon width={16} height={16} className="icon" />
          <Text size="12px" fw={600} className={s.tooltipText}>
            {dateToStandart(String(label), "full")}
          </Text>
        </Group>
        <Divider />
        <Stack gap={4}>
          {payload
            .filter((entry) => entry && typeof entry.value === "number")
            .sort((a, b) => (b.value || 0) - (a.value || 0))
            .map((entry, index) => {
              if (!entry || typeof entry.value !== "number") return null;

              return (
                <Group
                  key={entry.dataKey || `entry-${index}`}
                  justify="space-between"
                  align="center"
                  gap="sm"
                  className={s.ToolTipVariant}
                >
                  <Group gap={6} align="center">
                    <ColorSwatch
                      color={entry.color || "#000"}
                      size={12}
                      radius="xl"
                    />
                    <Text size="xs" className={s.tooltipText}>
                      {entry.name || ""}
                    </Text>
                    {entry.value === bigestValue && (
                      <TrophyIcon className="icon" />
                    )}
                  </Group>

                  <Group gap={6} align="center">
                    <Text size="xs" className={s.tooltipText} fw={500}>
                      {entry.value.toFixed(0)}%
                    </Text>
                  </Group>
                </Group>
              );
            })}
        </Stack>
      </Stack>
    </Card>
  );
}
