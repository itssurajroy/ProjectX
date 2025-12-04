
'use client';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns';

interface ActivityHeatmapProps {
    activity: Record<string, number>;
}

export default function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
    const year = new Date().getFullYear();
    const yearStart = startOfYear(new Date(year, 0, 1));
    const yearEnd = endOfYear(new Date(year, 11, 31));
    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });
  
    return (
      <Calendar
        showOutsideDays={false}
        numberOfMonths={12}
        pagedNavigation
        className="w-full"
        classNames={{
            months: 'flex flex-col sm:flex-row flex-wrap gap-y-6',
            month: 'space-y-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4',
            caption_label: 'text-base font-bold',
            day: (date) => {
                const dateString = format(date, 'yyyy-MM-dd');
                const count = activity[dateString] || 0;
                let colorClass = '';
                if (count > 0) {
                    if (count > 8) colorClass = "bg-primary/90 text-primary-foreground";
                    else if (count > 5) colorClass = "bg-primary/70 text-primary-foreground";
                    else if (count > 3) colorClass = "bg-primary/50 text-primary-foreground";
                    else colorClass = "bg-primary/30";
                }
                return cn(colorClass);
            }
        }}
        modifiers={{
            activity: (date) => (activity[format(date, 'yyyy-MM-dd')] || 0) > 0
        }}
        modifiersClassNames={{
            activity: 'font-bold'
        }}
      />
    );
}
