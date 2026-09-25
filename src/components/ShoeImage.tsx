'use client';

import React, { useState } from 'react';
import { Footprints } from 'lucide-react';

interface ShoeImageProps {
  src?: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  brand?: string;
}

export default function ShoeImage({
  src,
  alt,
  className = '',
  size = 'md',
  brand,
}: ShoeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dimension presets
  const sizeClasses = {
    sm: 'w-10 h-10 min-w-[2.5rem]',
    md: 'w-14 h-14 min-w-[3.5rem]',
    lg: 'w-20 h-20 min-w-[5rem]',
    xl: 'w-full h-36 min-h-[9rem]',
  };

  const isEmoji = src && src.length <= 4 && !src.startsWith('http') && !src.startsWith('/');

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-100/90 border border-slate-200/70 flex items-center justify-center shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {/* If source is an image URL and has not errored */}
      {src && !hasError && !isEmoji ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-slate-200/60 animate-pulse flex items-center justify-center">
              <Footprints className="w-4 h-4 text-slate-400" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            loading="lazy"
            className={`w-full h-full object-cover object-center transition-all duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
          />
        </>
      ) : isEmoji ? (
        <span className="text-2xl drop-shadow-2xs">{src}</span>
      ) : (
        /* Elegant fallback graphic */
        <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
          <Footprints className="w-5 h-5 text-indigo-400/80 mb-0.5" />
          {brand && (
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter truncate max-w-full px-1">
              {brand.slice(0, 8)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
