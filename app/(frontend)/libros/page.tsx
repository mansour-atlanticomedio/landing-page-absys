'use client'

import InputComponent from "@/components/Input";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";

export const dynamic = 'force-dynamic';

interface BooksInterface {
    idTitulo: string,
    titulo: string,
    autor: string,
    isbn: string,
    editorial: string,
    anioPublicacion: string,
    materia: string[]
}

function BooksContent() {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState<BooksInterface[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    const searchParams = useSearchParams()
    const name = searchParams.get('name')
    const titulo = searchParams.get('titulo')
    const autor = searchParams.get('autor')
    const isbn = searchParams.get('isbn')
    const editorial = searchParams.get('editorial')
    const anio = searchParams.get('anio')
    const materia = searchParams.get('materia')

    const hasAnyParam = name || titulo || autor || isbn || editorial || anio || materia

    const buildQueryString = useCallback(() => {
        const params = new URLSearchParams()
        const entries = { name, titulo, autor, isbn, editorial, anio, materia }
        for (const [key, value] of Object.entries(entries)) {
            if (value) params.set(key, value)
        }
        return params.toString()
    }, [name, titulo, autor, isbn, editorial, anio, materia])

    useEffect(() => {
        if (!hasAnyParam) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setHasSearched(true);
                const qs = buildQueryString()
                const response = await axios.get(`/biblioteca/api/library/search?${qs}`);
                setBooks(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hasAnyParam, buildQueryString]);

    const RenderBooks = () => {
        if (loading) return <span>Cargando...</span>;
        if (!hasSearched) return null;
        if (books.length === 0) return <span>No existe o no hay resultado</span>;

        return (
            books.map((book, index) => (
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
            ))
        );
    };

    return (
        <>
            <div className="flex flex-col justify-center items-start w-full p-10 bg-gray-200">
                <h1 className="section-title text-start after:ml-0"> Resultados de búsqueda </h1>
                <div className="w-full">
                    <InputComponent />
                </div>
                {hasSearched && <span className="mt-4">{books.length} Resultados</span>}
            </div>
            <div className="my-8 w-11/12 flex flex-col gap-4 justify-center items-start">
                <RenderBooks />
            </div>
        </>
    );
}
export default function Books() {
    return (
        <section className="flex flex-col justify-center items-center">
            <Suspense fallback={<div className="p-10">Cargando buscador...</div>}>
                <BooksContent />
            </Suspense>
        </section>
    )
}