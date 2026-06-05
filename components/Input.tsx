'use client'
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { FormEvent } from "react";

interface InputProps {
  title?: string,
  placeholder?: string,
}

export default function InputComponent({ title, placeholder }: InputProps) {
  const router = useRouter()

  const handleInput = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const inputText = data.input_hero.toString()

    router.push(`/libros?name=${inputText}`)
  }

  return (
    <div className="px-8 py-6 flex justify-center" >
      <div className="max-w-7xl w-full" >
        <div className="mb-10 flex items-end justify-between">
          {title != null && title != '' &&
            <h2 className="flex items-center gap-3 text-3xl font-bold text-primary">
              {title}
            </h2>
          }
        </div>
        <form onSubmit={handleInput} className="bg-gray-300 flex justify-between items-center h-12 rounded-lg mb-4 overflow-hidden" >
          <input
            required
            className="flex-5 ml-4 text-gray-600 font-bold h-full outline-none focus:outline-none focus:ring-0"
            type="text"
            name="input_hero"
            id="input_hero" placeholder={placeholder || ''} />
          <button type="submit" className="flex-1 flex gap-2 justify-center items-center bg-blue-500 h-full cursor-pointer" >
            <Search size={16} className="text-white" />
            <span className="text-white" >Buscar</span>
          </button>
        </form>
      </div>
    </div>
  )
}