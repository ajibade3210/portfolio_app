import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { createPublicClient } from "@/lib/supabase/public";

import AboutAvatar from "@/components/about-avatar";

export const revalidate = 3600;

import type { About } from "@/lib/types";

export const metadata = {
  title: "About | Portfolio",
  description: "Learn more about me and my journey",
  openGraph: {
    title: "About | Portfolio",
    description: "Learn more about me and my journey",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Portfolio",
    description: "Learn more about me and my journey",
  },
};

export default async function AboutPage() {
  const supabase = createPublicClient();
  const { data } = await supabase.from("about").select("*").limit(1).single();
  const about = data as About | null;

  if (!about) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          About Me
        </h1>
        <p className="mt-8 text-muted-foreground">
          Profile information coming soon. Visit the admin panel to add your
          details.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
        {/* Avatar */}
        {about.avatar_url && (
          <AboutAvatar avatarUrl={about.avatar_url} name={about.name} />
        )}

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {about.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{about.title}</p>

          <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {about.bio}
            </p>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex flex-wrap gap-4">
            {about.email && (
              <a
                href={`mailto:${about.email}`}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <Mail className="size-4" />
                Email
              </a>
            )}
            {about.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <FaGithub className="size-4" />
                GitHub
              </a>
            )}
            {about.linkedin && (
              <a
                href={about.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <FaLinkedin className="size-4" />
                LinkedIn
              </a>
            )}
            {about.twitter && (
              <a
                href={about.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <FaTwitter className="size-4" />
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
