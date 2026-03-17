"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card px-8 py-6 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <div className="text-center">
            <p className="text-lg font-semibold">Checking authentication</p>
            <p className="text-sm text-muted-foreground">
              Please wait a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("not authenticated");
    return null;
  }

  return children;
}
