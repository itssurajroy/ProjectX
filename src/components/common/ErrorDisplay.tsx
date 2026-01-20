
'use client';

import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isCompact?: boolean;
}

export default function ErrorDisplay({
  title = "Something Went Wrong",
  description = "We couldn't load the content you were looking for. Please try again in a moment.",
  onRetry,
  isCompact = false,
}: ErrorDisplayProps) {
  
  const containerClasses = cn(
    "flex flex-col items-center justify-center text-center",
    isCompact ? "p-4" : "h-screen p-4"
  );
  
  const titleClasses = cn(
    "font-bold",
    isCompact ? "text-lg mb-1" : "text-2xl mb-2"
  );

  return (
    <div className={containerClasses}>
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h1 className={titleClasses}>{title}</h1>
      <p className="text-muted-foreground max-w-md">{description}</p>
      <div className="flex gap-4 mt-6">
        {onRetry && (
          <Button onClick={onRetry}>
            Try Again
          </Button>
        )}
        <Button variant="secondary" asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" /> Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
