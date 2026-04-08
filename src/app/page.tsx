import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
              Currículo por link
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Crie um currículo online bonito, rápido e fácil de compartilhar.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Monte seu currículo, gere um link próprio, edite quando quiser e
              baixe em PDF em poucos cliques.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={user ? "/create" : "/signup"}
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                {user ? "Criar currículo" : "Criar minha conta"}
              </Link>

              <Link
                href={user ? "/dashboard" : "/login"}
                className="rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
              >
                {user ? "Ir ao dashboard" : "Entrar"}
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
                Exemplo
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-950">
                Ana Souza
              </h2>
              <p className="mt-2 text-zinc-600">Designer de Produto</p>

              <div className="mt-6 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="font-medium text-zinc-950">Resumo</p>
                  <p className="mt-2 leading-6 text-zinc-600">
                    Profissional com foco em interfaces claras, conversão e UX.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="font-medium text-zinc-950">Contato</p>
                  <p className="mt-2 text-zinc-600">ana@email.com</p>
                  <p className="text-zinc-600">São Paulo, SP</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
