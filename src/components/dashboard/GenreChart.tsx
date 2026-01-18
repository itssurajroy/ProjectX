
'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface GenreData {
  name: string;
  value: number; 
  fill: string;
}

interface Props {
  data: GenreData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-2 shadow-sm text-card-foreground">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-bold">{payload[0].name}</span>
            <span className="text-sm text-muted-foreground">
              {payload[0].value} episodes
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export default function GenreChart({ data }: Props) {
  if (!data?.length) {
    return (
      <div className="bg-card/50 rounded-lg p-6 border border-border/50 text-center">
        <p className="text-muted-foreground">No genre data yet...</p>
        <p className="text-sm mt-2">Watch more to reveal your cursed preferences</p>
      </div>
    );
  }

  return (
    <div className="bg-card/50 rounded-xl p-4 border border-border/50">
      <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        Genre Distribution
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke={"hsl(var(--card))"} strokeWidth={2} />
              ))}
            </Pie>

            <Tooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
              content={<CustomTooltip />}
            />

            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ paddingLeft: '20px' }}
              formatter={(value) => <span className="text-sm text-foreground truncate max-w-[120px]">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
