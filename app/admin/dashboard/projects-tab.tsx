"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { createProject, updateProject, deleteProject } from "@/lib/actions";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface ProjectsTabProps {
  projects: Project[];
}

export function ProjectsTab({ projects }: ProjectsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = editingProject
      ? await updateProject(editingProject.id, formData)
      : await createProject(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      setEditingProject(null);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    const result = await deleteProject(id);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  if (showForm || editingProject) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {editingProject ? "Edit Project" : "Add New Project"}
          </h2>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Title *
              </label>
              <input
                name="title"
                required
                defaultValue={editingProject?.title}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Stack (comma-separated)
              </label>
              <input
                name="stack"
                defaultValue={editingProject?.stack.join(", ")}
                placeholder="React, TypeScript, Supabase"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={editingProject?.description}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Image URL
              </label>
              <input
                name="image_url"
                type="url"
                defaultValue={editingProject?.image_url || ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Live URL
              </label>
              <input
                name="live_url"
                type="url"
                defaultValue={editingProject?.live_url || ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                GitHub URL
              </label>
              <input
                name="github_url"
                type="url"
                defaultValue={editingProject?.github_url || ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={editingProject?.featured}
              className="rounded border-input"
            />
            <label htmlFor="featured" className="text-sm text-foreground">
              Featured project
            </label>
          </div>

          <hr className="border-border" />
          <h3 className="text-md font-medium text-foreground">
            Case Study (optional)
          </h3>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Overview
            </label>
            <textarea
              name="case_overview"
              rows={2}
              defaultValue={editingProject?.case_study?.overview || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Problem
              </label>
              <textarea
                name="case_problem"
                rows={3}
                defaultValue={editingProject?.case_study?.problem || ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Solution
              </label>
              <textarea
                name="case_solution"
                rows={3}
                defaultValue={editingProject?.case_study?.solution || ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Design Flow (one step per line)
            </label>
            <textarea
              name="case_design_flow"
              rows={3}
              defaultValue={
                editingProject?.case_study?.design_flow?.join("\n") || ""
              }
              placeholder="Step 1: Research&#10;Step 2: Wireframes&#10;Step 3: Prototype"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Schema Design
            </label>
            <textarea
              name="case_schema"
              rows={3}
              defaultValue={editingProject?.case_study?.schema_design || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Tech Decisions (one per line)
              </label>
              <textarea
                name="case_tech_decisions"
                rows={3}
                defaultValue={
                  editingProject?.case_study?.tech_decisions?.join("\n") || ""
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Challenges (one per line)
              </label>
              <textarea
                name="case_challenges"
                rows={3}
                defaultValue={
                  editingProject?.case_study?.challenges?.join("\n") || ""
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Learnings (one per line)
              </label>
              <textarea
                name="case_learnings"
                rows={3}
                defaultValue={
                  editingProject?.case_study?.learnings?.join("\n") || ""
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Results
              </label>
              <textarea
                name="case_results"
                rows={3}
                defaultValue={editingProject?.case_study?.results || ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingProject
                  ? "Update Project"
                  : "Add Project"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {projects.length} project(s)
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No projects yet. Add your first project!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map(project => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground truncate">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setEditingProject(project)}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={loading}
                  className="rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
