"use client"

import { useState } from "react"
import type { Blog } from "@/lib/types"
import { createBlog, updateBlog, deleteBlog } from "@/lib/actions"
import { Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react"

interface BlogsTabProps {
  blogs: Blog[]
}

export function BlogsTab({ blogs }: BlogsTabProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const result = editingBlog 
      ? await updateBlog(editingBlog.id, formData)
      : await createBlog(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setShowForm(false)
      setEditingBlog(null)
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    
    setLoading(true)
    const result = await deleteBlog(id)
    if (result.error) {
      setError(result.error)
    }
    setLoading(false)
  }

  if (showForm || editingBlog) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
          </h2>
          <button
            onClick={() => { setShowForm(false); setEditingBlog(null); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
            <input
              name="title"
              required
              defaultValue={editingBlog?.title}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={editingBlog?.description}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">External URL *</label>
            <input
              name="external_url"
              type="url"
              required
              defaultValue={editingBlog?.external_url}
              placeholder="https://medium.com/your-article"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Platform</label>
              <select
                name="platform"
                defaultValue={editingBlog?.platform || "medium"}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="medium">Medium</option>
                <option value="dev.to">Dev.to</option>
                <option value="hashnode">Hashnode</option>
                <option value="substack">Substack</option>
                <option value="personal">Personal Blog</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tags (comma-separated)</label>
              <input
                name="tags"
                defaultValue={editingBlog?.tags.join(", ")}
                placeholder="react, typescript, web"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preview Image URL</label>
            <input
              name="image_url"
              type="url"
              defaultValue={editingBlog?.image_url || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Saving..." : editingBlog ? "Update Post" : "Add Post"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingBlog(null); }}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{blogs.length} blog post(s)</p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add Post
        </button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {blogs.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No blog posts yet. Add your first post!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground truncate">{blog.title}</h3>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground capitalize">
                    {blog.platform}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{blog.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <a
                  href={blog.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <ExternalLink className="size-4" />
                </a>
                <button
                  onClick={() => setEditingBlog(blog)}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
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
  )
}
