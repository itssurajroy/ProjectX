
// src/app/(site)/forum/page.tsx
import ForumCategories from "@/components/forum/ForumCategories";
import ForumSidebar from "@/components/forum/ForumSidebar";

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Project X Forum
          </h1>
          <ForumCategories />
        </div>
        <ForumSidebar />
      </div>
    </div>
  );
}
