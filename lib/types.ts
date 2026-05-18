export interface About {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  email: string | null
  github: string | null
  linkedin: string | null
  twitter: string | null
  created_at: string
  updated_at: string
}

export interface CaseStudy {
  overview?: string
  problem?: string
  solution?: string
  design_flow?: string[]
  schema_design?: string
  tech_decisions?: string[]
  challenges?: string[]
  learnings?: string[]
  results?: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url: string | null
  stack: string[]
  live_url: string | null
  github_url: string | null
  case_study: CaseStudy
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  title: string
  description: string
  external_url: string
  platform: string
  image_url: string | null
  tags: string[]
  published_at: string
  created_at: string
  updated_at: string
}
