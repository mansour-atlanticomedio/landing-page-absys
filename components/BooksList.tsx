'use client';

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface BooksInterface {
  idTitulo: string;
  titulo: string;
  autor: string;
  isbn: string;
  editorial: string;
  anioPublicacion: string;
  materia: string[];
}

export default function BooksList() {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BooksInterface[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchParams = useSearchParams();

  const entries = {
    name: searchParams.get('name'),
    titulo: searchParams.get('titulo'),
    autor: searchParams.get('autor'),
    isbn: searchParams.get('isbn'),
    editorial: searchParams.get('editorial'),
    anio: searchParams.get('anio'),
    materia: searchParams.get('materia'),
  };

  const hasAnyParam = Object.values(entries).some(v => v);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(entries)) {
      if (value) params.set(key, value);
    }
    return params.toString();
  }, [entries.name, entries.titulo, entries.autor, entries.isbn, entries.editorial, entries.anio, entries.materia]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (hasAnyParam) {
          setHasSearched(true);
          const qs = buildQueryString();
          const response = await axios.get(`/biblioteca/api/library/search?${qs}`);
          setBooks(response.data);
        } else {
          const response = await axios.get('/biblioteca/api/library/');
          setBooks(response.data);
        }
      } catch (error) {
        console.error("Error cargando libros:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasAnyParam, buildQueryString]);

  if (loading) {
    return <span>Cargando...</span>;
  }

  if (hasSearched && books.length === 0) {
    return <span>No existe o no hay resultado</span>;
  }

  return (
    <>
      {books.map((book, index) => (
        <div key={index} className="p-4 border-b w-full">
          <p className="text-lg font-semibold">{book.titulo}</p>
          <p className="text-gray-600">Autor: {book.autor}</p>
          <p className="text-gray-500 text-sm">Editorial: {book.editorial} · ISBN: {book.isbn} · Año: {book.anioPublicacion}</p>
          <div className="flex gap-2 mt-1">
            {book.materia.map((m, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{m}</span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}