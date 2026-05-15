'use client'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import ReactMarkdown from 'react-markdown';
import { Globe, X } from 'lucide-react'
import Image from 'next/image';
import { FaLinkedin, FaTwitter } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import { overlayVariants, modalVariants, cardVariants } from '@/lib/animations'
import { useState } from 'react'

interface SpeakersProps {
  name: string,
  role: string,
  entity: string,
  description: string,
  imageUrl: string,
  linkedin?: string,
  twitter?: string,
  website?: string
}

export default function Speakers() {

  const speakers: SpeakersProps[] = [
    {
      name: "Dra. Ana García-Valcárcel Muñoz-Repiso",
      role: "Catedrática de Didáctica y Organización Escolar",
      entity: "Universidad de Salamanca",
      description: `- Catedrática de la Universidad de Salamanca en la Facultad de Educación
- Miembro del Instituto Universitario de Ciencias de la Educación. 
- Miembro de la Comisión Académica del Doctorado “Formación en la sociedad del conocimiento”. 
- Investigadora en el campo de la Innovación, Tecnología Educativa y Formación del profesorado en competencia digital. 
- Miembro del grupo de investigación “Innovación y Educación digital (EduDIG)” de la Universidad de Salamanca. 
- Forma parte de varias redes de investigadores: Red Universitaria de Tecnología Educativa (RUTE), EDUTEC, Red de Innovación Educativa (REUNI+D) y Red Transdiciplinar de Investigación Educativa (RETINDE). 
- Premio María de Maeztu de la Universidad de Salamanca a la excelencia científica.`,
      imageUrl: 'speaker-1.jpg',
      linkedin: "https://es.linkedin.com/in/ana-garcia-valc%C3%A1rcel-mu%C3%B1oz-repiso-76a7a032",
      website: "https://diarium.usal.es/anagv/informacion-3/"
    },
    {
      name: "Dr. Manuel Area Moreira",
      role: "Catedrático de Tecnología Educativa",
      entity: "Universidad de La Laguna",
      description: `- Catedrático de la Universidad de La Laguna. 
- Su ámbito de investigación y docencia es la Tecnología Educativa (Cultura digital y educación, Enseñanza con medios y tecnologías, eLearning, Alfabetización y TIC, Políticas educativas y ciudadanía digital, IA en educación,...). 
- Es el Investigador Principal del Laboratorio de Educación y Nuevas Tecnologías (EDULLAB). 
- Ha realizado más de dos centenares de publicaciones académicas sobre Educación y Tecnologías así como dirigido varios proyectos de investigación sobre esta temática. 
- Sus dos últimos libros (2025) son: [Luces y sombras de la IA en la Educación Superior. Didáctica para el pensamiento crítico](https://riull.ull.es/xmlui/bitstream/handle/915/40470/Libro%20Luces%20y%20sombras%20IA%20Educaci%C3%B3n%20v2.pdf?sequence=9&isAllowed=y) y[ Transformación digital de la enseñanza universitaria](https://octaedro.com/wp-content/uploads/2025/11/9788410792081.pdf).`,
      imageUrl: 'speaker-2.jpg',
      linkedin: "https://es.linkedin.com/in/manuel-area-661a42111",
      website: "https://manarea.webs.ull.es/",
      twitter: "https://x.com/manuel_area",
    },
    {
      name: "Dra. Cristina Villalonga Gómez",
      role: "Vicerrectora de Educación Digital y Tecnología",
      entity: "Universidad Nebrija",
      description: `- Vicerrectora de Educación Digital y Tecnología en la Universidad de Nebrija, desde la que lidera la estrategia de transformación digital. 
- Ha sido directora de Global Campus, la unidad de Educación Digital de la Universidad de Nebrija. Doctora en Comunicación y Educación en Entornos Digitales por la UNED
- Su actividad docente e investigadora se articula en torno a dos líneas principales: los procesos educomunicativos y el desarrollo de competencias digitales y mediáticas; y el análisis y diseño de metodologías docentes y estrategias de aprendizaje en entornos virtuales e híbridos. 
- Está acreditada por la ANECA y tiene un sexenio de investigación por la CNEAI. 
- Es miembro del Grupo de Investigación en Cognición, Educación y Diferencias Individuales (CEDI) de la Universidad de Nebrija, así como del Grupo de Investigación en Comunicación e Información Digital (GICID) de la Universidad de Zaragoza. 
- Coordina el Grupo de Trabajo de Formación Online y Tecnología Educativa de la sectorial de Digitalización de CRUE Universidades Españolas.
`,
      imageUrl: 'speaker-3.jpg',
      linkedin: "https://es.linkedin.com/in/cristinavillalonga/es",
      twitter: "https://x.com/crisvillalonga"
    },
    {
      name: "Dr. Airam Manuel Guerra",
      role: "Profesor Contratado Doctor",
      entity: "Universidad del Atlántico Medio",
      description: `- Profesor en la Universidad del Atlántico Medio donde su actividad docente e investigadora se enfoca en la valorización de las ciencias marinas a través de la enseñanza STEM y la evaluación del impacto de Inteligencia Artificial Generativa (IAGen) en el ámbito universitario. 
- Miembro del grupo de investigación "Transformación de la Enseñanza STEM en Educación Superior (TES-STEM) " .
- Investigador Principal del proyecto "Uso participativo del análisis DAFO para el diseño de una guía de buenas prácticas de la Inteligencia Artificial Generativa en el proceso de enseñanza-aprendizaje universitario. "`,
      imageUrl: 'speaker-4.jpg',
      linkedin: "https://es.linkedin.com/in/airam-manuel-guerra-marrero-69a5b3136",

    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans mx-10 md:p-8 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center mb-16">
        <div className="flex items-center gap-3">
          <h2 className="section-title">Ponentes</h2>
        </div>
      </div>

      <div className="w-full max-w-8xl flex flex-wrap justify-around items-center mb-10 gap-y-4">
        {speakers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </div>
  );
};

const TeamMember = (member: SpeakersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>

      <DialogTrigger asChild>
        <motion.div
          className="flex flex-col items-center justify-center text-center cursor-pointer group"
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative w-64 h-72 bg-[#f0f4f8] rounded-4xl overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
            <Image
              src={`/images/app/${member.imageUrl}`}
              alt={member.name}
              fill
              className="object-cover object-top"
            />
          </div>

          <h3 className="text-xl font-bold text-[#1a1c2d] mb-1">{member.name}</h3>
          <p className="text-gray-600 font-bold text-sm leading-relaxed max-w-55">
            {member.role}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-55">
            {member.entity}
          </p>
        </motion.div>
      </DialogTrigger>

      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit={{ opacity: 0 }}
              />
            </DialogOverlay>

            <DialogContent asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 bg-white p-8 rounded-2xl shadow-2xl z-50 w-[95vw] max-w-4xl overflow-hidden"
                variants={modalVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-accent text-3xl font-bold leading-tight">{member.name}</h2>
                  <DialogClose className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </DialogClose>
                </div>

                <div className="flex gap-10 max-[700px]:flex-col">
                  <div className="shrink-0">
                    <div className="w-64 h-80 rounded-4xl overflow-hidden shadow-inner">
                      <img className="w-full h-full object-cover object-top" src={member.imageUrl} alt={member.name} />
                    </div>
                    <div className="flex gap-5 mt-6 justify-center">
                      {member.linkedin && <a className="text-slate-400 hover:text-blue-600 transition-colors" href={member.linkedin} target="_blank" rel="noreferrer"><FaLinkedin size={22} /></a>}
                      {member.twitter && <a className="text-slate-400 hover:text-sky-500 transition-colors" href={member.twitter} target="_blank" rel="noreferrer"><FaTwitter size={22} /></a>}
                      {member.website && <a className="text-slate-400 hover:text-emerald-500 transition-colors" href={member.website} target="_blank" rel="noreferrer"><Globe size={22} /></a>}
                    </div>
                  </div>

                  <DialogDescription asChild>
                    <div className="text-gray-600 h-80 max-[700px]:h-32 overflow-y-scroll mask-[linear-gradient(to_bottom,black_90%,transparent_100%)] scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <ReactMarkdown
                        components={{
                          strong: ({ ...props }) => <span className="font-bold text-accent" {...props} />,
                          a: ({ ...props }) => <a className="text-accent hover:underline font-medium" target="_blank" {...props} />,
                          ul: ({ ...props }) => <ul className="list-disc ml-5 space-y-2 my-4" {...props} />,
                          li: ({ ...props }) => <li {...props} />,
                        }}
                      >
                        {member.description}
                      </ReactMarkdown>
                    </div>
                  </DialogDescription>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};