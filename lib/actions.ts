"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createProject(formData: FormData) {
  const supabase = createAdminClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image_url = (formData.get("image_url") as string) || null;
  const stack =
    (formData.get("stack") as string)
      ?.split(",")
      .map(s => s.trim())
      .filter(Boolean) || [];
  const live_url = (formData.get("live_url") as string) || null;
  const github_url = (formData.get("github_url") as string) || null;
  const featured = formData.get("featured") === "on";

  // Case study fields
  const overview = (formData.get("case_overview") as string) || "";
  const problem = (formData.get("case_problem") as string) || "";
  const solution = (formData.get("case_solution") as string) || "";
  const design_flow =
    (formData.get("case_design_flow") as string)?.split("\n").filter(Boolean) ||
    [];
  const schema_design = (formData.get("case_schema") as string) || "";
  const tech_decisions =
    (formData.get("case_tech_decisions") as string)
      ?.split("\n")
      .filter(Boolean) || [];
  const challenges =
    (formData.get("case_challenges") as string)?.split("\n").filter(Boolean) ||
    [];
  const learnings =
    (formData.get("case_learnings") as string)?.split("\n").filter(Boolean) ||
    [];
  const results = (formData.get("case_results") as string) || "";

  const case_study = {
    overview,
    problem,
    solution,
    design_flow,
    schema_design,
    tech_decisions,
    challenges,
    learnings,
    results,
  };

  const { error } = await supabase.from("projects").insert({
    title,
    description,
    image_url,
    stack,
    live_url,
    github_url,
    featured,
    case_study,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createAdminClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image_url = (formData.get("image_url") as string) || null;
  const stack =
    (formData.get("stack") as string)
      ?.split(",")
      .map(s => s.trim())
      .filter(Boolean) || [];
  const live_url = (formData.get("live_url") as string) || null;
  const github_url = (formData.get("github_url") as string) || null;
  const featured = formData.get("featured") === "on";

  const overview = (formData.get("case_overview") as string) || "";
  const problem = (formData.get("case_problem") as string) || "";
  const solution = (formData.get("case_solution") as string) || "";
  const design_flow =
    (formData.get("case_design_flow") as string)?.split("\n").filter(Boolean) ||
    [];
  const schema_design = (formData.get("case_schema") as string) || "";
  const tech_decisions =
    (formData.get("case_tech_decisions") as string)
      ?.split("\n")
      .filter(Boolean) || [];
  const challenges =
    (formData.get("case_challenges") as string)?.split("\n").filter(Boolean) ||
    [];
  const learnings =
    (formData.get("case_learnings") as string)?.split("\n").filter(Boolean) ||
    [];
  const results = (formData.get("case_results") as string) || "";

  const case_study = {
    overview,
    problem,
    solution,
    design_flow,
    schema_design,
    tech_decisions,
    challenges,
    learnings,
    results,
  };

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      description,
      image_url,
      stack,
      live_url,
      github_url,
      featured,
      case_study,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function createBlog(formData: FormData) {
  const supabase = createAdminClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const external_url = formData.get("external_url") as string;
  const platform = (formData.get("platform") as string) || "medium";
  const image_url = (formData.get("image_url") as string) || null;
  const tags =
    (formData.get("tags") as string)
      ?.split(",")
      .map(s => s.trim())
      .filter(Boolean) || [];

  const { error } = await supabase.from("blogs").insert({
    title,
    description,
    external_url,
    platform,
    image_url,
    tags,
    published_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/curiosity");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function updateBlog(id: string, formData: FormData) {
  const supabase = createAdminClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const external_url = formData.get("external_url") as string;
  const platform = (formData.get("platform") as string) || "medium";
  const image_url = (formData.get("image_url") as string) || null;
  const tags =
    (formData.get("tags") as string)
      ?.split(",")
      .map(s => s.trim())
      .filter(Boolean) || [];

  const { error } = await supabase
    .from("blogs")
    .update({
      title,
      description,
      external_url,
      platform,
      image_url,
      tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/curiosity");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function deleteBlog(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/curiosity");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function updateAbout(formData: FormData) {
  const supabase = createAdminClient();

  const name = formData.get("name") as string;
  const title = formData.get("title") as string;
  const bio = formData.get("bio") as string;
  const avatar_url = (formData.get("avatar_url") as string) || null;
  const email = (formData.get("email") as string) || null;
  const github = (formData.get("github") as string) || null;
  const linkedin = (formData.get("linkedin") as string) || null;
  const twitter = (formData.get("twitter") as string) || null;

  // Check if about record exists
  const { data: existing } = await supabase
    .from("about")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("about")
      .update({
        name,
        title,
        bio,
        avatar_url,
        email,
        github,
        linkedin,
        twitter,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("about").insert({
      name,
      title,
      bio,
      avatar_url,
      email,
      github,
      linkedin,
      twitter,
    });

    if (error) return { error: error.message };
  }

  revalidatePath("/about");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
