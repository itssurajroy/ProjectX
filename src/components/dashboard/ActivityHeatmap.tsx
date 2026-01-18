
'use client';
import { format, startOfYear, endOfYear, getYear } from 'date-fns';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface ActivityHeatmapProps {
    activity: Record<string, number>;
}

export default function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
    const today = new Date();
    const year = getYear(today);

    const values = Object.entries(activity).map(([date, count]) => ({
        date: new Date(date),
        count,
    }));
    
    const colorScale = (count: number) => {
        if (count === 0) return 'var(--color-level-0)';
        if (count <= 2) return 'var(--color-level-1)';
        if (count <= 5) return 'var(--color-level-2)';
        if (count <= 8) return 'var(--color-level-3)';
        return 'var(--color-level-4)';
    };

    return (
        <div className="activity-heatmap">
            <style jsx global>{`
                .activity-heatmap {
                    --color-level-0: hsl(var(--muted) / 0.3);
                    --color-level-1: hsl(var(--primary) / 0.2);
                    --color-level-2: hsl(var(--primary) / 0.5);
                    --color-level-3: hsl(var(--primary) / 0.8);
                    --color-level-4: hsl(var(--primary));
                }
                .react-calendar-heatmap .color-empty { fill: var(--color-level-0); }
                .react-calendar-heatmap .color-filled { fill: var(--color-level-2); }
                .react-calendar-heatmap rect {
                    rx: 2;
                    ry: 2;
                    transition: fill 0.3s;
                }
                .react-calendar-heatmap text {
                    fill: hsl(var(--muted-foreground));
                    font-size: 10px;
                }
                 .react-tooltip {
                    background-color: hsl(var(--card)) !important;
                    border: 1px solid hsl(var(--border)) !important;
                    border-radius: var(--radius) !important;
                    padding: 4px 8px !important;
                    font-size: 12px !important;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                }
            `}</style>
            <CalendarHeatmap
                startDate={startOfYear(today)}
                endDate={endOfYear(today)}
                values={values}
                classForValue={(value) => {
                    if (!value) return 'color-empty';
                    if (value.count >= 8) return 'color-level-4';
                    if (value.count >= 5) return 'color-level-3';
                    if (value.count >= 2) return 'color-level-2';
                    return 'color-level-1';
                }}
                tooltipDataAttrs={(value: any) => {
                    if (!value || !value.date) return null;
                    return {
                        'data-tooltip-id': 'heatmap-tooltip',
                        'data-tooltip-content': `${format(value.date, 'MMM d, yyyy')}: ${value.count} episode${value.count > 1 ? 's' : ''}`
                    }
                }}
                showMonthLabels={true}
            />
            <ReactTooltip id="heatmap-tooltip" />
        </div>
    );
}
