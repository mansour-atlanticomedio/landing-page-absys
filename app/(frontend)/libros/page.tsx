'use client'

import InputComponent from "@/components/Input";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BooksInterface {
    titulo: string,
    autor: string,
    editorial: string
}

export default function Books() {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState<BooksInterface[]>([])
    const searchParams = useSearchParams()
    const name = searchParams.get('name')

    useEffect(() => {
        if (!name?.trim()) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await axios.get(`/api/library/${name}`);
                setBooks(response.data);
                
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [name]);
    
    
    const RenderBooks = () => {
        if (loading) {
            return <span>Cargando...</span>;
        }
        
        if (books.length === 0 && name) {
            return <span>No existe o no hay resultado</span>;
        }
        
        console.log(books)
        return (
            books.map((book, index) => (
                <div key={index}  >
                    <p>Titulo: {book.titulo}</p>
                    <p>Autor: {book.autor}</p>
                    <p>Editorial: {book.editorial}</p>
                </div>
            ))
        );
    };


    return (
        <section className="flex flex-col justify-center items-center" >
            <div className="flex flex-col justify-center items-start w-full p-10 bg-gray-200" >
                <h1 className="section-title text-start after:ml-0" > Resultados de búsqueda </h1>
                <div className="w-full" >
                    <InputComponent placeholder="Buscar título, autor o ISBN..." />
                </div>
                <span className="mt-4" >{books.length} Resultados</span>
            </div>
            <div className=" my-8 w-11/12 flex flex-col gap-4 justify-center items-start" >
                <RenderBooks />
            </div>
        </section>
    )
}