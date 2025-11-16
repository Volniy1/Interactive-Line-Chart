import { Dot } from "recharts";

export default function CustomActiveDot({
  cx,
  cy,
  selected,
  color,
  onClick,
}: {
  cx?: number;
  cy?: number;
  payload?: any;
  selected?: boolean;
  color?: string;
  onClick?: () => void;
}) {
  if (!cx || !cy) return null;

  return (
    <Dot
      cx={cx}
      cy={cy}
      r={selected ? 8 : 6}
      fill={selected ? color : "#fff"}
      stroke={color}
      strokeWidth={selected ? 3 : 2}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    />
  );
}
