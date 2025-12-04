
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { TrendingUp, TrendingDown, Users, Eye, DollarSign, Activity } from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeToday: number;
  totalViewsWeek: number;
  revenue: number;
  serverCost: number;
  profitMargin: number;
}

export default function DashboardStats() {
  const firestore = useFirestore();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeToday: 0,
    totalViewsWeek: 0,
    revenue: 0,
    serverCost: 892, // Update monthly
    profitMargin: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    };
    
    // Real-time listeners
    const unsubscribers: (() => void)[] = [];

    // 1. Total Users
    const usersRef = collection(firestore, 'users');
    const usersUnsub = onSnapshot(usersRef, (snap) => {
      setStats(prev => ({ ...prev, totalUsers: snap.size }));
      setLoading(false);
    }, () => { setLoading(false); });
    unsubscribers.push(usersUnsub);

    // 2. Active Today (users with lastActive today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(usersRef, where('lastActive', '>=', today));
    const activeUnsub = onSnapshot(q, (snap) => {
      setStats(prev => ({ ...prev, activeToday: snap.size }));
    }, () => {});
    unsubscribers.push(activeUnsub);

    // 3. Total Views This Week (from analytics collection)
    const analyticsRef = collection(firestore, 'analytics');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const viewsQuery = query(analyticsRef, where('timestamp', '>=', weekAgo));
    const viewsUnsub = onSnapshot(viewsQuery, (snap) => {
      const views = snap.docs.reduce((acc, doc) => acc + (doc.data().views || 0), 0);
      setStats(prev => ({ ...prev, totalViewsWeek: views }));
    }, () => {});
    unsubscribers.push(viewsUnsub);

    // 4. Revenue (from premium payments + ads)
    const fetchRevenue = async () => {
      try {
        const paymentsSnap = await getDocs(collection(firestore, 'payments'));
        const revenue = paymentsSnap.docs
          .filter(doc => doc.data().status === 'completed')
          .reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
        setStats(prev => {
          const profit = revenue - prev.serverCost;
          const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
          return { ...prev, revenue, profitMargin: margin };
        });
      } catch (e) {
          console.log("Could not fetch revenue, maybe the collection 'payments' does not exist.")
      }
    };
    fetchRevenue();

    // Cleanup
    return () => unsubscribers.forEach(unsub => unsub());
  }, [firestore]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+18%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
    },
    {
      title: 'Active Today',
      value: stats.activeToday.toLocaleString(),
      change: '+12%',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      trend: 'up',
    },
    {
      title: 'Views This Week',
      value: (stats.totalViewsWeek / 1_000_000).toFixed(1) + 'M',
      change: '+42%',
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
    },
    {
      title: 'Revenue',
      value: '$' + stats.revenue.toLocaleString(),
      change: '+' + ((stats.revenue / 10000) * 100).toFixed(0) + '%',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      trend: 'up',
    },
    {
      title: 'Server Cost',
      value: '$' + stats.serverCost,
      change: '-3%',
      icon: DollarSign,
      color: 'from-red-500 to-rose-500',
      trend: 'down',
    },
    {
      title: 'Profit Margin',
      value: stats.profitMargin + '%',
      change: '+5%',
      icon: TrendingUp,
      color: stats.profitMargin >= 90 ? 'from-emerald-500 to-teal-500' : 'from-orange-500 to-red-500',
      trend: stats.profitMargin >= 90 ? 'up' : 'down',
    },
  ];

  if (loading) {
    return <StatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-black border border-border backdrop-blur-xl shadow-lg"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/5 backdrop-blur">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-black text-white mt-2">
              {stat.value}
            </p>
            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (stats.totalUsers / 1000) * 100 || 75)}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${stat.color}`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card/50 border border-border rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-10 w-10 bg-muted rounded-xl" />
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
          <div className="h-4 w-32 bg-muted rounded mb-2" />
          <div className="h-10 w-24 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
