
import { getAdminDb } from "@/firebase/server";
import { SITE_NAME } from "./constants";

export interface SeoTemplates {
    animeTitle?: string;
    animeDesc?: string;
    watchTitle?: string;
    watchDesc?: string;
    pageTitle?: string;
    pageDesc?: string;
    searchTitle?: string;
    searchDesc?: string;
    moviesTitle?: string;
    moviesDesc?: string;
    tvTitle?: string;
    tvDesc?: string;
}

// Simple in-memory cache for SEO templates
let seoTemplatesCache: SeoTemplates | null = null;
let lastSeoFetch = 0;
const SEO_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getSeoTemplates(): Promise<SeoTemplates> {
    const now = Date.now();
    if (seoTemplatesCache && (now - lastSeoFetch < SEO_CACHE_DURATION)) {
        return seoTemplatesCache;
    }

    try {
        const adminDb = getAdminDb();
        const doc = await adminDb.doc('settings/seo').get();
        if (doc.exists) {
            seoTemplatesCache = doc.data() as SeoTemplates;
            lastSeoFetch = now;
            return seoTemplatesCache;
        }
    } catch (error) {
        console.error("Error fetching SEO templates:", error);
    }
    
    // Return default/empty if fetch fails or doc doesn't exist
    return {};
}

export function applyTemplate(template?: string, replacements?: Record<string, string>): string {
    let result = template || '';
    if (!result) return '';

    const allReplacements = {
        ...replacements,
        '{{site_name}}': SITE_NAME
    };
    
    for (const key in allReplacements) {
        if (Object.prototype.hasOwnProperty.call(allReplacements, key)) {
            const value = allReplacements[key as keyof typeof allReplacements] || '';
            result = result.replace(new RegExp(key, 'g'), value);
        }
    }

    return result;
}
