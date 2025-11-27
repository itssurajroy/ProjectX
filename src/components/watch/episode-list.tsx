import { episodes } from "@/lib/data";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EpisodeList() {
  return (
    <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Episodes</h2>
        </div>
      <ScrollArea className="h-[600px]">
        <div className="p-2 space-y-2">
          {episodes.map((ep, index) => (
            <div
              key={ep.id}
              className={cn(
                "flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-secondary",
                index === 0 && "bg-secondary"
              )}
            >
              <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={ep.thumbnail}
                  alt={ep.title}
                  fill
                  className="object-cover"
                />
                 {index === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white"/>
                    </div>
                 )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-sm truncate">{ep.title}</h3>
                <p className="text-xs text-muted-foreground">{ep.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
