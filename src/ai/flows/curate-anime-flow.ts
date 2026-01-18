
'use server';
/**
 * @fileOverview An AI flow for curating personalized anime recommendations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { AnimeService } from '@/lib/services/AnimeService';
import { SearchResult } from '@/lib/types/anime';

// Define the schema for a single watched anime
const WatchedAnimeSchema = z.object({
  title: z.string().describe('The title of the anime.'),
  genres: z.string().describe('A comma-separated string of genres for the anime.'),
  status: z.string().describe('The user\'s status for this anime (e.g., "Watching", "Completed").'),
});

// Define the input schema for the curation flow
const CurateAnimeInputSchema = z.object({
  watchedAnimes: z.array(WatchedAnimeSchema).describe('A list of anime the user has watched or has in their watchlist.'),
  theme: z.string().describe('The user-provided theme or request for the recommendation (e.g., "hidden gems", "something action-packed").'),
});
export type CurateAnimeInput = z.infer<typeof CurateAnimeInputSchema>;

// Define the schema for a single curated anime recommendation
const CuratedAnimeSchema = z.object({
  title: z.string().describe('The exact title of the recommended anime.'),
  justification: z.string().describe('A brief, compelling reason (one sentence) why this anime is recommended based on the user\'s history and theme.'),
  animeId: z.string().describe('The unique ID of the anime.'),
  posterUrl: z.string().describe('The URL for the anime\'s poster image.'),
});
export type CuratedAnime = z.infer<typeof CuratedAnimeSchema>;


// Define the output schema for the curation flow
const CurateAnimeOutputSchema = z.object({
  recommendations: z.array(CuratedAnimeSchema).describe('A list of 3-5 curated anime recommendations.'),
});
export type CurateAnimeOutput = z.infer<typeof CurateAnimeOutputSchema>;


// Define a tool to search for anime to get IDs and poster URLs
const searchAnimeTool = ai.defineTool(
    {
        name: 'searchAnime',
        description: 'Search for an anime by title to get its ID and poster URL. Use this for every anime you recommend.',
        inputSchema: z.object({
            title: z.string().describe('The title of the anime to search for.'),
        }),
        outputSchema: z.object({
            id: z.string(),
            posterUrl: z.string(),
        }),
    },
    async ({ title }) => {
        try {
            const params = new URLSearchParams({ q: title, limit: '1' });
            const searchResult: SearchResult = await AnimeService.search(params);
            const anime = searchResult?.animes?.[0];
            if (anime) {
                return { id: anime.id, posterUrl: anime.poster };
            }
        } catch (e) {
            console.error(`Error searching for anime "${title}":`, e);
        }
        return { id: 'not-found', posterUrl: '' };
    }
);


// Define the main prompt for the anime curator
const curatorPrompt = ai.definePrompt({
    name: 'animeCuratorPrompt',
    input: { schema: CurateAnimeInputSchema },
    output: { schema: CurateAnimeOutputSchema },
    tools: [searchAnimeTool],
    prompt: `You are an expert anime curator named "X-Sensei". Your task is to provide 3-5 personalized anime recommendations based on a user's watch history/watchlist and a specific theme.

User's List (Includes Watchlist and Recently Watched):
{{#each watchedAnimes}}
- Title: {{title}} (Status: {{status}}, Genres: {{genres}})
{{/each}}

User's Request: "{{theme}}"

Instructions:
1. Analyze the user's list to understand their taste in genres, themes, and styles. Pay attention to what they have 'Completed' vs 'Watching'.
2. Consider the user's specific request ("{{theme}}").
3. Generate 3-5 high-quality recommendations that match their taste and request.
4. For EACH anime you recommend, you MUST use the 'searchAnime' tool to find its exact ID and poster URL. This is mandatory.
5. Provide a short, one-sentence justification for each recommendation, explaining why the user would like it.
6. Ensure your recommendations are not already in the user's list.
7. Present the output in the required JSON format.
`,
});


// Define the Genkit flow
const curateAnimeFlow = ai.defineFlow(
    {
        name: 'curateAnimeFlow',
        inputSchema: CurateAnimeInputSchema,
        outputSchema: CurateAnimeOutputSchema,
    },
    async (input) => {
        const { output } = await curatorPrompt(input);
        
        if (!output) {
            throw new Error('The AI curator failed to generate a response.');
        }

        // Filter out any recommendations where the tool might have failed
        output.recommendations = output.recommendations.filter(
            rec => rec.animeId && rec.animeId !== 'not-found' && rec.posterUrl
        );

        if(output.recommendations.length === 0) {
             throw new Error('The AI curator could not find any suitable recommendations. Try a different theme.');
        }
        
        return output;
    }
);

// Export a wrapper function to be called from the client
export async function curateAnime(input: CurateAnimeInput): Promise<CurateAnimeOutput> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('The AI Curator is not configured. A Gemini API key is missing in your .env file.');
  }
  return await curateAnimeFlow(input);
}
