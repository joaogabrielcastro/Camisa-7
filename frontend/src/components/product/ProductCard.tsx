import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { isProductNovo } from "@/lib/productDisplay";
import type { Product } from "@/lib/types";
import { FavoriteButton } from "./FavoriteButton";

export function ProductCard({ product }: { product: Product }) {
  const novo = isProductNovo(product.createdAt);
  const totalStock = product.tamanhos.reduce((s, t) => s + t.stock, 0);
  const esgotado = totalStock === 0;
  const cat = product.categoria.toLowerCase();
  const tipoLabel = cat === "selecao" ? "Seleção" : cat === "times" ? "Clube" : product.categoria;

  return (
    <article className="group overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 shadow-card">
      <div className="relative aspect-[4/5] w-full bg-neutral-200">
        <Image
          src={product.imagem}
          alt={product.nome}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute left-1.5 top-1.5 z-10 flex flex-wrap gap-1">
          {novo && <Badge variant="novo">Novo</Badge>}
          {esgotado && <Badge variant="esgotado">Esgotado</Badge>}
        </div>
        <div className="absolute right-1.5 top-1.5 z-10">
          <FavoriteButton productId={product.id} label={product.nome} />
        </div>
      </div>
      <div className="space-y-2 p-3">
        <p className="font-body text-[10px] font-medium uppercase tracking-wide text-neutral-800/55">
          {tipoLabel}
        </p>
        <h3 className="font-sans text-sm font-bold leading-snug text-primary line-clamp-2">{product.nome}</h3>
        <p className="font-body text-base font-bold text-primary">R$ {product.preco.toFixed(2)}</p>
        <Link
          href={`/produto/${product.id}`}
          className="flex w-full items-center justify-center rounded-md border-2 border-primary py-2 font-sans text-xs font-bold text-primary hover:bg-primary hover:text-neutral-100"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
