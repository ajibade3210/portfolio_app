"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<{ error?: string }>
}

export function LoginForm({ loginAction }: LoginFormProps) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/admin/dashboard")
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter admin password"
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
