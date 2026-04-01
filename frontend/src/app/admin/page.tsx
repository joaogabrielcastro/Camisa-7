import { AdminPanel } from "@/components/admin/AdminPanel";

export default function AdminPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Painel administrativo</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Cadastre camisas, ajuste preco, disponibilidade no catalogo e estoque por tamanho. Sem login nesta versao:
          use apenas em ambiente confiavel ou proteja a rota depois.
        </p>
      </div>
      <AdminPanel />
    </section>
  );
}
