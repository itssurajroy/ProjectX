
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    
    if (!path) {
        return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Remove the 'path' parameter itself from the search params to pass the rest to the target API
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('path');

    const apiBase = process.env.HIANIME_API_BASE;
    if (!apiBase) {
        return NextResponse.json({ error: 'API base URL is not configured' }, { status: 500 });
    }
    
    const targetUrl = `${apiBase}${path}?${newSearchParams.toString()}`;

    try {
        const apiRes = await fetch(targetUrl, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!apiRes.ok) {
            const errorBody = await apiRes.text();
            return NextResponse.json({ error: `API Error: ${errorBody}` }, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: 'Proxy error: ' + error.message }, { status: 500 });
    }
}
