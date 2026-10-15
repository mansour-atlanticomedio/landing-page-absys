"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { RefreshRouteOnSave } from "@payloadcms/live-preview-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function LivePreviewListener({ children, exitPath }: { children: ReactNode; exitPath: string }) {
  const router = useRouter()
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  return (
    <>
      {origin && <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />}
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-3 bg-primary px-4 py-2 text-sm text-primary-foreground">
        <Badge className="bg-accent text-primary">Borrador</Badge>
        <span className="font-sans">Estás viendo un borrador</span>
        <Button asChild size="sm" variant="secondary">
          <Link href={`/auth/preview/exit?next=${encodeURIComponent(exitPath)}`} prefetch={false}>
            Salir de la vista previa
          </Link>
        </Button>
      </div>
      {children}
    </>
  )
}
