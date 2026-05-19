import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 3600;

import type { Project } from "@/lib/types";

export const metadata = {
  title: "Projects | Portfolio",
  description: "Explore my projects and case studies",
  openGraph: {
    title: "Projects | Portfolio",
    description: "Explore my projects and case studies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Portfolio",
    description: "Explore my projects and case studies",
  },
};

export default async function ProjectsPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  const projects = (data || []) as Project[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Projects
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A collection of projects I&apos;ve worked on, from personal experiments
        to production applications.
      </p>

      {projects.length === 0 ? (
        <p className="mt-12 text-muted-foreground">
          No projects yet. Check back soon or visit the admin panel to add
          projects.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-8">
          {projects.map(project => (
            <article
              key={project.id}
              className="group rounded-lg border border-border bg-card p-6 hover:border-foreground/20 transition-colors"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-foreground">
                      {project.title}
                    </h2>
                    {project.featured && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.stack || []).map(tech => (
                      <span
                        key={tech}
                        className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    {project.case_study &&
                      Object.keys(project.case_study).length > 0 && (
                        <Link
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
                        >
                          Case Study
                          <ArrowRight className="size-3.5" />
                        </Link>
                      )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="size-3.5" />
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <FaGithub className="size-3.5" />
                        Source
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Image */}
                {project.image_url && (
                  <div className="shrink-0 sm:ml-6">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-32 w-48 rounded-md object-cover border border-border"
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
