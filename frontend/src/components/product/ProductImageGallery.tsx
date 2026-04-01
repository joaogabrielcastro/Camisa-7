"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";

export function ProductImageGallery({
  images,
  alt,
  topRightSlot
}: {
  images: string[];
  alt: string;
  topRightSlot?: ReactNode;
}) {
  const list = images.length > 0 ? images : [];
  const [idx, setIdx] = useState(0);
  if (list.length === 0) return null;
  const main = list[Math.min(idx, list.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full max-h-[min(85vh,560px)] overflow-hidden rounded-2xl border border-neutral-300 bg-neutral-200 md:sticky md:top-24 md:max-h-[calc(100vh-6rem)]">
        {topRightSlot ? (
          <div className="absolute right-3 top-3 z-10 md:right-4 md:top-4">{topRightSlot}</div>
        ) : null}
        <Image
          src={main}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === idx ? "border-primary ring-2 ring-accent/40" : "border-neutral-300 opacity-80 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
