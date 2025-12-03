'use client';
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const settingsRef = doc(db, "config", "site");

  useEffect(() => {
    const unsub = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      } else {
        // Initialize settings if they don't exist
        setDoc(settingsRef, {
          maintenance: false,
          disableSignups: false,
          requireEmailVerify: false,
        });
      }
    });
    return unsub;
  }, [settingsRef]);

  const toggleSetting = async (key: string) => {
    await updateDoc(settingsRef, { [key]: !settings[key] });
    toast.success(`${key} ${!settings[key] ? "enabled" : "disabled"}`);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-7xl font-black text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Site Configuration • Full Control
        </h1>

        {[
          { key: "maintenance", label: "Maintenance Mode", desc: "Show maintenance page" },
          { key: "disableSignups", label: "Disable New Signups", desc: "Block registrations" },
          { key: "requireEmailVerify", label: "Email Verification", desc: "Require email confirm" },
        ].map(s => (
          <div key={s.key} className="bg-gray-900/60 rounded-3xl p-12 border border-purple-500/30 flex justify-between items-center">
            <div>
              <p className="text-4xl font-bold">{s.label}</p>
              <p className="text-2xl text-gray-400 mt-4">{s.desc}</p>
            </div>
            <button
              onClick={() => toggleSetting(s.key)}
              className={`px-16 py-8 text-3xl font-black rounded-3xl transition-all ${
                settings[s.key]
                  ? "bg-gradient-to-r from-red-600 to-orange-600"
                  : "bg-gradient-to-r from-green-600 to-emerald-600"
              }`}
            >
              {settings[s.key] ? "ENABLED" : "DISABLED"}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
