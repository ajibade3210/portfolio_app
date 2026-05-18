"use client"

import { useState } from "react"
import type { About } from "@/lib/types"
import { updateAbout } from "@/lib/actions"

interface AboutTabProps {
  about: About | null
}

export function AboutTab({ about }: AboutTabProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    setSuccess(false)

    const result = await updateAbout(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6">
        Update your personal information displayed on the About page.
      </p>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
            <input
              name="name"
              required
              defaultValue={about?.name || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
            <input
              name="title"
              required
              defaultValue={about?.title || ""}
              placeholder="Software Developer"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Bio *</label>
          <textarea
            name="bio"
            required
            rows={5}
            defaultValue={about?.bio || ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Avatar URL</label>
          <input
            name="avatar_url"
            type="url"
            defaultValue={about?.avatar_url || ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-border" />
        <h3 className="text-md font-medium text-foreground">Social Links</h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={about?.email || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">GitHub URL</label>
            <input
              name="github"
              type="url"
              defaultValue={about?.github || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">LinkedIn URL</label>
            <input
              name="linkedin"
              type="url"
              defaultValue={about?.linkedin || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Twitter URL</label>
            <input
              name="twitter"
              type="url"
              defaultValue={about?.twitter || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600">Profile updated successfully!</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
