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
  Calendar: Calendar
}

export const iconsSocialMediaMap: Record<string, React.ElementType> = {
  FaFacebook: FaFacebook,
  FaTwitter: FaTwitter,
  FaInstagram: FaInstagram,
  FaLinkedin: FaLinkedin,
  FaYoutube: FaYoutube,
  Globe: Globe
}