import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminCookieName, getAdminSessionMaxAgeSeconds, createAdminSessionToken } from "@/lib/adminAuth";

type LoginPageProps = {
  searchParams?: {
    error?: string;
    next?: string;
  };
};

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    redirect("/admin/login?error=config");
  }

  if (password !== expectedPassword) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const token = createAdminSessionToken();
  cookies().set({
    name: getAdminCookieName(),
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAdminSessionMaxAgeSeconds()
  });

  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export default function AdminLoginPage({ searchParams }: LoginPageProps) {
  const nextPath = searchParams?.next && searchParams.next.startsWith("/admin") ? searchParams.next : "/admin";
  const error = searchParams?.error;

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border border-neutral-300 bg-neutral-100 p-6 shadow-card">
      <h1 className="font-sans text-2xl font-bold text-primary">Login do admin</h1>
      <p className="mt-2 font-body text-sm text-neutral-700">
        Entre com a senha do painel para acessar a área administrativa.
      </p>

      {error === "invalid" && (
        <p className="mt-4 rounded-md border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
          Senha inválida.
        </p>
      )}
      {error === "config" && (
        <p className="mt-4 rounded-md border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-800">
          Configure `ADMIN_PASSWORD` no ambiente para habilitar o login.
        </p>
      )}

      <form action={loginAction} className="mt-5 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <div className="space-y-1.5">
          <label htmlFor="password" className="font-body text-sm font-medium text-neutral-800">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Entrar no admin
        </button>
      </form>
    </section>
  );
}
