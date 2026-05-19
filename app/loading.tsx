import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">
        Loading content...
      </p>
    </div>
  );
}
