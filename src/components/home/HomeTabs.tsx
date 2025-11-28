'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeData } from "@/types/anime";
import { AnimeSection } from "./AnimeSection";

interface HomeTabsProps {
    homeData: HomeData;
}

const HomeTabs = ({ homeData }: HomeTabsProps) => {
    return (
        <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="top-airing">Top Airing</TabsTrigger>
                <TabsTrigger value="recently-updated">Recently Updated</TabsTrigger>
                <TabsTrigger value="most-popular">Most Popular</TabsTrigger>
                <TabsTrigger value="most-favorite">Most Favorite</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="trending">
                <AnimeSection title="Trending" animes={homeData.trendingAnimes} />
            </TabsContent>
            <TabsContent value="top-airing">
                <AnimeSection title="Top Airing" animes={homeData.topAiringAnimes} />
            </TabsContent>
            <TabsContent value="recently-updated">
                 <AnimeSection title="Latest Episodes" animes={homeData.latestEpisodeAnimes} />
            </TabsContent>
            <TabsContent value="most-popular">
                 <AnimeSection title="Most Popular" animes={homeData.mostPopularAnimes} />
            </TabsContent>
             <TabsContent value="most-favorite">
                 <AnimeSection title="Most Favorite" animes={homeData.mostFavoriteAnimes} />
            </TabsContent>
             <TabsContent value="completed">
                 <AnimeSection title="Latest Completed" animes={homeData.latestCompletedAnimes} />
            </TabsContent>
        </Tabs>
    )
}

export default HomeTabs;
