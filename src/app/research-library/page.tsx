'use client'
import styles from './page.module.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Research } from '@/app/types/research';
import { Sort } from '../types/sort';
import SearchBar from '../components/Searchbar';

interface Data {
  research: Research[]
}

export default function ResearchLibraryPage() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const sort: Sort = {
    fieldName: 'title',
    direction: 'DESC'
  }

  useEffect(() => {
    const queryData = {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: limit,
          offset: 0,
          sort: sort,
          filters: []
        })
    }
    async function getData() {
      try {
        const res = await fetch("/api/research/getresearchs", queryData);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        if (!Array.isArray(data.research)) {
          console.log("Data is ", data);
          throw new Error('Unexpected data format');
        }

        setResearch(data.research);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  const handleDataReceived = (data: Data) => {
    setResearch(data.research);
  };

  return (
    <div className={styles.container}>
      <div id="functionalBody">
          <SearchBar params={{ limit: 100, offset: 0, topics: true, type: 'research', sort: sort }} onDataReceived={handleDataReceived}/>
          <div className="bg-white py-4 sm:py-8">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Research Library</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Research articles spotlighted by the T.H.E. Team
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {research.map((research: Research) => (
                        <article key={research.title} className="flex flex-col items-start justify-between">
                            <div className="relative w-full">
                                <Image src={research.thumbnail} alt="" className="object-cover w-full h-48 rounded-2xl" width={500} height={500} />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                            </div>
                            <div className="max-w-xl">
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                        <a href={`${research.url}`}>
                                            <span className="absolute inset-0" />
                                            Article Title: {research.title}
                                        </a>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">Journal: {research.journal}</p>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">Topics: {research.topics.substring(1, research.topics.length-1)}</p>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">Written On: {new Date(research.written_on).toLocaleString()}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
