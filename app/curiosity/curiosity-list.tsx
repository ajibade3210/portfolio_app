"use client";

import { useState, useMemo } from "react";
import { Search, X, ArrowUpRight, FileQuestion } from "lucide-react";
import type { Blog } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";

interface CuriosityListProps {
  blogs: Blog[];
}

export default function CuriosityList({ blogs }: CuriosityListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  // Extract all unique tags dynamically from blogs
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => {
          if (tag) tagsSet.add(tag.trim());
        });
      }
    });
    return Array.from(tagsSet).sort();
  }, [blogs]);

  // Filter blogs based on tag and search query
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // 1. Tag Filter matching
      const matchesTag =
        selectedTag === "all" ||
        (blog.tags && blog.tags.some((t) => t.trim() === selectedTag));

      // 2. Search Query matching (matches title, description, or tags)
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !normalizedQuery ||
        blog.title.toLowerCase().includes(normalizedQuery) ||
        (blog.description &&
          blog.description.toLowerCase().includes(normalizedQuery)) ||
        (blog.tags &&
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(normalizedQuery)
          ));

      return matchesTag && matchesSearch;
    });
  }, [blogs, searchQuery, selectedTag]);

  const hasActiveFilters = selectedTag !== "all" || searchQuery.trim() !== "";

  if (blogs.length === 0) {
    return (
      <p className="mt-12 text-muted-foreground">
        No posts yet. Check back soon for articles and curiosities.
      </p>
    );
  }

  return (
    <div>
      {/* Search and Filter Inputs */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search articles by title, description, or tags..."
            className="pl-9 pr-8 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="w-full sm:w-[200px] shrink-0">
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full bg-card border-border">
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            Found {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "article" : "articles"}
          </span>
          <span className="text-muted-foreground/30">•</span>

          {selectedTag !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground font-medium">
              Tag: {selectedTag}
              <button
                onClick={() => setSelectedTag("all")}
                className="hover:text-destructive transition-colors ml-0.5"
                title="Remove tag filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {searchQuery.trim() !== "" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground font-medium">
              Search: &ldquo;{searchQuery}&rdquo;
              <button
                onClick={() => setSearchQuery("")}
                className="hover:text-destructive transition-colors ml-0.5"
                title="Clear search"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          <button
            onClick={() => {
              setSelectedTag("all");
              setSearchQuery("");
            }}
            className="text-xs text-primary font-medium hover:underline transition-all"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Blogs Display */}
      {filteredBlogs.length === 0 ? (
        <Empty className="mt-12 bg-card/20 border border-dashed border-border/80">
          <EmptyMedia variant="icon">
            <FileQuestion className="size-6 text-muted-foreground" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-foreground">No articles found</EmptyTitle>
            <EmptyDescription className="text-muted-foreground">
              We couldn&apos;t find any curiosities matching your active filter
              criteria. Try resetting or adjusting them.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <button
              onClick={() => {
                setSelectedTag("all");
                setSearchQuery("");
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/95 transition-all shadow-xs"
            >
              Reset Filters
            </button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mt-10 flex flex-col gap-6">
          {filteredBlogs.map((blog) => (
            <a
              key={blog.id}
              href={blog.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-5 rounded-lg border border-border bg-card p-5 hover:border-foreground/20 hover:shadow-xs transition-all duration-200"
            >
              {/* Preview Image */}
              {blog.image_url && (
                <div className="hidden sm:block shrink-0 self-center">
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="h-24 w-36 rounded-md object-cover border border-border group-hover:opacity-95 transition-opacity"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-150">
                      {blog.title}
                    </h2>
                    <ArrowUpRight className="shrink-0 size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150" />
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {blog.description}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                      {blog.platform}
                    </span>
                    <span
                      className="text-xs text-muted-foreground font-medium"
                      suppressHydrationWarning
                    >
                      {new Date(blog.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.map((tag) => {
                        const trimmedTag = tag.trim();
                        const isSelected = selectedTag === trimmedTag;
                        return (
                          <button
                            key={trimmedTag}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedTag(isSelected ? "all" : trimmedTag);
                            }}
                            className={`rounded-full px-2.5 py-0.5 text-xs transition-all duration-150 ${
                              isSelected
                                ? "bg-primary text-primary-foreground font-semibold ring-2 ring-primary/20 scale-105"
                                : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary font-medium"
                            }`}
                          >
                            {trimmedTag}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
