'use client';
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import PermissionGuard from "@/components/admin/PermissionGuard";


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
    <AdminLayout>
      <div className="space-y-10">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          User Management
        </h1>

        <PermissionGuard permission="manage_users">
          <div className="bg-gray-900/60 rounded-3xl p-10 border border-green-500/50">
            <h2 className="text-3xl font-bold mb-8 text-green-400">You can view all users</h2>
            {/* Full user list */}
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
                              <PermissionGuard permission="edit_user_xp">
                                <>
                                  <input
                                    type="number"
                                    value={xpInput}
                                    onChange={(e) => setXpInput(e.target.value)}
                                    className="w-32 px-4 py-2 bg-gray-800 rounded-xl"
                                    placeholder="XP"
                                  />
                                  <button onClick={() => updateXP(user.id)} className="px-6 py-2 bg-green-600 rounded-xl">Save</button>
                                </>
                              </PermissionGuard>
                            </div>
                          ) : (
                            <span className="text-2xl text-yellow-400">{user.xp || 0} XP</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                        <PermissionGuard permission="edit_user_xp">
                            <button onClick={() => { setEditingUser(user.id); setXpInput(user.xp || "0"); }} className="px-6 py-3 bg-blue-600 rounded-xl font-bold">Edit XP</button>
                        </PermissionGuard>
                         <PermissionGuard permission="ban_users">
                            <button onClick={() => banUser(user.id)} className="px-6 py-3 bg-red-600 rounded-xl font-bold">Ban</button>
                        </PermissionGuard>
                         <PermissionGuard permission="delete_users">
                            <button onClick={() => deleteUser(user.id)} className="px-6 py-3 bg-gray-700 rounded-xl font-bold">Delete</button>
                        </PermissionGuard>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PermissionGuard>

        <PermissionGuard permission="ban_users">
          <div className="mt-8 bg-red-900/30 rounded-3xl p-10 border border-red-500/50">
            <h2 className="text-3xl font-bold mb-8 text-red-400">BAN CONTROL PANEL</h2>
            <button className="px-12 py-6 bg-red-600 text-2xl font-black rounded-2xl hover:scale-110 transition">
              BAN USER BY UID
            </button>
          </div>
        </PermissionGuard>

        <PermissionGuard permission="edit_user_xp">
          <div className="mt-8 bg-yellow-900/30 rounded-3xl p-10 border border-yellow-500/50">
            <h2 className="text-3xl font-bold mb-8 text-yellow-400">XP EDITOR</h2>
            <input placeholder="User UID" className="px-8 py-6 bg-black/50 rounded-2xl text-2xl" />
            <input placeholder="New XP" className="px-8 py-6 bg-black/50 rounded-2xl text-2xl ml-4" />
            <button className="px-12 py-6 bg-yellow-600 text-2xl font-black rounded-2xl ml-4">
              UPDATE XP
            </button>
          </div>
        </PermissionGuard>

        <PermissionGuard permission="delete_users">
          <div className="mt-8 bg-red-950/50 rounded-3xl p-10 border border-red-700">
            <h2 className="text-4xl font-bold text-red-500 mb-8">NUCLEAR OPTION</h2>
            <button className="px-20 py-10 bg-gradient-to-r from-red-700 to-black text-3xl font-black rounded-3xl hover:scale-110 transition shadow-2xl">
              PERMANENTLY DELETE USER
            </button>
          </div>
        </PermissionGuard>
      </div>
    </AdminLayout>
  );
}
