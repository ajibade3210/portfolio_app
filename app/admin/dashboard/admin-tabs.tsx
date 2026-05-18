"use client"

import { useState } from "react"
import type { Project, Blog, About } from "@/lib/types"
import { ProjectsTab } from "./projects-tab"
import { BlogsTab } from "./blogs-tab"
import { AboutTab } from "./about-tab"
import { cn } from "@/lib/utils"

interface AdminTabsProps {
  projects: Project[]
  blogs: Blog[]
  about: About | null
}

const tabs = [
  { id: "projects", label: "Projects" },
  { id: "blogs", label: "Blog Posts" },
  { id: "about", label: "About" },
] as const

type TabId = typeof tabs[number]["id"]

export function AdminTabs({ projects, blogs, about }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("projects")

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "projects" && <ProjectsTab projects={projects} />}
      {activeTab === "blogs" && <BlogsTab blogs={blogs} />}
      {activeTab === "about" && <AboutTab about={about} />}
    </div>
  )
}
