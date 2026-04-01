import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductPurchase } from "@/components/ProductPurchase";
import { getProductById } from "@/lib/api";
import { productGalleryUrls } from "@/lib/types";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const gallery = productGalleryUrls(product);

  return (
    <section className="grid gap-8 md:grid-cols-2 md:gap-12">
      <ProductImageGallery
        images={gallery}
        alt={product.nome}
        topRightSlot={<FavoriteButton productId={product.id} label={product.nome} />}
      />
      <div className="flex flex-col space-y-5">
        <div className="space-y-2">
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-primary/80">{product.categoria}</p>
          <h1 className="font-sans text-2xl font-bold text-primary md:text-3xl">{product.nome}</h1>
          <p className="font-body text-2xl font-bold text-primary md:text-[22px]">
            R$ {product.preco.toFixed(2)}
          </p>
          <p className="font-body text-xs text-neutral-800/65">Valores e envio combinados no WhatsApp</p>
        </div>
        <p className="font-body text-sm leading-relaxed text-neutral-800 md:text-[15px]">{product.descricao}</p>
        <ProductPurchase product={product} />
      </div>
    </section>
  );
}
