// src/app/api/staff/[id]/route.ts
// This is a placeholder/mock API route.
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    
    const mockData = {
        id: id,
        name: `Voice Actor ${id}`,
        poster: `https://picsum.photos/seed/va-${id}/400/400`,
        description: `This is a mock description for voice actor (staff) ${id}. They are a famous voice actor known for a wide range of roles across many popular anime series.`,
        roles: [
            {
                character: { id: 'satoru-gojo', name: 'Satoru Gojo', poster: 'https://picsum.photos/seed/gojo/200/300' },
                anime: { id: 'jujutsu-kaisen-tv', name: 'Jujutsu Kaisen' }
            },
            {
                character: { id: 'levi-ackerman', name: 'Levi Ackerman', poster: 'https://picsum.photos/seed/levi/200/300' },
                anime: { id: 'attack-on-titan', name: 'Attack on Titan' }
            },
            {
                character: { id: 'kakashi-hatake', name: 'Kakashi Hatake', poster: 'https://picsum.photos/seed/kakashi/200/300' },
                anime: { id: 'naruto-shippuden', name: 'Naruto Shippuden' }
            },
            {
                character: { id: 'osamu-dazai', name: 'Osamu Dazai', poster: 'https://picsum.photos/seed/dazai/200/300' },
                anime: { id: 'bungo-stray-dogs', name: 'Bungo Stray Dogs' }
            }
        ]
    };

    return NextResponse.json(mockData);
}

export const dynamic = 'force-dynamic';
