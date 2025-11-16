import type { ChartData } from "../../../mockData/types";

export const getVarColour = (variation: number) => {
  switch (variation) {
    case 1:
      return "#4142ef";
    case 2:
      return "#ff8346";
    case 3:
      return "#35BDAD";

    default:
      return "#46464f";
  }
};

export const getWeekOfMonth = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay();
  const dayOfMonth = date.getDate();

  const weekNumber = Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
  return weekNumber;
};

export const formatWeekLabel = (date: Date): string => {
  const weekNumber = getWeekOfMonth(date);
  const monthName = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `Week ${weekNumber}, ${monthName} ${year}`;
};

export const aggregateWeeklyData = (
  idToName: Record<string, string>,
  data: ChartData["data"]
) => {
  const weeklyMap = new Map<
    string,
    {
      visits: Record<string, number>;
      conversions: Record<string, number>;
      weekLabel: string;
      firstDate: Date;
    }
  >();

  data.forEach((entry) => {
    const date = new Date(entry.date);
    const weekLabel = formatWeekLabel(date);

    const weekKey = `${date.getFullYear()}-${date.getMonth()}-${getWeekOfMonth(
      date
    )}`;

    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, {
        visits: {},
        conversions: {},
        weekLabel,
        firstDate: date,
      });
    }

    const weekData = weeklyMap.get(weekKey)!;

    Object.keys(idToName).forEach((id) => {
      const visits = entry.visits[id] || 0;
      const conversions = entry.conversions[id] || 0;

      weekData.visits[id] = (weekData.visits[id] || 0) + visits;
      weekData.conversions[id] = (weekData.conversions[id] || 0) + conversions;
    });
  });

  return Array.from(weeklyMap.values())
    .sort((a, b) => a.firstDate.getTime() - b.firstDate.getTime())
    .map((weekData) => ({
      date: weekData.weekLabel,
      visits: weekData.visits,
      conversions: weekData.conversions,
    }));
};
