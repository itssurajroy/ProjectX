// src/app/admin/users/page.tsx
'use client';
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    const q = query(collection(firestore, "users"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [firestore]);

  return (
    <AdminLayout current="users">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl hover:scale-105 transition">
            Export All Users
          </button>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-purple-500/30 overflow-hidden">
          <div className="p-8 border-b border-purple-500/20">
            <input type="text" placeholder="Search by name, email, UID..." className="w-full px-8 py-5 bg-gray-800/50 rounded-2xl text-xl focus:outline-none focus:ring-4 focus:ring-purple-500" />
          </div>

          <div className="divide-y divide-purple-500/20">
            {users.map((user: any) => (
              <div key={user.id} className="p-8 hover:bg-purple-900/20 transition-all flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black">
                    {user.displayName?.[0] || "A"}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{user.displayName || "Anonymous"}</p>
                    <p className="text-purple-400 text-lg">{user.email}</p>
                    <p className="text-gray-400">Level {user.level || 1} • {user.xp || 0} XP • Joined {user.createdAt ? new Date(user.createdAt?.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className={`px-6 py-3 rounded-full font-bold text-lg ${
                    user.banned ? "bg-red-900/80 text-red-400" :
                    user.warned ? "bg-yellow-900/80 text-yellow-400" :
                    "bg-green-900/80 text-green-400"
                  }`}>
                    {user.banned ? "BANNED" : user.warned ? "WARNED" : "ACTIVE"}
                  </span>
                  {!user.banned && (
                    <>
                      <button className="px-6 py-3 bg-yellow-600 rounded-xl font-bold hover:bg-yellow-700">Warn</button>
                      <button className="px-6 py-3 bg-red-600 rounded-xl font-bold hover:bg-red-700">Ban</button>
                    </>
                  )}
                  <button className="px-6 py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-700">Edit XP</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
