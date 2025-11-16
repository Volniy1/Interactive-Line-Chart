import {
  Area,
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  type MouseHandlerDataParam,
} from "recharts";

import CustomTooltip from "./Tooltip";

import type { LineChartDataPoint } from "../../../mockData/types";
import { getVarColour } from "./lib";

import s from "./Chart.module.scss";

interface ILineChart {
  data: LineChartDataPoint[];
  variationNames: string[];
  topReferenceLineY: number;
  chartType: "Smooth" | "Line" | "Area";
  dateToStandart: (
    date: string,
    state: "month" | "day-month" | "full"
  ) => string;
  handleDateSelect: (val: MouseHandlerDataParam) => void;
  interval: { start: number; end: number };
  selectedPointIndex: number;
  selectedDate: string;
  isSelected: boolean;
}

export default function CanvasChart({
  data,
  variationNames,
  topReferenceLineY,
  chartType,
  dateToStandart,
  handleDateSelect,
  interval,
  selectedPointIndex,
  selectedDate,
  isSelected = false,
}: ILineChart) {
  return (
    <ComposedChart
      data={data}
      margin={{
        top: 0,
        right: 5,
        left: -20,
        bottom: 35,
      }}
      className={s.chart}
      onClick={handleDateSelect}
    >
      <CartesianGrid
        vertical={true}
        horizontal={false}
        strokeDasharray="10.5"
        className={s.grid}
        fill={"none"}
      />
      <ReferenceLine
        y={topReferenceLineY}
        strokeDasharray="0"
        strokeWidth={1}
        className={s.axis}
      />
      <ReferenceLine
        x={data[data.length - 1]?.date}
        strokeDasharray="0"
        strokeWidth={1}
        className={s.axis}
      />
      {selectedDate && isSelected && (
        <ReferenceLine
          x={selectedDate}
          strokeDasharray="3 3"
          strokeWidth={2}
          className={s.selectedPointLine}
        />
      )}
      <XAxis
        dataKey="date"
        tickFormatter={(tick) => dateToStandart(tick, "day-month")}
        tick={{ fontSize: 11, dy: 5 }}
        className={s.axis}
        tickLine={false}
        interval={"equidistantPreserveStart"}
      />
      <YAxis
        domain={[0, topReferenceLineY]}
        tickFormatter={(v) => `${v}%`}
        tick={{ fontSize: 11, dx: -5 }}
        className={s.axis}
        tickLine={false}
      />
      <Tooltip
        animationDuration={300}
        content={(props) => (
          <CustomTooltip {...props} dateToStandart={dateToStandart} />
        )}
      />
      {variationNames.map((name, id) =>
        chartType !== "Area" ? (
          <Line
            key={id}
            type={chartType === "Smooth" ? "monotone" : "linear"}
            stroke={getVarColour(id)}
            dataKey={name}
            strokeWidth={2}
            dot={false}
            name={name}
            animationDuration={500}
          />
        ) : (
          <Area
            key={name}
            type="monotone"
            fill={getVarColour(id)}
            stroke={getVarColour(id)}
            dataKey={name}
            strokeWidth={2}
            dot={false}
            name={name}
            animationDuration={500}
          />
        )
      )}
      {selectedDate &&
        isSelected &&
        variationNames.map((name, id) => {
          const selectedValue = data[selectedPointIndex]?.[name];
          if (selectedValue === undefined) return null;
          return (
            <ReferenceDot
              key={`dot-${id}`}
              x={selectedDate}
              y={selectedValue}
              r={6}
              fill={getVarColour(id)}
              stroke="#fff"
              strokeWidth={2}
              className={s.selectedPointDot}
            />
          );
        })}

      <Brush
        dataKey="date"
        height={20}
        className={s.brush}
        fill="transparent"
        stroke={undefined}
        travellerWidth={8}
        startIndex={interval.start}
        endIndex={interval.end}
        alwaysShowText
      />
    </ComposedChart>
  );
}
