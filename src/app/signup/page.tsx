import Link from "next/link";
import { redirect } from "next/navigation";
import { signup } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { claims },
  } = await supabase.auth.getClaims();

  if (claims?.sub) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Criar conta</h1>
        <p className="mt-2 text-sm text-zinc-600">Cadastre-se para salvar e editar seus currículos.</p>

        {params.error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}

        <form action={signup} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none ring-0 transition focus:border-zinc-900"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none ring-0 transition focus:border-zinc-900"
              placeholder="mínimo 6 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-zinc-700">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none ring-0 transition focus:border-zinc-900"
              placeholder="repita sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Criar conta
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
