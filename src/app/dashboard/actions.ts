"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugifyResumeName } from "@/lib/resume-utils";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rawName: string,
  excludeId?: string
) {
  const base = slugifyResumeName(rawName) || `curriculo-${Date.now()}`;
  let slug = base;
  let count = 1;

  while (true) {
    let query = supabase
      .from("resumes")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error("Não foi possível validar o slug.");
    }

    if (!data || data.length === 0) {
      return slug;
    }

    count += 1;
    slug = `${base}-${count}`;
  }
}

export async function deleteResume(formData: FormData) {
  const resumeId = String(formData.get("resumeId") || "");
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) {
    redirect("/dashboard?error=Não foi possível excluir o currículo.");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?success=Currículo excluído com sucesso.");
}

export async function duplicateResume(formData: FormData) {
  const resumeId = String(formData.get("resumeId") || "");
  const { supabase, user } = await requireUser();

  const { data: original, error: fetchError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !original) {
    redirect("/dashboard?error=Não foi possível duplicar o currículo.");
  }

  const newName = `${original.name} Cópia`;
  const slug = await generateUniqueSlug(supabase, newName);

  const { error } = await supabase.from("resumes").insert({
    user_id: user.id,
    slug,
    name: newName,
    role: original.role,
    summary: original.summary,
    phone: original.phone,
    email: original.email,
    city: original.city,
    linkedin: original.linkedin,
    portfolio: original.portfolio,
    experience: original.experience,
    education: original.education,
    skills: original.skills,
    is_public: original.is_public ?? true,
  });

  if (error) {
    redirect("/dashboard?error=Não foi possível duplicar o currículo.");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?success=Currículo duplicado com sucesso.");
}
