import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function CreatePage() {
  const supabase = await createClient();
  const {
    data: { claims },
  } = await supabase.auth.getClaims();

  if (!claims?.sub) {
    redirect("/login?message=Faça login para criar um currículo.");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Criar currículo</h1>
            <p className="mt-2 text-sm text-zinc-600">Página protegida. O formulário real entra no próximo passo.</p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          Usuário autenticado: {claims.email}
        </div>
      </div>
    </main>
  );
}
