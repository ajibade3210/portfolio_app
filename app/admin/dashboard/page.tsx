import { redirect } from "next/navigation";
import { isAuthenticated, logoutAction } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Project, Blog, About } from "@/lib/types";
import { AdminTabs } from "./admin-tabs";

export const metadata = {
  title: "Dashboard | Admin",
};

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin");
  }

  const supabase = await createClient();

  const [projectsResult, blogsResult, aboutResult] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("blogs")
      .select("*")
      .order("published_at", { ascending: false }),
    supabase.from("about").select("*").limit(1).single(),
  ]);

  const projects = (projectsResult.data || []) as Project[];
  const blogs = (blogsResult.data || []) as Blog[];
  const about = aboutResult.data as About | null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>

      <AdminTabs projects={projects} blogs={blogs} about={about} />
    </div>
  );
}
