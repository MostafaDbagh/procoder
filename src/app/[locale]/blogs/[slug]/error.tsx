"use client";

export default function BlogPostError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-muted">This post could not be loaded. Please try again.</p>
      </div>
    </div>
  );
}
