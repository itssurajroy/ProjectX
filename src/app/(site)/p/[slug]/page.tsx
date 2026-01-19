
import { getAdminDb } from "@/firebase/server";
import { Page } from "@/lib/types/page";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getSeoTemplates, applyTemplate } from "@/lib/seo";

export const runtime = 'nodejs';

type Props = {
    params: { slug: string }
}

async function getPage(slug: string): Promise<Page | null> {
    const adminDb = getAdminDb();
    const pagesRef = collection(adminDb, 'pages');
    const q = query(pagesRef, where('slug', '==', slug), where('status', '==', 'published'), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
        id: doc.id,
        ...data
    } as Page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const page = await getPage(params.slug);
    
    if (!page) {
        return {
            title: `Page Not Found | ${SITE_NAME}`,
        }
    }
    
    const templates = await getSeoTemplates();
    const replacements = {
        '{{page_title}}': page.title,
        '{{page_description}}': page.metaDescription || page.content.substring(0, 160),
    };

    const title = applyTemplate(templates.pageTitle || '{{page_title}} | {{site_name}}', replacements);
    const description = applyTemplate(templates.pageDesc || '{{page_description}}', replacements);

    return {
        title,
        description,
    }
}


export default async function StaticPage({ params }: Props) {
    const page = await getPage(params.slug);

    if (!page) {
        notFound();
    }
    
    return (
        <div className="container mx-auto max-w-4xl py-24 px-4">
            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle className="text-3xl lg:text-4xl font-bold text-center text-glow">
                        {page.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <article className="prose prose-invert lg:prose-xl mx-auto max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {page.content}
                        </ReactMarkdown>
                    </article>
                </CardContent>
            </Card>
        </div>
    )
}
