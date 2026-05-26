'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface BooksInterface {
  titulo: string;
  autor: string;
  editorial: string;
}

export default function BooksList() {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BooksInterface[]>([]);
  
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = name ? `/api/library/${name}` : `/api/library/`;
        const response = await axios.get(url);
        setBooks(response.data);
      } catch (error) {
        console.error("Error cargando libros:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  if (loading) {
    return <span>Cargando...</span>;
  }

  if (books.length === 0 && name) {
    return <span>No existe o no hay resultado para "{name}"</span>;
  }

  return (
    <>
      {books.map((book, index) => (
        <div key={index} className="p-4 border-b w-full">
          <p><strong>Título:</strong> {book.titulo}</p>
          <p><strong>Autor:</strong> {book.autor}</p>
          <p><strong>Editorial:</strong> {book.editorial}</p>
        </div>
      ))}
    </>
  );
}