"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function ClickableProductImage({ src, alt, width, height, className }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${className ?? ""}`}
        style={{ width, height }}
        title="Ampliar foto"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          className="h-full w-full object-cover transition group-hover:opacity-90"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
          Ampliar
        </span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Foto do produto ampliada"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="relative inline-block max-h-[min(90vh,900px)] max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={900}
              height={1200}
              unoptimized
              className="max-h-[min(90vh,900px)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
          </button>
          <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/90">
            Clique fora ou pressione Esc para fechar
          </p>
        </div>
      )}
    </>
  );
}
