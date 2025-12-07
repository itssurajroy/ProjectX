
// src/app/api/search/suggestion/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json({
      success: true,
      data: { suggestions: [] }
    });
  }

  try {
    const animeRef = collection(db, "anime");
    const searchLower = q.toLowerCase();

    // Search across multiple fields
    const queries = [
      query(animeRef, where("titleLower", ">=", searchLower), where("titleLower", "<=", searchLower + "\uf8ff"), limit(10)),
      query(animeRef, where("jnameLower", ">=", searchLower), where("jnameLower", "<=", searchLower + "\uf8ff"), limit(10)),
      query(animeRef, where("synonymsLower", "array-contains", searchLower), limit(10)),
    ];

    const snapshots = await Promise.all(queries.map(q => getDocs(q)));
    const unique = new Map<string, any>();

    snapshots.forEach(snap => {
      snap.docs.forEach(doc => {
        if (!unique.has(doc.id)) {
          const data = doc.data();
          unique.set(doc.id, {
            id: doc.id,
            name: data.title || data.name,
            jname: data.titleJapanese || data.jname || "",
            poster: data.coverImage || data.poster || "/placeholder.jpg",
            moreInfo: [
              data.year || "????",
              data.type?.toUpperCase() || "TV",
              data.duration ? `${data.duration}m` : "??m"
            ]
          });
        }
      });
    });

    const suggestions = Array.from(unique.values()).slice(0, 10);

    return NextResponse.json({
      success: true,
      data: { suggestions }
    });

  } catch (error) {
    console.error("Search suggestion error:", error);
    return NextResponse.json({
      success: false,
      error: "Search failed"
    }, { status: 500 });
  }
}
