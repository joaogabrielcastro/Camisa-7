"use client";

import Link from "next/link";
import { X } from "lucide-react";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Como pedir">
      <button
        type="button"
        className="absolute inset-0 bg-neutral-900/40"
        aria-label="Fechar carrinho"
        onClick={onClose}
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-neutral-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-300 px-4 py-3">
          <h2 className="font-sans text-base font-semibold text-primary">Pedido</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-neutral-800 hover:bg-neutral-200"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-body text-sm text-neutral-800">
            Escolha a camisa, o tamanho e envie pelo <strong className="text-primary">WhatsApp</strong> — a mensagem
            já vem pronta.
          </p>
          <Link
            href="/home"
            onClick={onClose}
            className="w-full rounded-md border-2 border-primary bg-primary py-3 font-sans text-sm font-semibold text-neutral-100 transition hover:bg-primary-dark"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
