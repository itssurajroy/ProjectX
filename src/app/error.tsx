
'use client';
import { AlertCircle } from "lucide-react";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-8" />
        <h1 className="text-4xl font-black text-red-400 mb-4">Something went wrong</h1>
        <p className="text-xl text-gray-400">{error.message || "Unknown error"}</p>
      </div>
    </div>
  );
}
