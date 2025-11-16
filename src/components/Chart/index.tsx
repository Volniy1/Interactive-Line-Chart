import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Box,
  Card,
  Group,
  Loader,
  Select,
  Stack,
} from "@mantine/core";
import { saveAs } from "file-saver";
import { ResponsiveContainer, type MouseHandlerDataParam } from "recharts";
import { useCurrentPng } from "recharts-to-png";

import {
  IconPhotoDown,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from "@tabler/icons-react";

import type { ChartData, LineChartDataPoint } from "../../../mockData/types";
import data from "../../../mockData/mockData.json";

import CanvasChart from "./CanvasChart";
import { aggregateWeeklyData } from "./lib";

import s from "./Chart.module.scss";

export default function Chart() {
  const chartData = data as ChartData;

  // Memoize idToName and variationNames since they don't change
  const idToName = useMemo(
    () =>
      chartData.variations.reduce<Record<string, string>>((acc, variation) => {
        const id = variation.id?.toString() ?? "0";
        acc[id] = variation.name;
        return acc;
      }, {}),
    []
  );
  const variationNames = useMemo(() => Object.values(idToName), [idToName]);

  const [variation, setVariation] = useState(variationNames[0]);
  const [timePeriod, setTimePeriod] = useState("Day");
  const [chartType, setChartType] = useState("Smooth");

  // Memoize weekDayChart computation
  const weekDayChart = useMemo(
    () =>
      timePeriod === "Week"
        ? aggregateWeeklyData(idToName, chartData.data)
        : chartData.data,
    [timePeriod]
  );

  // Memoize allLineChartData computation
  const allLineChartData: LineChartDataPoint[] = useMemo(
    () =>
      weekDayChart.map((entry) => {
        // perenesti otd funkciu
        const row: LineChartDataPoint = { date: entry.date };

        Object.entries(idToName).forEach(([id, name]) => {
          const visits = entry.visits[id];
          const conversions = entry.conversions[id];
          if (!visits || !conversions) {
            return;
          }
          const conversionRate =
            visits > 0 ? +((conversions / visits) * 100).toFixed(2) : 0;

          row[name] = conversionRate;
        });

        return row;
      }),
    [weekDayChart, idToName]
  );

  // Memoize lineChartData computation
  const lineChartData: LineChartDataPoint[] = useMemo(
    () =>
      variation === "All variations"
        ? allLineChartData
        : allLineChartData
            .filter((entry) => entry[variation] !== undefined)
            .map((entry) => {
              const filteredEntry: LineChartDataPoint = { date: entry.date };
              if (entry[variation] !== undefined) {
                filteredEntry[variation] = entry[variation];
              }
              return filteredEntry;
            }),
    [variation, allLineChartData]
  );

  // Memoize maxYValue and topReferenceLineY
  const maxYValue = useMemo(
    () =>
      Math.max(
        ...lineChartData.flatMap((entry) => {
          if (variation === "All variations") {
            return variationNames.map((name) => {
              const value = entry[name];
              return typeof value === "number" ? value : 0;
            });
          } else {
            const value = entry[variation];
            return typeof value === "number" ? value : 0;
          }
        })
      ),
    [lineChartData, variation, variationNames]
  );

  // top-line to look more like the mock
  const topReferenceLineY = Math.ceil(maxYValue / 5) * 5;

  //  raw date -> readable date
  const dateToStandart = useCallback(
    (date: string, state: "month" | "day-month" | "full") => {
      if (timePeriod === "Week") {
        const [week, monthYear] = date.split(",");
        return `${monthYear.split(" ")[1]} ${week}`;
      }
      const [year, month, day] = date.split("-");
      const convertedDate = new Date(2024, Number(month) - 1, 1);
      const monthName = convertedDate.toLocaleString("en-US", {
        month: "short",
      });
      return state === "month"
        ? `${monthName}`
        : state === "day-month"
        ? `${monthName} ${day}`
        : `${month}/${day}/${year}`;
    },
    [timePeriod]
  );

  // toPng through rechart-to-png + File-saver

  const [getPng, { ref, isLoading }] = useCurrentPng();

  const handleDownload = useCallback(async () => {
    // Force a reflow to ensure styles are computed
    if (ref.current) {
      void ref.current.offsetHeight;
    }

    // Small delay to ensure all styles are applied
    await new Promise((resolve) => setTimeout(resolve, 50));

    const png = await getPng();

    if (png) {
      saveAs(png, "myChart.png");
    }
  }, [getPng, ref]);

  // point select and zooming

  const [point, setPoint] = useState<number>(0);
  const [isSelected, setIsSelected] = useState(false);

  const initIntervalLgth = lineChartData.length - 1;
  const [interval, setInterval] = useState<{ start: number; end: number }>({
    start: 0,
    end: initIntervalLgth,
  });

  const currentIntervalLgth = interval.end - interval.start + 1;

  const handleDateSelect = useCallback(
    (data: MouseHandlerDataParam) => {
      setPoint((prev) => {
        const newPoint = lineChartData.findIndex(
          (v) => v.date === data?.activeLabel
        );
        return newPoint >= 0 ? newPoint : prev;
      });
      setIsSelected(true);
    },
    [lineChartData]
  );

  const handleResetZoom = useCallback(() => {
    setInterval({
      start: 0,
      end: initIntervalLgth,
    });
    setIsSelected(false);
  }, [initIntervalLgth]);

  const handleZoomIn = useCallback(() => {
    // -20% zoom in
    const newIntervalLgth = Math.max(2, Math.floor(currentIntervalLgth * 0.8));
    // this makes the point the focused center of the new interval
    let newStart = point - Math.floor(newIntervalLgth / 2);
    let newEnd = point + Math.floor(newIntervalLgth / 2);

    if (newIntervalLgth % 2 === 0) {
      newEnd = newStart + newIntervalLgth - 1;
    }

    // prevent errors
    if (newStart < 0) {
      newStart = 0;
      newEnd = Math.min(initIntervalLgth, newIntervalLgth - 1);
    }

    if (newEnd > initIntervalLgth) {
      newEnd = initIntervalLgth;
      newStart = Math.max(0, newEnd - newIntervalLgth + 1);
    }

    // no less than 2 data points
    if (newEnd - newStart < 1) {
      return;
    }

    setInterval({ start: newStart, end: newEnd });
  }, [point, currentIntervalLgth, initIntervalLgth]);

  const handleZoomOut = useCallback(() => {
    // + 25% to zoom out
    const newIntervalLgth = Math.min(
      initIntervalLgth,
      Math.ceil(currentIntervalLgth * 1.25)
    );

    // this makes the point the focused center of the new interval
    const halfLength = Math.floor(newIntervalLgth / 2);
    let newStart = point - halfLength;
    let newEnd = point + halfLength;

    // Adjust for odd interval lengths
    if (newIntervalLgth % 2 === 0) {
      newEnd = newStart + newIntervalLgth - 1;
    }

    // no less than 2 data points
    if (newStart <= 0) {
      newStart = 0;
      newEnd = Math.min(initIntervalLgth, newIntervalLgth);
    }

    if (newEnd > initIntervalLgth) {
      newEnd = initIntervalLgth;
      newStart = Math.max(0, newEnd - newIntervalLgth);
    }

    setInterval({ start: newStart, end: newEnd });
  }, [point, currentIntervalLgth, initIntervalLgth]);

  const isZoomInDisabled = currentIntervalLgth <= 2;

  const isZoomOutDisabled =
    interval.start <= 0 && interval.end >= initIntervalLgth;

  useEffect(() => {
    handleResetZoom();
    setPoint(0);
  }, [variation, timePeriod]);
  return (
    <Card
      withBorder
      className={s.container}
      radius="lg"
      mah={"542px"}
      w="100%"
      h="100%"
    >
      <Stack gap="md" w="100%">
        <Group gap="sm" justify="space-between" wrap="nowrap">
          <Group gap={"10px"} wrap="nowrap">
            <Select
              className={s.select}
              checkIconPosition="right"
              data={[...variationNames, "All variations"]}
              value={variation}
              onChange={(v) => setVariation(v ?? "All variations")}
              maxDropdownHeight={200}
              allowDeselect={false}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 300 },
              }}
            />
            <Select
              className={s.select}
              checkIconPosition="right"
              data={["Day", "Week"]}
              value={timePeriod}
              onChange={(v) => setTimePeriod(v ?? "Day")}
              maxDropdownHeight={200}
              allowDeselect={false}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 300 },
              }}
            />
          </Group>
          <Group gap={"10px"} wrap="nowrap">
            <Select
              className={s.select}
              checkIconPosition="right"
              data={["Smooth", "Line", "Area"]}
              value={chartType}
              onChange={(v) => setChartType(v ?? "Smooth")}
              allowDeselect={false}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 300 },
              }}
            />
            <ActionIcon
              variant="default"
              size={"input-sm"}
              onClick={handleZoomOut}
              disabled={isZoomOutDisabled}
            >
              <IconZoomOut className={s.buttonIcon} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size={"input-sm"}
              onClick={handleZoomIn}
              disabled={isZoomInDisabled}
            >
              <IconZoomIn className={s.buttonIcon} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size={"input-sm"}
              onClick={handleResetZoom}
            >
              <IconZoomReset className={s.buttonIcon} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size={"input-sm"}
              onClick={handleDownload}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader size={"16"} color="gray" />
              ) : (
                <IconPhotoDown className={s.buttonIcon} stroke={1.5} />
              )}
            </ActionIcon>
          </Group>
        </Group>

        <Box w="100%" h={300}>
          <ResponsiveContainer width="100%" height="100%" ref={ref}>
            <CanvasChart
              key={variation}
              data={lineChartData}
              variationNames={variationNames}
              topReferenceLineY={topReferenceLineY}
              chartType={chartType as "Smooth" | "Line" | "Area"}
              dateToStandart={dateToStandart}
              handleDateSelect={handleDateSelect}
              interval={interval}
              selectedPointIndex={point}
              selectedDate={lineChartData[point]?.date}
              isSelected={isSelected}
            />
          </ResponsiveContainer>
        </Box>
      </Stack>
    </Card>
  );
}
