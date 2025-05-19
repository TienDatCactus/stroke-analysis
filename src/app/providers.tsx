"use client";

import { FileProvider } from "@/lib/context/FileContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FileProvider>{children}</FileProvider>;
}
