import type { AbsysRawResponse } from "../client";

export interface AbsysPrestamo {
  prnlec?: string;
  prbarc?: string;
  prfpre?: string;
  prfdev?: string;
  prnren?: string;
  renewable?: number;
  prcosu?: string;
  [field: string]: unknown;
}

export interface Prestamo {
  ejemplar: string;
  fechaPrestamo: string | null;
  fechaDevolucion: string | null;
  renovaciones: number;
  renovable: boolean;
  sucursal: string;
}

export const toPrestamosQuery = (lenlec: string) => ({ table: "presta", prnlec: lenlec });

export const extractPrestamos = (data: AbsysRawResponse): AbsysPrestamo[] => {
  const raw = data.response.presta as AbsysPrestamo | AbsysPrestamo[] | undefined;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
};

// Absys manda "YYYY-MM-DD HH:mm:ss" sin zona; nos quedamos solo con la fecha para no inventar una hora
const toFecha = (value?: string): string | null => {
  const match = value?.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
};

export const toPrestamo = (raw: AbsysPrestamo): Prestamo => ({
  ejemplar: raw.prbarc ?? "",
  fechaPrestamo: toFecha(raw.prfpre),
  fechaDevolucion: toFecha(raw.prfdev),
  renovaciones: Number(raw.prnren) || 0,
  renovable: Number(raw.renewable) === 1,
  sucursal: raw.prcosu ?? "",
});

export const isPrestamoVencido = (prestamo: Prestamo, hoy: Date = new Date()): boolean => {
  if (!prestamo.fechaDevolucion) return false;
  const pad = (n: number) => String(n).padStart(2, "0");
  const hoyIso = `${hoy.getFullYear()}-${pad(hoy.getMonth() + 1)}-${pad(hoy.getDate())}`;
  return prestamo.fechaDevolucion < hoyIso;
};
