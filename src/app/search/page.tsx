'use client';

import MediaCard from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { genres, mediaItems, seasons, sortOptions, statuses, types, years } from "@/lib/data";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const filteredMedia = mediaItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-card p-4 rounded-lg border mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Input placeholder="Search..." defaultValue={query} className="col-span-2 lg:col-span-3" />
          <Select>
            <SelectTrigger><SelectValue placeholder="Genre" /></SelectTrigger>
            <SelectContent>{genres.map(g => <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>)}</SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Season" /></SelectTrigger>
            <SelectContent>{seasons.map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>{types.map(t => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{statuses.map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
            <SelectContent>{sortOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
          <Button className="col-span-2 lg:col-span-1">
            <SearchIcon className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">{query ? `Results for "${query}"` : 'All Shows'}</h2>
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <MediaCard key={item.id} media={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    )
}
