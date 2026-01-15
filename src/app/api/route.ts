
// This file is intentionally left blank.
// The wildcard route at /api/[...path]/route.ts handles all API requests.
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Welcome to the ProjectX API proxy." });
}
