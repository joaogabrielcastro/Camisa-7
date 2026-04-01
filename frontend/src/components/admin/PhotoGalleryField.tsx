"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

type Props = {
  urls: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  uploading?: boolean;
  max?: number;
};

export function PhotoGalleryField({ urls, onChange, disabled, uploading, max = 15 }: Props) {
  function removeAt(i: number) {
    onChange(urls.filter((_, j) => j !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= urls.length) return;
    const next = [...urls];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <p className="font-body text-xs text-neutral-600">
        A <strong className="text-primary">primeira</strong> foto é a capa no catálogo. Arraste a ordem com as setas.
      </p>
      {urls.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 py-8 text-center font-body text-sm text-neutral-500">
          Ainda sem fotos. Use &quot;Adicionar fotos&quot; abaixo.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {urls.map((url, i) => (
            <li
              key={`${url}-${i}`}
              className="relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 shadow-sm"
            >
              <div className="relative aspect-square w-full">
                <Image src={url} alt="" fill className="object-cover" sizes="200px" unoptimized />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 font-body text-[10px] font-bold text-white">
                    Capa
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-neutral-200 bg-white p-1">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    className="rounded p-1 text-neutral-600 hover:bg-neutral-100 hover:text-primary disabled:opacity-30"
                    disabled={disabled || uploading || i === 0}
                    onClick={() => move(i, -1)}
                    aria-label="Mover para esquerda"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 text-neutral-600 hover:bg-neutral-100 hover:text-primary disabled:opacity-30"
                    disabled={disabled || uploading || i === urls.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label="Mover para direita"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  className="rounded p-1 text-error hover:bg-red-50"
                  disabled={disabled || uploading}
                  onClick={() => removeAt(i)}
                  aria-label="Remover foto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="font-body text-[11px] text-neutral-500">
        {urls.length}/{max} fotos · JPEG, PNG, GIF ou WebP · máx. 5 MB cada
      </p>
    </div>
  );
}
