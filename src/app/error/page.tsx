import Link from "next/link";

type Props = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ErrorPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Algo deu errado</h1>
        <p className="mt-3 text-sm text-zinc-600">
          {params.message ?? "Não foi possível concluir a autenticação."}
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Voltar para login
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Ir para home
          </Link>
        </div>
      </div>
    </main>
  );
}
