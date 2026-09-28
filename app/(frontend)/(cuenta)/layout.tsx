import CuentaNav from "@/components/cuenta/CuentaNav";

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-primary mb-8">Mi cuenta</h1>
      <CuentaNav />
      <div className="pt-8">{children}</div>
    </section>
  );
}
