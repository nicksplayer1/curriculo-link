import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteResume, duplicateResume } from "./actions";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import LogoutButton from "@/components/auth/logout-button";
import DeleteResumeButton from "@/components/dashboard/delete-resume-button";

export const metadata = {
  title: "Dashboard",
};

type Props = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("id, slug, name, role, updated_at, created_at, is_public")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const params = (await searchParams) || {};
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://curriculo-link.vercel.app";

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-zinc-600 sm:text-base">
                Gerencie seus currículos, copie links, edite e exclua quando quiser.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Novo currículo
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            Usuário autenticado: <span className="font-medium">{user.email}</span>
          </div>

          {params.success ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {params.success}
            </div>
          ) : null}

          {params.error || error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error || "Não foi possível carregar seus currículos."}
            </div>
          ) : null}
        </section>

        {!resumes || resumes.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
              Nenhum currículo ainda
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-950">
              Crie seu primeiro currículo agora.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
              Você ainda não criou nenhum currículo. Comece agora para gerar um
              link próprio e baixar em PDF.
            </p>
            <Link
              href="/create"
              className="mt-6 inline-flex rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Criar meu primeiro currículo
            </Link>
          </section>
        ) : (
          <section className="grid gap-4">
            {resumes.map((resume) => {
              const publicUrl = `${baseUrl}/cv/${resume.slug}`;

              return (
                <article
                  key={resume.id}
                  className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          {resume.name}
                        </h2>
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                          {resume.is_public ? "Público" : "Privado"}
                        </span>
                      </div>

                      {resume.role ? (
                        <p className="mt-2 text-zinc-600">{resume.role}</p>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                        <span>Criado em {formatDate(resume.created_at)}</span>
                        <span>Atualizado em {formatDate(resume.updated_at)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/cv/${resume.slug}`}
                        className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                        target="_blank"
                      >
                        Ver currículo
                      </Link>

                      <Link
                        href={`/edit/${resume.id}`}
                        className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                      >
                        Editar
                      </Link>

                      <CopyLinkButton url={publicUrl} />

                      <form action={duplicateResume}>
                        <input type="hidden" name="resumeId" value={resume.id} />
                        <button
                          type="submit"
                          className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                        >
                          Duplicar
                        </button>
                      </form>

                      <form action={deleteResume}>
                        <input type="hidden" name="resumeId" value={resume.id} />
                        <DeleteResumeButton />
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
