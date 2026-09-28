import { Info } from "lucide-react";

export default function AvisoCuenta({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-l-2 border-accent bg-muted px-4 py-3 text-sm text-muted-foreground">
      <Info className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
      <div>{children}</div>
    </div>
  );
}
