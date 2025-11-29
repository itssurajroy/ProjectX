
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}

          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 shrink-0" />
          )}
        </div>
      ))}
    </nav>
  );
}
