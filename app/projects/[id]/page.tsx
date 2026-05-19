import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { createPublicClient } from "@/lib/supabase/public";
import { cache } from "react";

export const revalidate = 3600;

import type { Project } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

const getProject = cache(async (id: string) => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  return data as Project | null;
});

export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase.from("projects").select("id");
  return (data || []).map(project => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Case Study`,
      description: project.description,
      images: project.image_url ? [project.image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Case Study`,
      description: project.description,
      images: project.image_url ? [project.image_url] : [],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const cs = project.case_study;

  // Check if case study has any content
  const hasCaseStudy =
    cs &&
    Object.values(cs).some(v => (Array.isArray(v) ? v.length > 0 : Boolean(v)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map(tech => (
            <span
              key={tech}
              className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-6 flex flex-wrap gap-4">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="size-4" />
              View Live
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <FaGithub className="size-4" />
              View Source
            </a>
          )}
        </div>
      </header>

      {/* Project Image */}
      {project.image_url && (
        <div className="mb-12">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full rounded-lg border border-border"
          />
        </div>
      )}

      {!hasCaseStudy ? (
        <section className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Detailed case study coming soon. Check back later for the full
            breakdown of this project.
          </p>
        </section>
      ) : (
        <div className="flex flex-col gap-12">
          {/* Overview */}
          {cs.overview && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {cs.overview}
              </p>
            </section>
          )}

          {/* Problem & Solution */}
          {(cs.problem || cs.solution) && (
            <section className="grid gap-8 md:grid-cols-2">
              {cs.problem && (
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    The Problem
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {cs.problem}
                  </p>
                </div>
              )}
              {cs.solution && (
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    The Solution
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {cs.solution}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Design Flow */}
          {cs.design_flow && cs.design_flow.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Design Flow
              </h2>
              <div className="flex flex-col gap-4">
                {cs.design_flow.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Schema Design */}
          {cs.schema_design && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Schema Design
              </h2>
              <div className="rounded-lg border border-border bg-card p-6 overflow-x-auto">
                <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                  {cs.schema_design}
                </pre>
              </div>
            </section>
          )}

          {/* Tech Decisions */}
          {cs.tech_decisions && cs.tech_decisions.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Technical Decisions
              </h2>
              <ul className="flex flex-col gap-3">
                {cs.tech_decisions.map((decision, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <p className="text-muted-foreground leading-relaxed">
                      {decision}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Challenges */}
          {cs.challenges && cs.challenges.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Challenges
              </h2>
              <ul className="flex flex-col gap-3">
                {cs.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                    <p className="text-muted-foreground leading-relaxed">
                      {challenge}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Learnings */}
          {cs.learnings && cs.learnings.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Key Learnings
              </h2>
              <ul className="flex flex-col gap-3">
                {cs.learnings.map((learning, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-chart-2" />
                    <p className="text-muted-foreground leading-relaxed">
                      {learning}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Results */}
          {cs.results && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Results
              </h2>
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {cs.results}
                </p>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
