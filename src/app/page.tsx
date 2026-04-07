import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { claims },
  } = await supabase.auth.getClaims();

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Crie seu currículo por link</h1>

        <p className="mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg">
          Gere um currículo online bonito, profissional e fácil de compartilhar.
        </p>

        {claims?.sub ? (
          <>
            <p className="mt-4 text-sm text-zinc-600">Conectado como {claims.email}</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/create"
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Criar currículo
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Dashboard
              </Link>

              <LogoutButton />
            </div>
          </>
        ) : (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Entrar
            </Link>

            <Link
              href="/signup"
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Criar conta
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
