import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import type { Project, Blog } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()
  
  const [projectsResult, blogsResult] = await Promise.all([
    supabase.from("projects").select("*").eq("featured", true).limit(3).order("created_at", { ascending: false }),
    supabase.from("blogs").select("*").limit(3).order("published_at", { ascending: false })
  ])

  const featuredProjects = (projectsResult.data || []) as Project[]
  const recentBlogs = (blogsResult.data || []) as Blog[]

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Hero Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Hello, I&apos;m a Developer
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          I build digital products and explore the intersection of design and technology. 
          Welcome to my corner of the internet where I share my work and curiosities.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View Projects
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            About Me
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-foreground">Featured Projects</h2>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-lg border border-border bg-card p-5 hover:border-foreground/20 transition-colors"
              >
                <h3 className="font-medium text-foreground group-hover:text-foreground/80">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Curiosities */}
      {recentBlogs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-foreground">Recent Curiosities</h2>
            <Link href="/curiosity" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentBlogs.map((blog) => (
              <a
                key={blog.id}
                href={blog.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between rounded-lg border border-border bg-card p-5 hover:border-foreground/20 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-foreground group-hover:text-foreground/80">{blog.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{blog.description}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground capitalize">{blog.platform}</span>
                    {blog.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="ml-4 size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {featuredProjects.length === 0 && recentBlogs.length === 0 && (
        <section className="text-center py-16">
          <p className="text-muted-foreground">
            Content coming soon. Check back later or visit the{" "}
            <Link href="/admin" className="text-foreground underline underline-offset-4">
              admin panel
            </Link>{" "}
            to add content.
          </p>
        </section>
      )}
    </div>
  )
}
