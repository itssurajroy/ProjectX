
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import CountUp from 'react-countup';

const StatCard = ({ 
    title, 
    value, 
    subtitle,
    icon: Icon,
    accent
}: { 
    title: string, 
    value: string | number, 
    subtitle?: string,
    icon: React.ElementType,
    accent?: 'purple' | 'gold' | 'red' | 'default'
}) => {
    
    const accentClasses = {
        purple: 'text-purple-400 border-purple-500/30 group-hover:shadow-purple-500/20',
        gold: 'text-amber-400 border-amber-500/30 group-hover:shadow-amber-500/20',
        red: 'text-red-400 border-red-500/30 group-hover:shadow-red-500/20',
        default: 'text-primary border-primary/30 group-hover:shadow-primary/20'
    };
    
    const valueIsNumber = typeof value === 'number' && !isNaN(value);

    return (
        <Card className={cn(
            "bg-card/50 border-border/50 group transition-all hover:-translate-y-1 hover:shadow-xl",
             accentClasses[accent || 'default']
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">
                    {valueIsNumber ? (
                        <CountUp end={value} duration={2} separator="," />
                    ) : (
                        value
                    )}
                </div>
                {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </CardContent>
        </Card>
    );
};

export default StatCard;
