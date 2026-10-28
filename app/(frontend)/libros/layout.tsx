import { notFound } from "next/navigation";
import { shouldHideLibros } from "@/lib/libros-visibility";

export default function LibrosLayout({ children }: { children: React.ReactNode }) {
  if (shouldHideLibros()) notFound();
  return children;
}
