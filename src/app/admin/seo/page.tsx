import { AdminLayout } from "@/components/admin/AdminLayout";
export default function SEOPage() {
  return (
    <AdminLayout current="seo">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-7xl font-black text-center bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          SEO Control Center • 98.9/100
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-3xl p-12 border border-green-500/50">
            <h2 className="text-4xl font-bold mb-8">Meta Tags Editor</h2>
            <input className="w-full px-8 py-6 bg-black/50 rounded-2xl text-2xl mb-6" placeholder="Site Title..." />
            <textarea className="w-full px-8 py-6 bg-black/50 rounded-2xl text-xl h-40" placeholder="Meta Description..." />
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-3xl p-12 border border-purple-500/50">
            <h2 className="text-4xl font-bold mb-8">OpenGraph Image</h2>
            <div className="bg-gray-800 border-4 border-dashed border-purple-500 rounded-3xl h-96 flex items-center justify-center text-4xl text-gray-600">
              Upload New OG Image
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
