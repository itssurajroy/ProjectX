'use client';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function AdminLogo() {
    return (
        <Link href="/admin" className="relative group" title="Admin Dashboard">
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {SITE_NAME}
            </h1>
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        </Link>
    )
}
