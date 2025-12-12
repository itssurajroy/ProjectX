
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';

interface GenreChartProps {
    data: { name: string; count: number }[];
}

export default function GenreChart({ data }: GenreChartProps) {
    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip 
                        content={<ChartTooltipContent />}
                        cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
