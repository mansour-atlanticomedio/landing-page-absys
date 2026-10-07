import Hero from "@/components/Hero";
import SolicitudCompraForm from "@/components/SolicitudCompraForm";

export const metadata = {
  title: "Solicitud de compra | Biblioteca UNAM",
  description: "Propón a la Biblioteca la adquisición de libros y obras de referencia para la docencia, el estudio o la investigación.",
};

export default function SolicitudCompra() {
  return (
    <>
      <Hero
        pretitle="Adquisiciones"
        title="Solicitud de compra"
        subtitle="Propón la adquisición de libros u obras que necesites para tu docencia, estudio o investigación"
        image="/images/app/campus.jpg"
      />

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <SolicitudCompraForm />
        </div>
      </section>
    </>
  );
}
