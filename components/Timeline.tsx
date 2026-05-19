import { Calendar } from "lucide-react";
import { RichText } from '@payloadcms/richtext-lexical/react'

interface TimeLineProps {
  day: string,
  title: string,
  events: {
    title: string,
    description?: any
  }[];
}

interface TimeLineBoxProps {
  title: string,
  calendar: TimeLineProps[]
}

export default function Timeline({ title, calendar }: TimeLineBoxProps) {

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="section-title">{title}</h2>
        <div className="flex flex-col gap-12 mt-10">
          {calendar.map((p, index) => (
            <div key={index} className="flex gap-8 border-l-4 border-accent pl-6 ">
              <div className="w-52" >
                <div className="flex items-center gap-2 text-accent">
                  <Calendar className="w-5 h-5" />
                  <span className="uppercase text-sm font-semibold tracking-wider">{p.day}</span>
                </div>
                <h3 className="font-display text-xl mt-1">{p.title}</h3>
              </div>
              <div className="flex flex-col gap-4" >
                {p.events.map((it, index) => (
                  <div key={index} >
                    <ul className="space-y-2 mb-2">
                      <li className="flex gap-2 font-semibold text-lg"><span className="text-accent">▸</span  >{it.title}</li>
                    </ul>
                    <article className="text-muted-foreground ml-4 " >
                      <RichText data={it.description} />
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