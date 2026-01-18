
'use client';

import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface GenreChartProps {
  data: { name: string; count: number }[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--primary) / 0.5)",
  "hsl(var(--primary) / 0.4)",
  "hsl(var(--primary) / 0.3)",
  "hsl(var(--primary) / 0.2)",
  "hsl(var(--primary) / 0.1)",
];

export default function GenreChart({ data }: GenreChartProps) {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = { label: item.name };
    return acc;
  }, {} as ChartConfig);
  
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          stroke="hsl(var(--background))"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
