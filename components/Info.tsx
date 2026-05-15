import { InfoProps } from "@/types/common.type";
import { CheckCircle2 } from "lucide-react";
import Markdown from "react-markdown";

export default function Info({ icon: Icon, title, subtitle, sections, generalEntries }: InfoProps) {

  return (
    <div className="max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300 font-sans">
      <div className="p-6 flex items-start gap-4">
        <div className="bg-[#4FA1A1] p-3 rounded-xl shadow-inner">
          <Icon className="text-white w-8 h-8" />
        </div>
        <div>
          <p className="font-bold text-xs tracking-widest uppercase">{title}</p>
          <h1 className=" text-xl font-bold leading-tight h-12 mt-1">
            {subtitle}
          </h1>
        </div>
      </div>
      <hr />

      <div className="p-8 space-y-8">

        <section>
          <h2 className="font-bold text-lg mb-4">Datos generales</h2>
          <ul className="space-y-3">
            {generalEntries.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-[#4a5a62]">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                <span className="text-[15px]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {sections.map((sec, idx) => (
          <section key={idx} className="space-y-1">
            <h2 className="font-bold text-lg inline-block">
              {sec.title}
              {sec.subtitle && (
                <span className="ml-2 text-gray-400 italic font-normal text-sm">
                  {sec.subtitle}
                </span>
              )}
            </h2>
            <p className="text-[15px] leading-relaxed">
              <Markdown
                components={{
                  strong: ({ node, ...props }) => <span className="font-bold text-accent" {...props} />,
                  a: ({ node, ...props }) => <a className="text-accent hover:text-accent" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc ml-4" {...props} />,
                }}
              >
                {sec.description}
              </Markdown>
            </p>
          </section>
        ))}

      </div>
    </div>
  );
}