
'use client';

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, ListFilter } from "lucide-react";

interface WatchlistControlsProps {
    sortOrder: string;
    setSortOrder: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
}

const WatchlistControls = ({ sortOrder, setSortOrder, statusFilter, setStatusFilter }: WatchlistControlsProps) => {
    const statuses = ['All', 'Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'];
    const sortOptions = [
        { value: 'addedAt_desc', label: 'Recently Added' },
        { value: 'name_asc', label: 'Title (A-Z)' },
        { value: 'name_desc', label: 'Title (Z-A)' },
    ];

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Bookmark className="w-8 h-8 text-primary" />
                    Watchlist
                </h1>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <ListFilter className="w-4 h-4" />
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                                {sortOptions.map(opt => (
                                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full sm:w-auto">
                    {statuses.map(s => (
                        <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </>
    )
}

export default WatchlistControls;
