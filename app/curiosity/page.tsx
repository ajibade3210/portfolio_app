import { createPublicClient } from "@/lib/supabase/public";
import type { Blog } from "@/lib/types";
import CuriosityList from "./curiosity-list";

export const revalidate = 3600;

export const metadata = {
  title: "Curiosity Made Me Ask | Portfolio",
  description: "Articles and topics that spark my curiosity",
  openGraph: {
    title: "Curiosity Made Me Ask | Portfolio",
    description: "Articles and topics that spark my curiosity",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curiosity Made Me Ask | Portfolio",
    description: "Articles and topics that spark my curiosity",
  },
};

export default async function CuriosityPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .order("published_at", { ascending: false });
  const blogs = (data || []) as Blog[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Curiosity Made Me Ask
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A place for the random questions that sent me down a rabbit hole: how
        things work, why they break, and what makes certain systems feel
        beautifully designed. Mostly backend, systems, and tech, with the
        occasional detour into whatever else catches my attention.
      </p>

      <CuriosityList blogs={blogs} />
    </div>
  );
}

