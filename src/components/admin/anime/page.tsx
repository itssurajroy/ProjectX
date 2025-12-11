
'use client';
import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import ProgressiveImage from "@/components/ProgressiveImage";
import { CldUploadButton } from "next-cloudinary";

export default function AnimeManagement() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const firestore = useFirestore();

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "anime"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAnimeList(data);
    });
    return unsub;
  }, [firestore]);

  const deleteAnime = async (id: string) => {
    if (confirm("Delete this anime forever? This action cannot be undone.")) {
      await deleteDoc(doc(firestore, "anime", id));
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ANIME MANAGEMENT ({animeList.length})
        </h1>
        <CldUploadButton
          uploadPreset="anime-posters"
          onSuccess={(result: any) => console.log(result.info.secure_url)}
          className="px-10 py-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-2xl font-bold hover:scale-105 transition-transform"
        >
          + ADD ANIME
        </CldUploadButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {animeList.map(anime => (
          <div key={anime.id} className="bg-gray-900/80 rounded-3xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:-translate-y-1">
            <div className="relative w-full h-96">
                <ProgressiveImage 
                  src={anime.coverImage}
                  alt={anime.title || "Anime Cover"} 
                  fill
                  className="object-cover" 
                />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold truncate">{anime.title}</h3>
              <div className="flex gap-2 flex-wrap h-14 overflow-y-auto">
                {anime.genres?.map((g: string) => (
                  <span key={g} className="px-3 py-1 bg-purple-900/50 rounded-full text-sm">
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-gray-400">Episodes: {anime.episodes || 'N/A'} • Score: {anime.score || 'N/A'}</p>
              <div className="flex gap-4 mt-6">
                <button className="flex-1 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                  Edit
                </button>
                <button 
                  onClick={() => deleteAnime(anime.id)}
                  className="flex-1 py-4 bg-red-600 rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
