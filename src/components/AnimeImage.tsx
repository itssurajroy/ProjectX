
'use client';
import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER = "https://via.placeholder.com/400x600/1a1a1a/ffffff?text=No+Image";

export default function AnimeImage({
  src,
  alt,
  width = 400,
  height = 600,
  className = "object-cover rounded-lg",
  ...props
}: {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: any; // Allow other props like 'fill'
}) {
  const [currentSrc, setCurrentSrc] = useState(src || PLACEHOLDER);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={props.fill ? undefined : width}
      height={props.fill ? undefined : height}
      className={className}
      unoptimized={true} // ← Extra safety
      onError={() => {
        if (currentSrc !== PLACEHOLDER) {
          setCurrentSrc(PLACEHOLDER);
        }
      }}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      {...props}
    />
  );
}
