import { AdminPanel } from "@/components/admin/AdminPanel";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminCookieName } from "@/lib/adminAuth";

async function logoutAction() {
  "use server";
  cookies().delete(getAdminCookieName());
  redirect("/admin/login");
}

export default function AdminPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold">Painel administrativo</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-primary hover:text-primary"
          >
            Sair do admin
          </button>
        </form>
      </div>
      <p className="mt-1 text-sm text-zinc-600">
        Cadastre camisas, ajuste preco, disponibilidade no catalogo e estoque por tamanho.
      </p>
      <AdminPanel />
    </section>
  );
}
