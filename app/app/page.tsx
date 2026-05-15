'use client'

import axios from 'axios'
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ArticleProps {
  id: string,
  title: string,
  cover: {
    url: string
  },
  content: string,
  publishedAt: Date
}

export default function Home() {
  const [articles, setArticles] = useState<ArticleProps[]>([])
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

  const getArticles = async () => {
    const response = await axios.get(`${STRAPI_URL}/api/articles?populate=*`);
    const data = await response.data;
    setArticles(data.data);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    getArticles();
  }, []);


  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Next.js and Strapi Integration</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-6">Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article
                key={article.id}
                className="bg-black shadow-md rounded-lg overflow-hidden"
              >
                <Image
                  className="w-full h-48 object-cover"
                  src={process.env.NEXT_PUBLIC_STRAPI_URL + article.cover.url}
                  alt={article.title}
                  width={180}
                  height={38}
                  priority
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.content}</p>
                  <p className="text-sm text-gray-500">
                    Published: {formatDate(article.publishedAt)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div>Nothing to fetch at the moment!</div>
          )}
        </div>
      </div>
    </div>
  )
}
