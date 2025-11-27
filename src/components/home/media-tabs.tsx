import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mediaItems } from "@/lib/data"
import MediaCard from "../media/media-card"

const tabs = [
  { value: "trending", label: "Trending" },
  { value: "top-airing", label: "Top Airing" },
  { value: "recently-updated", label: "Recently Updated" },
  { value: "most-popular", label: "Most Popular" },
  { value: "most-viewed", label: "Most Viewed" },
];

// Helper to shuffle array for variety
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


export default function MediaTabs() {
  return (
    <Tabs defaultValue="trending" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {shuffleArray([...mediaItems]).map((item) => (
              <MediaCard key={`${tab.value}-${item.id}`} media={item} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
