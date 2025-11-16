export interface Variation {
  id?: number;
  name: string;
}

export interface ChartDataPoint {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface ChartData {
  variations: Variation[];
  data: ChartDataPoint[];
}

// Final Chart type
export interface LineChartDataPoint {
  date: string;
  [key: string]: string | number;
}
