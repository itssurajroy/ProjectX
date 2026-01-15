
'use client';
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: "blur" | "empty";
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

export default function ProgressiveImage({
  src,
  alt,
  width = 400,
  height = 600,
  className,
  placeholder = "blur",
  fill,
  priority,
  sizes
}: ProgressiveImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const effectiveSrc = src || '/placeholder-image.png'; // A default placeholder if src is null/undefined

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Blur Placeholder (Progressive Loading Effect) */}
      {(loading || error) && (
        <div className={cn("absolute inset-0 bg-gray-900 animate-pulse", className)}>
          <Image
            src={BLUR_DATA_URL}
            alt="Loading..."
            fill
            className="object-cover blur-xl scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-red-400 font-bold text-xl">Image Failed</p>
            </div>
          )}
        </div>
      )}

      {/* Main Image */}
      <Image
        src={error ? '/placeholder-image.png' : effectiveSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={cn(
          "transition-opacity duration-700 object-cover",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        placeholder={placeholder === "blur" ? "blur" : "empty"}
        blurDataURL={placeholder === "blur" ? BLUR_DATA_URL : undefined}
      />
    </div>
  );
}
