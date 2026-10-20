import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export { iconMap, iconsSocialMediaMap } from "./icons"
export { useBookCover } from "./useBookCover"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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