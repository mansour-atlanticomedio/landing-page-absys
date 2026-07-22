"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Book, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAuthorInfo, type AuthorData } from "@/services/author.service";

export function AuthorCard({ name: authorBook }: { name: string }) {
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    if (!authorBook) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    fetchAuthorInfo(authorBook).then((data) => {
      if (isMounted) {
        setAuthorData(data); // Será null si no hubo coincidencia estricta en el backend
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [authorBook]);

  // Limpiamos el string por si viene con comas finales del formato MARC21
  const cleanRawName = authorBook?.replace(/,\s*$/, "").trim();

  // Valores de respaldo (fallbacks)
  const displayName = authorData?.normalizedName || cleanRawName || "Autor desconocido";
  const displayBio = authorData?.bio || "Sin información biográfica disponible.";

  return (
    <motion.div
      className="lg:col-span-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50">
        <CardContent className="py-6 px-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary">Sobre el Autor</h3>

            {/* Enlace a Wikipedia solo si se encontró el autor con total certeza */}
            {authorData?.wikipediaUrl && (
              <a
                href={authorData.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                title="Ver artículo en Wikipedia"
              >
                <span>Wikipedia</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            {/* Avatar / Imagen del Autor */}
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden relative border border-border/40">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" />
              ) : authorData?.image ? (
                <img
                  src={authorData.image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Book className="h-7 w-7 text-muted-foreground/40" />
              )}
            </div>

            <div>
              <p className="font-semibold text-sm capitalize">{displayName}</p>
              <span className="text-xs text-muted-foreground">
                {isLoading ? "Buscando datos..." : "Autor"}
              </span>
            </div>
          </div>

          {/* Biografía */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isLoading ? "Cargando información..." : displayBio}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}