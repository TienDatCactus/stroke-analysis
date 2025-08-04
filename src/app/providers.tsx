"use client";

import { AuthProvider } from "@/lib/context/AuthContext";
import { FileProvider } from "@/lib/context/FileContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FileProvider>{children}</FileProvider>
      <Toaster />
    </AuthProvider>
  );
}
