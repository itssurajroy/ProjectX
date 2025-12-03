
'use client';
import Link from "next/link";

const categories = [
  { name: "General Discussion", icon: "💬", threads: 2847, slug: "general" },
  { name: "Recommendations", icon: "⭐", threads: 1923, slug: "recommendations" },
  { name: "Memes & Shitposting", icon: "😂", threads: 5672, slug: "memes" },
  { name: "Theories & Analysis", icon: "🧠", threads: 893, slug: "theories" },
  { name: "Episode Discussion", icon: "📺", threads: 12477, slug: "episodes" },
];

export default function ForumCategories() {
  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/forum/c/${cat.slug}`}
          className="block p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{cat.icon}</span>
              <div>
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <p className="text-gray-400">{cat.threads.toLocaleString()} threads</p>
              </div>
            </div>
            <span className="text-3xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
