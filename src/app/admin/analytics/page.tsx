
'use client';
import { BarChart } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="p-10 text-center">
      <BarChart className="w-24 h-24 text-emerald-500 mx-auto mb-8" />
      <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
        Analytics
      </h1>
      <p className="text-xl text-gray-400 mt-4">This module is under construction.</p>
    </div>
  );
}
