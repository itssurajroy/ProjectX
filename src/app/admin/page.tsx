'use client';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { Clapperboard, Users, Film } from 'lucide-react';

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
    const unsubAnime = onSnapshot(collection(db, "anime"), (snapshot) => {
      let totalEps = 0;
      snapshot.docs.forEach(doc => {
        totalEps += doc.data().episodes || 0;
      });
      setTotalAnime(snapshot.size);
      setTotalEpisodes(totalEps);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setTotalUsers(snapshot.size);
    });

    return () => {
      unsubAnime();
      unsubUsers();
    };
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
