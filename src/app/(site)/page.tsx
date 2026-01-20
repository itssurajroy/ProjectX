
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProgressiveImage from '@/components/ProgressiveImage';
import { Search, Share2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SITE_NAME } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/services/AnimeService';
import { HomeData, AnimeBase } from '@/lib/types/anime';
import { useState, useEffect } from 'react';

const topSearch = [
    'Jujutsu Kaisen: The Culling..', 'One Piece', 'Hells Paradise Season 2',
    'Jujutsu Kaisen 2nd Season', 'Overflow (Uncensored)', 'Cachiakuta', 'Bleach',
    'Frieren: Beyond Journey’s...', 'Demon Slayer: Kimetsu no..', 'Frieren: Beyond Journey’s...'
];

export default function LandingPage() {
    const { data: homeData } = useQuery<HomeData>({
        queryKey: ['homeData'],
        queryFn: AnimeService.home,
    });
    
    const [backgroundAnime, setBackgroundAnime] = useState<AnimeBase | null>(null);

    useEffect(() => {
        if (homeData) {
            const animePool = [
                ...(homeData.spotlightAnimes || []),
                ...(homeData.trendingAnimes || []),
                ...(homeData.topAiringAnimes || []),
                ...(homeData.mostPopularAnimes || []),
            ].filter(Boolean); // Filter out any potential null/undefined entries

            if (animePool.length > 0) {
                const randomIndex = Math.floor(Math.random() * animePool.length);
                setBackgroundAnime(animePool[randomIndex]);
            }
        }
    }, [homeData]);


    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <ProgressiveImage
                        src={backgroundAnime?.poster || "https://picsum.photos/seed/hero-fallback/1920/1080"}
                        alt={backgroundAnime?.name || "Dynamic anime background"}
                        data-ai-hint="anime wallpaper"
                        fill
                        priority
                        className="object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>
                <div className="relative z-10 px-4 w-full max-w-3xl">
                    <h1 className="text-6xl md:text-8xl font-black text-white text-glow tracking-tight uppercase" style={{fontFamily: 'var(--font-display)', fontWeight: 900}}>
                        {SITE_NAME}
                    </h1>
                    <form className="relative mt-8" action="/search">
                        <Input
                            name="q"
                            type="text"
                            placeholder="Search anime..."
                            className="w-full h-14 rounded-full bg-background/50 backdrop-blur-sm border-2 border-border focus:border-primary pl-6 pr-16 text-lg"
                        />
                        <Button type="submit" size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90">
                            <Search className="w-5 h-5" />
                        </Button>
                    </form>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Top search:</span>
                        {topSearch.slice(0, 5).map((term, i) => (
                            <Link key={i} href={`/search?q=${term.replace(/\./g, '')}`} className="hover:text-primary hover:underline">{term}</Link>
                        ))}
                    </div>

                    <Button asChild size="lg" className="h-14 px-12 text-lg mt-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full">
                        <Link href="/tv">View Full Site <ArrowRight className="w-5 h-5 ml-2"/></Link>
                    </Button>
                </div>
            </section>
            
            {/* Content Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-4xl">
                 <div className="bg-card/50 p-4 rounded-lg border border-border flex items-center justify-between mb-12">
                    <p className="font-semibold">Share {SITE_NAME} with your friends</p>
                    <Button variant="outline" size="sm" className="gap-2"><Share2 className="w-4 h-4"/> Share</Button>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">{SITE_NAME} - Your Safe and Fast Site To Watch Anime Free Online</h2>
                    </div>
                    <div className="prose prose-invert lg:prose-lg max-w-none text-muted-foreground [&_h3]:text-foreground [&_h3]:font-bold">
                        <p>Anime has become a global phenomenon, and its popularity has skyrocketed in recent years. No matter how old you are or what background you grew up with, you can always find a good anime to watch. With 36% of viewers worldwide enjoying watching anime in 2021, according to Ampere Consumer data, free anime websites are snowballing as a result. Some are created to quench your thirst for anime, and some are there to break both your heart and bank account. Every anime enthusiast knows the pain of searching for safe and free anime websites to watch. We know it too, and we created {SITE_NAME} to end it all.</p>
                        <p>{SITE_NAME} is the new kid on the block, and that is not a disadvantage! We didn’t come to this industry of anime streaming to begin from new. {SITE_NAME} team has done a two-year of extensive research on what our users need and desire from a free anime streaming site. {SITE_NAME} is here in an attempt to meet all of your demands and make your streaming experience better, safer, and faster than ever.</p>

                        <h3>1/ What is {SITE_NAME}?</h3>
                        <p>{SITE_NAME} is a reliable and fast website for free anime watch. You can enjoy exceptional features such as ultra-HD quality and a seamless streaming experience that compares with AnimePlay, GoGoAnime, or 9anime. Plus, there’s no need to register to stream your favorite anime, which keeps your information safe. With daily updates of new episodes and titles and a vast library of popular titles, {SITE_NAME} offers year-round entertainment for all anime enthusiasts. While the website runs seamlessly on both desktop and mobile devices, it is recommended to use a desktop computer for an optimal viewing experience.</p>
                        
                        <h3>2/ Is Using {SITE_NAME} Safe?</h3>
                        <p>Absolutely! {SITE_NAME} is entirely secure and has from any potential risks. You can stream without worrying about your personal data leaking since there is no registration requirement. Additionally, there are no ads or pop ups, making it 100% safe from cybersecurity risks. Rest assured that {SITE_NAME} is as safe as Google or YouTube. So, set aside your worries and indulge in ultra-HD quality, quick loading times, and other top-notch features, all for free!</p>

                        <h3>3/ Is Using {SITE_NAME} Legal or Illegal?</h3>
                        <p>Using {SITE_NAME} to watch anime dub is deemed legal in the United States. Copyright attorneys assert that streaming anime on AnimePlay does not breach copyright law. Nevertheless, downloading or distributing pirated content is illegal. To stay out of any legal issues, it is advisable to limit yourself to online streaming or take preventive measures such as using a reputable VPN.</p>

                        <h3>4/ Is {SITE_NAME} Trustworthy? Does {SITE_NAME} Have Viruses or Malware?</h3>
                        <p>We find no point in exaggerating our features. We do not see the need to exaggerate our features, as a few clicks will show you the truth. We take pride in being the safest site to watch anime for free, as there is absolutely no risk involved. With no registration or login required, you can stay anonymous and leave no trace behind. Additionally, {SITE_NAME} is completely ad-free, which means you are 100% safe from viruses and malware.</p>

                        <h3>5/ Can You Download a {SITE_NAME} App?</h3>
                        <p>Our iOS or Android apps are on the way, and we will make sure you are the first to know once they arrive. Therefore, if you happen to find any app claiming to be {SITE_NAME} at the moment, we advise against downloading from those sources as they are all fraudulent. They typically offer substandard content and often contain malicious software that can harm your device or data. To avoid any potential harms, we strongly recommend using the only legitimate domain, {SITE_NAME}.</p>

                        <h3>6/ How to Watch Anime Free on {SITE_NAME}?</h3>
                        <p>Watching anime online on {SITE_NAME} is as easy as watching a video on YouTube. Simply follow these steps to enjoy your anime of interest:<br/>
                        - Search for the anime to watch by typing the title in the search bar or browsing through the site’s library.<br/>
                        - Click on the anime title to open its page.<br/>
                        - Check the video quality to ensure that it is suitable for your viewing experience. Some sites offer different video qualities, such as 360p, 720p, or 1080p.<br/>
                        - Click the play button to start watching.<br/>
                        - Adjust the settings of subtitles, speed, etc to suit your preferences.</p>

                        <h3>7/ Can {SITE_NAME} Compare to 9anime, 4anime, or AnimixPlay?</h3>
                        <p>While {SITE_NAME} might not be the first name that comes to mind when looking for where to watch anime for free, it has its advantages. As a newcomer to the market, {SITE_NAME} offers updated features that even some of the most popular sites like 9anime, 4anime, or AnimixPlay have yet to roll out. Overall, {SITE_NAME} provides all the same features and titles as those sites, without any cost to the user. In fact, {SITE_NAME}’s streaming speed may be faster due to less traffic. Plus, discovering a lesser-known gem like {SITE_NAME} can be a source of pride for anime enthusiasts. Overall, {SITE_NAME} is a solid choice for anyone looking for a high-quality free anime site on the internet, comparable even to some premium sites.</p>

                        <h3>8/ Why You Should Use {SITE_NAME} To Watch Anime Online?</h3>
                        <p>After researching various free anime sites, we cherry-picked the best features and eliminated the flaws to create {SITE_NAME}. Here's why we're confident in our claim of being the best site for anime streaming:</p>
                        <ul>
                            <li><strong>Safety:</strong> With no ads, no pop-ups, and no registration required, {SITE_NAME} is the safest site for you to watch free anime online.</li>
                            <li><strong>Content library:</strong> {SITE_NAME} boasts a vast collection of popular, classic, and current titles spanning all genres, including action, drama, kids, fantasy, horror, mystery, police, romance, school, comedy, music, game, and more. You can even find here content that is blocked by other sites such as free anime porn. All of these titles are either subbed in English or dubbed in various languages.</li>
                            <li><strong>Quality/Resolution:</strong> Our titles are all of excellent quality and resolution. We offer quality setting functions to cater to users with different internet speeds, ranging from 360p to 1080p.</li>
                            <li><strong>Streaming experience:</strong> With fast loading speed and no interruptions from ads and pop-ups, {SITE_NAME} provides a smooth as butter watching experience.</li>
                            <li><strong>Updates:</strong> We update our titles daily and fulfill user requests to ensure that there is always something new to watch on {SITE_NAME}.</li>
                            <li><strong>User Interface:</strong> Our user interface is user-friendly and intuitive, making it easy for everyone to navigate the site. You can search for specific titles using our search box, browse our categories, or scroll down to view new releases.</li>
                            <li><strong>Device compatibility:</strong> {SITE_NAME} works seamlessly on both desktop and mobile devices, although we recommend using a desktop for optimal streaming quality.</li>
                            <li><strong>Customer support:</strong> Our customer service team is available 24/7 to assist with any queries, requests, or business inquiries. Feel free to shoot us a message at anytime and we will get back to you ASAP.</li>
                        </ul>
                        <p>Checking out a new site takes courage. Not everyone looks for better alternatives once they are satisfied with their current anime site. We thank you for giving {SITE_NAME} a try and we hope the site does not disappoint you. If you enjoy using {SITE_NAME}, please spread the word and bookmark our site for future use.</p>
                        <p>Thank you!</p>
                    </div>
                 </div>
            </section>
        </div>
    );
}
