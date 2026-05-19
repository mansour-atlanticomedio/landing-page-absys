'use client'
import { ReactNode } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

interface PayloadImage {
  id: string,
  url: string,
  alt?: string,
  width?: number,
  height?: number,
}

interface HeroProps {
  pretitle?: string,
  title: string,
  subtitle?: string,
  image: PayloadImage | string,
  buttonText?: string,
  toPage?: string,
  children?: ReactNode,
}

export default function Hero({ pretitle, title, subtitle, image, buttonText, toPage, children }: HeroProps) {
  const imageUrl = typeof image === "object" ? image?.url : image;
  const imageAlt = typeof image === "object" ? image?.alt : "Imagen de fondo";

  return (
    <section className="relative min-h-105 md:min-h-130 flex items-center justify-center text-center text-primary-foreground overflow-hidden">

      {imageUrl && imageUrl !== '' && (
        <Image
          src={imageUrl}
          alt={imageAlt || title || "Hero background"}
          fill
          priority
          className="object-cover object-[center_90%] -z-10"
        />
      )}

      <div className="absolute inset-0 hero-overlay -z-10" />
      <div className="relative z-10 max-w-4xl px-6 py-20">
        {pretitle && (
          <p className="text-md md:text-lg text-primary-foreground/90 mb-4">
            {pretitle}
          </p>
        )}
        <h1 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-wide text-primary-foreground mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-primary-foreground/90">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
        {buttonText &&
          <Button
            variant="outline"
            className="mt-8 rounded-b-md py-5 px-6 border-2 border-primary-foreground text-primary-foreground bg-transparent cursor-pointer hover:bg-primary-foreground hover:text-primary uppercase tracking-wider">
            <Link href={toPage as string}>
              {buttonText}
            </Link>
          </Button>
        }
      </div>
    </section>
  );
};
