'use client';
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "announcements"), (snap) => {
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const createAnnouncement = async () => {
    if (!newTitle || !newMessage) return;
    await addDoc(collection(db, "announcements"), {
      title: newTitle,
      message: newMessage,
      active: true,
      createdAt: new Date()
    });
    setNewTitle(""); setNewMessage("");
    toast.success("Announcement created!");
  };

  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, "announcements", id));
    toast.success("Announcement deleted");
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-6xl font-black text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Global Announcements • Full CRUD
        </h1>

        {/* CREATE */}
        <div className="bg-gray-900/60 rounded-3xl p-10 border border-cyan-500/40">
          <h2 className="text-3xl font-bold mb-8">Create New Announcement</h2>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title..."
            className="w-full px-8 py-6 bg-black/50 rounded-2xl text-2xl mb-6"
          />
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="w-full px-8 py-6 bg-black/50 rounded-2xl text-xl h-40 mb-6"
          />
          <button onClick={createAnnouncement} className="px-12 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl text-2xl font-bold">
            PUBLISH ANNOUNCEMENT
          </button>
        </div>

        {/* READ / DELETE */}
        {announcements.map(a => (
          <div key={a.id} className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-3xl p-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-4xl font-bold">{a.title}</h3>
                <p className="text-2xl text-gray-300 mt-4">{a.message}</p>
                <p className="text-xl text-gray-500 mt-4">Created {a.createdAt?.toDate?.().toLocaleString()}</p>
              </div>
              <button onClick={() => deleteAnnouncement(a.id)} className="px-8 py-4 bg-red-600 rounded-2xl text-xl font-bold">
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
