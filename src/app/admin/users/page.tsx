'use client';
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [xpInput, setXpInput] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const updateXP = async (userId: string) => {
    if (!xpInput || isNaN(parseInt(xpInput))) {
      toast.error("Invalid XP value");
      return;
    }
    await updateDoc(doc(db, "users", userId), { xp: parseInt(xpInput) });
    toast.success("XP updated!");
    setEditingUser(null);
  };

  const banUser = async (userId: string) => {
    await updateDoc(doc(db, "users", userId), { banned: true, bannedAt: new Date() });
    toast.success("User banned");
  };

  const deleteUser = async (userId: string) => {
    if (confirm("Delete this user permanently?")) {
      await deleteDoc(doc(db, "users", userId));
      toast.success("User deleted");
    }
  };

  return (
    <AdminLayout current="users">
      <div className="space-y-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          User Management • Full CRUD
        </h1>

        <div className="space-y-6">
          {users.map(user => (
            <div key={user.id} className="bg-gray-900/60 rounded-3xl p-8 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-3xl font-bold">
                    {user.displayName?.[0] || "A"}
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{user.displayName}</p>
                    <p className="text-xl text-purple-400">{user.email}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-2xl">Level {user.level || 1}</span>
                      {editingUser === user.id ? (
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={xpInput}
                            onChange={(e) => setXpInput(e.target.value)}
                            className="w-32 px-4 py-2 bg-gray-800 rounded-xl"
                            placeholder="XP"
                          />
                          <button onClick={() => updateXP(user.id)} className="px-6 py-2 bg-green-600 rounded-xl">Save</button>
                        </div>
                      ) : (
                        <span className="text-2xl text-yellow-400">{user.xp || 0} XP</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => { setEditingUser(user.id); setXpInput(user.xp || "0"); }} className="px-6 py-3 bg-blue-600 rounded-xl font-bold">Edit XP</button>
                  <button onClick={() => banUser(user.id)} className="px-6 py-3 bg-red-600 rounded-xl font-bold">Ban</button>
                  <button onClick={() => deleteUser(user.id)} className="px-6 py-3 bg-gray-700 rounded-xl font-bold">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
