
'use client';
import { useEffect, useState } from 'react';
import { Clapperboard, Users, Film } from 'lucide-react';
import { AnimeService } from '@/lib/services/AnimeService';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: React.ElementType, color: string }) => (
  <div className={`p-8 rounded-3xl border ${color} bg-gray-900/50`}>
    <div className="flex items-center justify-between">
      <p className="text-2xl font-bold text-gray-400">{title}</p>
      <Icon className="w-10 h-10 text-white" />
    </div>
    <p className="text-7xl font-black mt-4">{value.toLocaleString()}</p>
  </div>
);

export default function AdminDashboard() {
  const [totalAnime, setTotalAnime] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState(0);

  useEffect(() => {
    // We'll use our anime API for a rough count.
    AnimeService.search(new URLSearchParams({limit: '1'})).then(data => {
        setTotalAnime(data.totalAnimes || 0);
    });

    // Placeholder values as user and episode counts were from a database.
    setTotalUsers(1000); // Placeholder
    setTotalEpisodes(50000); // Placeholder
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-7xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-12">
        ADMIN DASHBOARD
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Anime" value={totalAnime} icon={Clapperboard} color="border-purple-500/30" />
        <StatCard title="Total Episodes" value={totalEpisodes} icon={Film} color="border-pink-500/30" />
        <StatCard title="Total Users" value={totalUsers} icon={Users} color="border-sky-500/30" />
      </div>
    </div>
  );
}
