"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ClickableProductImage } from "@/components/ClickableProductImage";
import { PhotoGalleryField } from "@/components/admin/PhotoGalleryField";
import type { Product } from "@/lib/types";
import { productGalleryUrls } from "@/lib/types";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminListSizes,
  adminUpdateProduct,
  adminUploadImage,
  type SizeOption
} from "@/lib/adminApi";

function stockMap(product: Product, sizes: SizeOption[]): Record<number, number> {
  const out: Record<number, number> = {};
  for (const s of sizes) {
    const row = product.tamanhos.find((t) => t.sizeId === s.id);
    out[s.id] = row?.stock ?? 0;
  }
  return out;
}

const MAX_FOTOS = 15;

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";
const labelClass = "mb-1 block font-body text-xs font-medium text-neutral-600";
const btnPrimary =
  "rounded-lg bg-primary px-4 py-2.5 font-sans text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50";
const btnOutline =
  "rounded-lg border-2 border-primary bg-white px-4 py-2 font-sans text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50";

export function AdminPanel() {
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [sz, list] = await Promise.all([adminListSizes(), adminListProducts()]);
      setSizes(sz);
      setProducts(list);
    } catch (e) {
      setBanner({ type: "err", text: e instanceof Error ? e.message : "Erro ao carregar dados." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="space-y-8">
      {banner && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            banner.type === "ok"
              ? "border-primary/30 bg-primary/10 text-primary-dark"
              : "border-error/40 bg-red-50 text-red-900"
          }`}
        >
          {banner.text}
        </div>
      )}

      <CreateProductForm
        sizes={sizes}
        disabled={loading || sizes.length === 0}
        onCreated={async () => {
          await refresh();
          setBanner({ type: "ok", text: "Produto criado." });
        }}
        onError={(msg) => setBanner({ type: "err", text: msg })}
      />

      <section>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-sans text-lg font-bold text-primary">Produtos</h2>
          <button
            type="button"
            onClick={() => void refresh()}
            className={btnOutline}
          >
            Atualizar lista
          </button>
        </div>

        {loading ? (
          <p className="font-body text-sm text-neutral-600">Carregando...</p>
        ) : products.length === 0 ? (
          <p className="font-body text-sm text-neutral-600">Nenhum produto cadastrado.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white shadow-card">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                <tr>
                  <th className="p-2">Foto</th>
                  <th className="p-2">Nome</th>
                  <th className="p-2">Preco</th>
                  <th className="p-2">Ativo</th>
                  {sizes.map((s) => (
                    <th key={s.id} className="p-2">
                      Est. {s.nome}
                    </th>
                  ))}
                  <th className="p-2">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    sizes={sizes}
                    colSpan={5 + sizes.length}
                    onSaved={async () => {
                      await refresh();
                      setBanner({ type: "ok", text: "Alteracoes salvas." });
                    }}
                    onDeleted={async () => {
                      await refresh();
                      setBanner({ type: "ok", text: "Produto removido." });
                    }}
                    onError={(msg) => setBanner({ type: "err", text: msg })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function CreateProductForm({
  sizes,
  disabled,
  onCreated,
  onError
}: {
  sizes: SizeOption[];
  disabled: boolean;
  onCreated: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagemUrls, setImagemUrls] = useState<string[]>([]);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [categoria, setCategoria] = useState("times");
  const [ativo, setAtivo] = useState(true);
  const [stocks, setStocks] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStocks((prev) => {
      const next = { ...prev };
      for (const s of sizes) {
        if (next[s.id] === undefined) next[s.id] = 0;
      }
      return next;
    });
  }, [sizes]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const priceNum = Number(preco.replace(",", "."));
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      onError("Preco invalido.");
      return;
    }
    const tamanhos = sizes.map((s) => ({
      tamanhoId: s.id,
      estoque: Math.max(0, Math.floor(Number(stocks[s.id] ?? 0)))
    }));
    if (!tamanhos.some((t) => t.estoque > 0)) {
      onError("Informe estoque em pelo menos um tamanho.");
      return;
    }
    if (imagemUrls.length === 0) {
      onError("Adicione pelo menos uma foto.");
      return;
    }
    setBusy(true);
    try {
      await adminCreateProduct({
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: priceNum,
        imagens: imagemUrls,
        categoria: categoria.trim() || "times",
        ativo,
        tamanhos
      });
      setNome("");
      setDescricao("");
      setPreco("");
      setImagemUrls([]);
      setCategoria("times");
      setAtivo(true);
      setStocks(Object.fromEntries(sizes.map((s) => [s.id, 0])));
      await onCreated();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erro ao criar produto.");
    } finally {
      setBusy(false);
    }
  }

  async function onEscolherFotos(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    e.target.value = "";
    if (!files?.length) return;
    if (imagemUrls.length + files.length > MAX_FOTOS) {
      onError(`No maximo ${MAX_FOTOS} fotos.`);
      return;
    }
    setUploadingFoto(true);
    try {
      const novas: string[] = [];
      for (const f of Array.from(files)) {
        novas.push(await adminUploadImage(f));
      }
      setImagemUrls((prev) => [...prev, ...novas]);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erro ao enviar foto.");
    } finally {
      setUploadingFoto(false);
    }
  }

  return (
    <section className="rounded-xl border border-neutral-300 bg-neutral-100 p-5 shadow-card md:p-6">
      <h2 className="mb-5 font-sans text-lg font-bold text-primary">Nova camisa</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className={labelClass}>Nome</span>
          <input
            required
            minLength={2}
            className={inputClass}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={disabled || busy}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className={labelClass}>Descricao</span>
          <textarea
            required
            minLength={5}
            rows={3}
            className={inputClass}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={disabled || busy}
          />
        </label>
        <label className="text-sm">
          <span className={labelClass}>Preco (R$)</span>
          <input
            required
            inputMode="decimal"
            className={inputClass}
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            disabled={disabled || busy}
          />
        </label>
        <label className="text-sm">
          <span className={labelClass}>Categoria (times ou selecao)</span>
          <input
            required
            minLength={2}
            placeholder="times ou selecao"
            className={inputClass}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            disabled={disabled || busy}
          />
        </label>

        <div className="sm:col-span-2">
          <span className={labelClass}>Fotos do produto</span>
          <PhotoGalleryField
            urls={imagemUrls}
            onChange={setImagemUrls}
            disabled={disabled || busy}
            uploading={uploadingFoto}
            max={MAX_FOTOS}
          />
          <div className="mt-3">
            <label className="inline-flex cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => void onEscolherFotos(e)}
                disabled={disabled || busy || uploadingFoto || imagemUrls.length >= MAX_FOTOS}
              />
              <span className={`${btnOutline} cursor-pointer`}>
                {uploadingFoto ? "A enviar..." : "Adicionar fotos"}
              </span>
            </label>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            disabled={disabled || busy}
            className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
          />
          <span className="font-body text-neutral-700">Ativo (visivel no catalogo)</span>
        </label>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 font-sans text-sm font-semibold text-primary">Estoque por tamanho</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sizes.map((s) => (
              <label key={s.id} className="text-sm">
                <span className={labelClass}>{s.nome}</span>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={stocks[s.id] ?? 0}
                  onChange={(e) =>
                    setStocks((prev) => ({
                      ...prev,
                      [s.id]: Number(e.target.value)
                    }))
                  }
                  disabled={disabled || busy}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <button type="submit" disabled={disabled || busy} className={btnPrimary}>
            {busy ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ProductRow({
  product,
  sizes,
  colSpan,
  onSaved,
  onDeleted,
  onError
}: {
  product: Product;
  sizes: SizeOption[];
  colSpan: number;
  onSaved: () => Promise<void>;
  onDeleted: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [preco, setPreco] = useState(product.preco.toString());
  const [ativo, setAtivo] = useState(product.ativo);
  const [imagemUrls, setImagemUrls] = useState<string[]>(() => productGalleryUrls(product));
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [stocks, setStocks] = useState<Record<number, number>>(() => stockMap(product, sizes));
  const [busy, setBusy] = useState(false);
  const [openPhotos, setOpenPhotos] = useState(false);

  useEffect(() => {
    setPreco(product.preco.toString());
    setAtivo(product.ativo);
    setImagemUrls(productGalleryUrls(product));
    setStocks(stockMap(product, sizes));
  }, [product, sizes]);

  async function saveRow() {
    const priceNum = Number(preco.replace(",", "."));
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      onError("Preco invalido.");
      return;
    }
    if (imagemUrls.length === 0) {
      onError("Mantenha pelo menos uma foto.");
      return;
    }
    setBusy(true);
    try {
      await adminUpdateProduct(product.id, {
        preco: priceNum,
        ativo,
        imagens: imagemUrls,
        tamanhos: sizes.map((s) => ({
          tamanhoId: s.id,
          estoque: Math.max(0, Math.floor(Number(stocks[s.id] ?? 0)))
        }))
      });
      await onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setBusy(false);
    }
  }

  async function removeRow() {
    if (!confirm(`Remover "${product.nome}"?`)) return;
    setBusy(true);
    try {
      await adminDeleteProduct(product.id);
      await onDeleted();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Erro ao remover.");
    } finally {
      setBusy(false);
    }
  }

  async function onAddFotos(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    e.target.value = "";
    if (!files?.length) return;
    if (imagemUrls.length + files.length > MAX_FOTOS) {
      onError(`No maximo ${MAX_FOTOS} fotos.`);
      return;
    }
    setUploadingFoto(true);
    try {
      const novas: string[] = [];
      for (const f of Array.from(files)) {
        novas.push(await adminUploadImage(f));
      }
      setImagemUrls((prev) => [...prev, ...novas]);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erro ao enviar foto.");
    } finally {
      setUploadingFoto(false);
    }
  }

  const capa = imagemUrls[0] ?? product.imagem;

  return (
    <>
      <tr className="border-b border-neutral-200 last:border-b-0">
        <td className="p-2 align-middle">
          <div className="flex flex-col items-start gap-1">
            <ClickableProductImage src={capa} alt={product.nome} width={72} height={90} />
            <span className="font-body text-[10px] text-neutral-500">
              {imagemUrls.length} foto{imagemUrls.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-0.5 font-body text-[10px] font-medium text-primary hover:underline"
              onClick={() => setOpenPhotos((o) => !o)}
            >
              {openPhotos ? (
                <>
                  Ocultar <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Gerir fotos <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </td>
        <td className="p-2 align-middle">
          <div className="max-w-[140px] font-medium leading-snug text-neutral-900">{product.nome}</div>
          <a
            href={`/produto/${product.id}`}
            className="font-body text-xs text-primary/80 underline"
            target="_blank"
            rel="noreferrer"
          >
            Ver pagina
          </a>
        </td>
        <td className="p-2 align-middle">
          <input
            className={`${inputClass} w-24 py-1.5 text-sm`}
            inputMode="decimal"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            disabled={busy}
          />
        </td>
        <td className="p-2 align-middle">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            disabled={busy}
            className="h-4 w-4 rounded text-primary focus:ring-primary"
          />
        </td>
        {sizes.map((s) => (
          <td key={s.id} className="p-2 align-middle">
            <input
              type="number"
              min={0}
              className={`${inputClass} w-14 py-1.5 text-sm`}
              value={stocks[s.id] ?? 0}
              onChange={(e) =>
                setStocks((prev) => ({
                  ...prev,
                  [s.id]: Number(e.target.value)
                }))
              }
              disabled={busy}
            />
          </td>
        ))}
        <td className="space-x-2 whitespace-nowrap p-2 align-middle">
          <button
            type="button"
            onClick={() => void saveRow()}
            disabled={busy}
            className="rounded-md bg-primary px-2 py-1.5 font-sans text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => void removeRow()}
            disabled={busy}
            className="rounded-md border border-error/50 px-2 py-1.5 font-sans text-xs text-error hover:bg-red-50 disabled:opacity-50"
          >
            Excluir
          </button>
        </td>
      </tr>
      {openPhotos && (
        <tr className="border-b border-neutral-200 bg-neutral-50">
          <td colSpan={colSpan} className="p-4">
            <p className="mb-2 font-sans text-sm font-semibold text-primary">Fotos deste produto</p>
            <PhotoGalleryField
              urls={imagemUrls}
              onChange={setImagemUrls}
              disabled={busy}
              uploading={uploadingFoto}
              max={MAX_FOTOS}
            />
            <label className="mt-3 inline-flex cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => void onAddFotos(e)}
                disabled={busy || uploadingFoto || imagemUrls.length >= MAX_FOTOS}
              />
              <span className={`${btnOutline} cursor-pointer text-xs`}>
                {uploadingFoto ? "A enviar..." : "Adicionar mais fotos"}
              </span>
            </label>
            <p className="mt-2 font-body text-xs text-neutral-500">
              Depois de alterar, clique em <strong>Salvar</strong> na linha do produto.
            </p>
          </td>
        </tr>
      )}
    </>
  );
}
