import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/public/logos/unam-color-logo.png";
import { Book, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useBookCover } from "@/lib/utils";
import { BookInterface } from "@/types/absys.type";

// Interfaz para los props
interface BookCardProps {
  book: BookInterface;
  index: number;
  router: any; // O el tipo específico de tu router de Next.js
  query?: string; // término de búsqueda actual, para poder volver a él desde el detalle del libro
}

export default function BookCard({ book, index, router, query }: BookCardProps) {
  const { coverUrl, isApiLoading } = useBookCover(book.isbn);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showImage = coverUrl && !imageError;
  const showFallbackIcon = !coverUrl || imageError;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      // Reducimos el ancho máximo para que la tarjeta sea más pequeña
      className="max-w-[200px] w-full"
    >
      <Card
        className="h-full group p-0 pb-4 hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-accent/30 flex flex-col"
        onClick={() => router.push(
          `/recursos/catalogo/libro/${encodeURIComponent(book.isbn)}${query ? `?q=${encodeURIComponent(query)}` : ""}`
        )}
      >
        <CardContent className="p-0 flex flex-col w-full h-full rounded overflow-hidden">
          {/* Contenedor con aspecto de libro (ratio 2:3) */}
          <div className="relative w-full h-full aspect-[2/3] bg-muted/30 flex items-center justify-center mb-3 overflow-hidden border border-transparent group-hover:border-accent/20 transition-colors">

            {isApiLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/50" />
              </div>
            )}

            {showImage && (
              <Image
                src={coverUrl}
                alt={`Portada de ${book.title}`}
                fill
                sizes="200px"
                priority={index < 4}
                className={`object-cover w-full h-full transition-all duration-500 ease-in-out ${imageLoaded ? "scale-100 blur-0" : "scale-105 blur-lg"
                  }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}

            {!isApiLoading && showFallbackIcon && (
              <Image src={logo} alt="logo atlantico medio header" width={60} />
            )}
          </div>

          <div className="flex flex-col gap-1 mx-1" >
            <h3 className="font-bold text-md group-hover:text-accent transition-colors line-clamp-2 ">
              {book.title}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 text-slate-500">{book.author}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}