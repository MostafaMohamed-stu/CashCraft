"use client"

import { AppProvider } from "@/contexts/AppContext"
import { ReactNode } from "react"

export function ClientProvider({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>
}
