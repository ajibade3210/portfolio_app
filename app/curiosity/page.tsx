import { ArrowUpRight } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 3600;

import type { Blog } from "@/lib/types";

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

      {blogs.length === 0 ? (
        <p className="mt-12 text-muted-foreground">
          No posts yet. Check back soon for articles and curiosities.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-6">
          {blogs.map(blog => (
            <a
              key={blog.id}
              href={blog.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-5 rounded-lg border border-border bg-card p-5 hover:border-foreground/20 transition-colors"
            >
              {/* Preview Image */}
              {blog.image_url && (
                <div className="hidden sm:block shrink-0">
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="h-24 w-36 rounded-md object-cover border border-border"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                    {blog.title}
                  </h2>
                  <ArrowUpRight className="shrink-0 size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                  {blog.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="text-xs text-muted-foreground capitalize">
                    {blog.platform}
                  </span>
                  <span
                    className="text-xs text-muted-foreground"
                    suppressHydrationWarning
                  >
                    {new Date(blog.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex gap-2">
                      {blog.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
