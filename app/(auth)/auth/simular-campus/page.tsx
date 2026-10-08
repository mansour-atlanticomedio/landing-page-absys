import { notFound } from "next/navigation";
import SimularCampusForm from "@/components/auth/SimularCampusForm";
import { safeNextPath } from "@/lib/auth/redirects";
import { devToolsEnabled } from "@/lib/env";

// Solo desarrollo: sustituye al campus mientras Daniel no tenga lista la redirección real
export default async function SimularCampusPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (!devToolsEnabled) notFound();

  const { next } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-muted">
      <SimularCampusForm next={safeNextPath(next)} />
    </div>
  );
}
