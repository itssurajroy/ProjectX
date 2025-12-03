// src/app/(site)/forum/page.tsx
import ForumCategories from "@/components/forum/ForumCategories";
import ForumSidebar from "@/components/forum/ForumSidebar";

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Community Forum
            </h1>
            <ForumCategories />
          </div>
          <ForumSidebar />
        </div>
      </div>
    </div>
  );
}
