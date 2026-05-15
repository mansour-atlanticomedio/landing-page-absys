import { ReactNode } from "react";

interface HeroProps {
  pretitle?: string
  title: string;
  subtitle?: string;
  image: string;
  children?: ReactNode;
}

const Hero = ({ pretitle, title, subtitle, image, children }: HeroProps) => (
  <section
  className="relative min-h-105 md:min-h-130 flex items-center justify-center text-center text-primary-foreground bg-cover bg-position-[center_top_50%]"
  style={{ backgroundImage: `url(${image})` }}
>
    <div className="absolute inset-0 hero-overlay" />
    <div className="relative z-10 max-w-4xl px-6 py-20">
      { pretitle && <p className="text-md md:text-lg text-primary-foreground/90 mb-4" >{pretitle}</p>}
      <h1 className=" font-display text-3xl md:text-5xl font-bold uppercase tracking-wide text-primary-foreground mb-4">
        {title}
      </h1>
      {subtitle && <p className="text-lg md:text-xl text-primary-foreground/90">{subtitle}</p>}
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>
);

export default Hero;
