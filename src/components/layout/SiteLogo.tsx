
'use client';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function SiteLogo() {
    return (
        <Link href="/home" className="flex items-center gap-2" title={`${SITE_NAME} Home`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-bold font-display text-white hidden sm:inline">{SITE_NAME}</span>
        </Link>
    )
}
