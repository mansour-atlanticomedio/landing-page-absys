'use client'

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Calendar, Lightbulb, Briefcase, BookOpen, Microscope, Star, User, Phone, Mail, MapPin, Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const iconMap: Record<string, React.ElementType> = {
  Lightbulb: Lightbulb,
  BookOpen: BookOpen,
  Microscope: Microscope,
  Star: Star,
  User: User,
  Briefcase: Briefcase,
  Phone: Phone,
  Mail: Mail,
  MapPin: MapPin,
  Calendar: Calendar,
}

export const iconsSocialMediaMap: Record<string, React.ElementType> = {
  FaFacebook: FaFacebook,
  FaTwitter: FaTwitter,
  FaInstagram: FaInstagram,
  FaLinkedin: FaLinkedin,
  FaYoutube: FaYoutube,
  Globe: Globe
}

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

export function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const delta = 1;
  const range: (number | "ellipsis")[] = [];

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    } else if (range[range.length - 1] !== "ellipsis") {
      range.push("ellipsis");
    }
  }

  return range;
}