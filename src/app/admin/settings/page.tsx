import { AdminLayout } from "@/components/admin/AdminLayout";
export default function SettingsPage() {
  return (
    <AdminLayout current="settings">
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-7xl font-black text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Site Settings
        </h1>
        {[
          { name: "Maintenance Mode", desc: "Show maintenance page to all users", color: "red" },
          { name: "Disable Signups", desc: "Block new registrations", color: "yellow" },
          { name: "Force HTTPS", desc: "Redirect HTTP to HTTPS", color: "green" },
          { name: "Enable API Access", desc: "Allow third-party apps", color: "blue" },
        ].map(s => (
          <div key={s.name} className="bg-gray-900/60 rounded-3xl p-10 border border-gray-700 flex justify-between items-center">
            <div>
              <p className="text-4xl font-bold">{s.name}</p>
              <p className="text-2xl text-gray-400 mt-4">{s.desc}</p>
            </div>
            <button className={`px-16 py-8 text-3xl font-black rounded-3xl bg-gradient-to-r from-${s.color}-600 to-${s.color}-700 hover:scale-110 transition`}>
              {s.name.includes("Disable") || s.name === "Maintenance Mode" ? "ENABLED" : "DISABLED"}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
