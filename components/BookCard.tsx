import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Book, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useBookCover } from "@/lib/utils";
import { BookInterface } from "@/types/absys.type";

// Interfaz para los props
interface BookCardProps {
  book: BookInterface;
  index: number;
  router: any; // O el tipo específico de tu router de Next.js
}

export default function BookCard({ book, index, router }: BookCardProps) {
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
        className="h-full group hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-accent/30 flex flex-col"
        onClick={() => router.push(`/recursos/catalogo/libro/${encodeURIComponent(book.isbn)}`)}
      >
        <CardContent className="p-3 flex flex-col h-full">
          {/* Contenedor con aspecto de libro (ratio 2:3) */}
          <div className="relative w-full aspect-[2/3] rounded-sm bg-muted/30 flex items-center justify-center mb-3 overflow-hidden border border-transparent group-hover:border-accent/20 transition-colors">
            
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
                className={`object-cover w-full h-full transition-all duration-500 ease-in-out ${
                  imageLoaded ? "scale-100 blur-0" : "scale-105 blur-lg"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}

            {!isApiLoading && showFallbackIcon && (
              <Book className="h-10 w-10 text-muted-foreground/40 transition-transform group-hover:scale-110 duration-300" />
            )}
          </div>

          <h3 className="font-bold text-xs group-hover:text-accent transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{book.author}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}