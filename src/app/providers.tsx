"use client";

import { AuthProvider } from "@/lib/context/AuthContext";
import { FileProvider } from "@/lib/context/FileContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FileProvider>{children}</FileProvider>
    </AuthProvider>
  );
}
