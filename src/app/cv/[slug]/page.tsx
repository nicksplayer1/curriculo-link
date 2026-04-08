import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureUrl, splitLines } from "@/lib/resume-utils";
import PublicResumeActions from "@/components/cv/public-resume-actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: resume } = await supabase
    .from("resumes")
    .select("name, role, summary, is_public")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!resume) {
    return {
      title: "Currículo não encontrado",
    };
  }

  return {
    title: resume.name,
    description: resume.summary || resume.role || "Currículo online",
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-zinc-200 px-6 py-10 sm:px-10 print:px-0 print:py-8">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-950">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function ResumePublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!resume) {
    notFound();
  }

  const experienceItems = splitLines(resume.experience);
  const educationItems = splitLines(resume.education);
  const skillItems = splitLines(resume.skills);
  const portfolioUrl = ensureUrl(resume.portfolio);
  const linkedinUrl = ensureUrl(resume.linkedin);

  const hasContact = Boolean(
    resume.email || resume.phone || resume.city || portfolioUrl || linkedinUrl
  );

  return (
    <main className="min-h-screen bg-zinc-100 px-3 py-4 sm:px-6 sm:py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-zinc-200 bg-white shadow-sm print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <header className="px-6 py-8 sm:px-10 sm:py-10 print:px-0 print:pb-8 print:pt-0">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-500">
                Currículo online
              </p>
              <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight text-zinc-950 sm:text-5xl print:text-4xl">
                {resume.name}
              </h1>
              {resume.role ? (
                <p className="mt-4 text-xl text-zinc-600 print:text-lg">{resume.role}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3 print:hidden">
              <Link
                href="/dashboard"
                className="rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
              >
                Ir ao dashboard
              </Link>
              <PublicResumeActions />
            </div>
          </div>

          {hasContact ? (
            <div className="mt-8 rounded-[1.75rem] bg-zinc-50 p-6 sm:max-w-md print:mt-6 print:max-w-sm print:rounded-3xl print:border print:border-zinc-200 print:bg-white">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
                Contato
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
                {resume.email ? (
                  <p>
                    <span className="font-semibold text-zinc-950">Email:</span>{" "}
                    {resume.email}
                  </p>
                ) : null}
                {resume.phone ? (
                  <p>
                    <span className="font-semibold text-zinc-950">Telefone:</span>{" "}
                    {resume.phone}
                  </p>
                ) : null}
                {resume.city ? (
                  <p>
                    <span className="font-semibold text-zinc-950">Cidade:</span>{" "}
                    {resume.city}
                  </p>
                ) : null}
                {portfolioUrl ? (
                  <p>
                    <span className="font-semibold text-zinc-950">Portfólio:</span>{" "}
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      {resume.portfolio}
                    </a>
                  </p>
                ) : null}
                {linkedinUrl ? (
                  <p>
                    <span className="font-semibold text-zinc-950">LinkedIn:</span>{" "}
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      {resume.linkedin}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </header>

        {resume.summary ? (
          <Section title="Resumo">
            <p className="max-w-4xl whitespace-pre-line text-base leading-8 text-zinc-700 print:leading-7">
              {resume.summary}
            </p>
          </Section>
        ) : null}

        {experienceItems.length > 0 ? (
          <Section title="Experiência">
            <div className="space-y-4">
              {experienceItems.map((item) => (
                <div
                  key={item}
                  className="rounded-3xl bg-zinc-50 px-5 py-4 text-base leading-7 text-zinc-700 print:border print:border-zinc-200 print:bg-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {educationItems.length > 0 ? (
          <Section title="Formação">
            <div className="space-y-4">
              {educationItems.map((item) => (
                <div
                  key={item}
                  className="rounded-3xl bg-zinc-50 px-5 py-4 text-base leading-7 text-zinc-700 print:border print:border-zinc-200 print:bg-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {skillItems.length > 0 ? (
          <Section title="Habilidades">
            <div className="flex flex-wrap gap-3">
              {skillItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white print:border print:border-zinc-400 print:bg-white print:text-zinc-950"
                >
                  {item}
                </span>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </main>
  );
}
