// src/app/api/character/[id]/route.ts
// This is a placeholder/mock API route.
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    // In a real API, you would fetch character details from a database or another service.
    // For now, we'll return mock data.
    const mockData = {
        id: id,
        name: `Character ${id}`,
        poster: `https://picsum.photos/seed/${id}/400/600`,
        description: `This is a mock description for character ${id}. They are a pivotal character in several major story arcs, known for their unique abilities and complex background. More details would be fetched from a real database.`,
        anime: [
            { id: 'jujutsu-kaisen-tv', name: 'Jujutsu Kaisen', poster: 'https://picsum.photos/seed/jujutsu/200/300', type: 'TV' },
            { id: 'jujutsu-kaisen-0-movie', name: 'Jujutsu Kaisen 0', poster: 'https://picsum.photos/seed/jujutsu0/200/300', type: 'Movie' },
            { id: 'one-piece-100', name: 'One Piece', poster: 'https://picsum.photos/seed/onepiece/200/300', type: 'TV' },
        ]
    };

    return NextResponse.json(mockData);
}

export const dynamic = 'force-dynamic';
