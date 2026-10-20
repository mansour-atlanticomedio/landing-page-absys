'use client'

import { useState, useEffect } from "react";
import axios from "axios";

export const useBookCover = ( isbn : string) => {
  const [coverUrl, setCoverUrl] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

  // Aunque internamente usa useEffect por reglas de React, 
  // tu componente principal quedará limpio llamando solo a la función.
  useEffect(() => {
    if (!isbn) {
      setIsApiLoading(false);
      return;
    }

    let isMounted = true; // Previene fugas de memoria si el usuario hace scroll rápido
    setIsApiLoading(true);

    const fetchCover = async () => {
      try {
        const res = await axios.get(`${BASE_API_URL}/book_cover_service/cover/${isbn}`);
        if (isMounted && res.data.success && res.data.url) {
          setCoverUrl(res.data.url);
        }
      } catch (error) {
        console.error("Error al obtener portada para ISBN:", isbn);
      } finally {
        if (isMounted) setIsApiLoading(false);
      }
    };

    fetchCover();
    return () => { isMounted = false; };
  }, [isbn]);

  return { coverUrl, isApiLoading };
};
