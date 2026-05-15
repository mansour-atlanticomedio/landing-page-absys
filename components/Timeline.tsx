import { Calendar } from "lucide-react";
import Markdown from "react-markdown";

interface timeLineProps {
  day: string;
  title: string;
  items: { title: string, description?: string }[];
}



export default function Timeline() {
  const programa: timeLineProps[] = [
    {
      day: "Día 1",
      title: " Construyendo la investigación",
      items: [
        {
          title: "09:00 - 09:15 | Inauguración institucional",
          description: `Salón de Actos

Dra. Dña. Verónica Basilotta Gómez-Pablos, Vicerrectora de Investigación y Transferencia

Dña. Cristina Suárez Quintana, responsable de la Oficina de Transferencia y Resultados de Investigación`
        },
        {
          title: "09:30 - 10:30 | Carrera investigadora: proyectos, financiación y desarrollo académico",
          description: `Dra. Ana García-Valcárcel, Catedrática de la Universidad de Salamanca`
        },
        {
          title: "10:30 - 11:00 | Pausa café"
        },
        {
          title: "11:00 - 12:00 | Presentación de proyectos y networking investigador",
          description: `Espacio de encuentro y diálogo en torno a proyectos de investigación e innovación de la Universidad del Atlántico Medio, abierto a la participación de asistentes de otras universidades e instituciones`
        },
        {
          title: "12:00 - 13:00 | Inteligencia artificial aplicada a la docencia universitaria: oportunidades y retos",
          description: `Ponente: Dr. Manuel Area, Catedrático de la Universidad de La Laguna`
        },
      ]
    },
    {
      day: "Día 2",
      title: "Innovación y transferencia",
      items: [
        {
          title: "09:30 - 10:30 | Ponencia Posicionamiento y reputación del investigador en el entorno digital",
          description: `Ponente: Dr. Airam Guerra, Profesor de la Universidad del Atlántico Medio`
        },
        {
          title: "10:30 - 11:00 | Pausa café",
        },
        {
          title: "11:00 - 12:00 | Divulgación científica Mi tesis en 3 minutos",
          description: `Encuentro de doctorados abierto a participantes de distintos programas de doctorado y universidades.`
        },
        {
          title: "12:00 - 13:00 | Ponencia de clausura Innovación docente como motor de transferencia y transformación universitaria",
          description: `Dra. Cristina Villalonga Gómez, Vicerrectora de Educación Digital y Tecnología de la Universidad Nebrija
          _Estrategias de innovación docente, competencias digitales, indicadores de impacto y su integración en la estrategia institucional_`
        },
        {
          title: "13:00h | Clausura de las jornadas",
        },
      ]
    },
  ];


  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="section-title">Programa</h2>
        <div className="flex flex-col gap-12 mt-10">
          {programa.map((p) => (
            <div key={p.day} className="flex gap-8 border-l-4 border-accent pl-6 ">
              <div className="w-52" >
                <div className="flex items-center gap-2 text-accent">
                  <Calendar className="w-5 h-5" />
                  <span className="uppercase text-sm font-semibold tracking-wider">{p.day}</span>
                </div>
                <h3 className="font-display text-xl mt-1">{p.title}</h3>
              </div>
              <div className="flex flex-col gap-4" >
                {p.items.map((it, index) => (
                  <div key={index} >
                    <ul className="space-y-2 mb-2">
                      <li className="flex gap-2 font-semibold text-lg"><span className="text-accent">▸</span  >{it.title}</li>
                    </ul>
                    <article className="text-muted-foreground ml-4 " >
                      <Markdown
                        components={{
                          strong: ({ node, ...props }) => <span className="font-bold text-accent" {...props} />,
                          a: ({ node, ...props }) => <a className="text-accent hover:text-blue-700" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4" {...props} />,
                        }}
                      >
                        {it.description}
                      </Markdown>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}