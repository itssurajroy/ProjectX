'use client';
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, deleteDoc, doc, Timestamp } from "firebase/firestore";

export default function CommentsPage() {
  const firestore = useFirestore();
  const [filter, setFilter] = useState("all");
  
  const commentsCollection = useMemoFirebase(() => collection(firestore, "comments"), [firestore]);

  const commentsQuery = useMemoFirebase(() => {
    let q = query(commentsCollection);
    if (filter === "flagged") {
        // Assuming a 'reports' field exists which is an array of report objects
        q = query(commentsCollection, where("reports", "!=", []));
    }
    if (filter === "today") {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        q = query(commentsCollection, where("timestamp", ">=", startOfToday));
    }
    return q;
  }, [filter, commentsCollection]);

  const { data: comments, isLoading } = useCollection<any>(commentsQuery);

  const deleteComment = async (id: string) => {
    // Note: The path to comments might be nested, e.g., /comments/{animeId}/general/{commentId}
    // This simplified example assumes a top-level 'comments' collection.
    await deleteDoc(doc(firestore, "comments", id));
  };

  return (
    <AdminLayout current="comments">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Comment Moderation
          </h1>
          <div className="flex gap-4">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-8 py-4 bg-gray-800 rounded-2xl text-xl text-white">
              <option value="all">All Comments</option>
              <option value="flagged">Flagged Only</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-10 rounded-3xl text-center">
            <p className="text-6xl font-black">{isLoading ? '...' : (comments?.length || 0).toLocaleString()}</p>
            <p className="text-2xl mt-4 opacity-90">Total Comments</p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-orange-600 p-10 rounded-3xl text-center">
            <p className="text-6xl font-black">127</p>
            <p className="text-2xl mt-4 opacity-90">Flagged</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-10 rounded-3xl text-center">
            <p className="text-6xl font-black">99.7%</p>
            <p className="text-2xl mt-4 opacity-90">Clean</p>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading && <div className="text-center p-10">Loading comments...</div>}
          {comments?.map((c: any) => (
            <div key={c.id} className={`p-8 rounded-3xl border ${c.reports?.length > 0 ? "border-red-500/50 bg-red-900/20" : "border-purple-500/20"} backdrop-blur-xl`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                      {c.username?.[0]}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{c.username}</p>
                      <p className="text-purple-400">→ {c.animeId} • Ep {c.episodeId}</p>
                    </div>
                  </div>
                  <p className="text-xl leading-relaxed">{c.text}</p>
                  <p className="text-gray-500 mt-4">Posted {c.timestamp ? new Date(c.timestamp?.seconds * 1000).toLocaleString() : 'a while ago'}</p>
                </div>
                <div className="flex flex-col gap-4 ml-8">
                  {c.reports?.length > 0 && <span className="px-6 py-3 bg-red-600 rounded-2xl font-bold">REPORTED {c.reports.length}x</span>}
                  <button onClick={() => deleteComment(c.id)} className="px-8 py-4 bg-red-600 rounded-2xl font-bold hover:bg-red-700 transition">
                    DELETE
                  </button>
                  <button className="px-8 py-4 bg-gray-700 rounded-2xl font-bold hover:bg-gray-600 transition">
                    HIDE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
