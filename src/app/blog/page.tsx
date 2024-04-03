'use client'
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import styles from './page.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Post } from '../types/post';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ssStart, setSsStart] = useState<number>(0);
  const [ssEnd, setSsEnd] = useState<number>(3);

  useEffect(() => {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }

    async function getData() {
      try {
        const res = await fetch("/api/posts/getposts", postData);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
        setError('Failed to load data');
      }
    }

    getData();
  }, []);

  useEffect(() => {
    if(posts) {
      setLoading(false);
    }
  }, [posts]);

  const topics = ["Lifestyle", "Innovation", "Research", "Events", "Finance", "Technology & Gadgets", "Health"]

  function nextPost() {
    if((ssEnd) == posts!.length) {
      setSsStart(0);
      setSsEnd(3);
    }
    else {
      setSsStart(ssStart + 1);
      setSsEnd(ssEnd + 1);
    }
  }

  function prevPost() {
    if((ssStart - 1) < 0) {
      setSsStart(posts!.length - 3);
      setSsEnd(posts!.length);
    }
    else {
      setSsStart(ssStart - 1);
      setSsEnd(ssEnd - 1);
    }
  }

  return (
      <>
        <div>
          {loading ? (
              <p>Loading...</p>
          ) : error ? (
              <p>Error: {error}</p>
          ) : posts && posts.length > 0 ?
              (
                  <div className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">T.H.E Blog</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                          Learn about the latest trends and news in the world of technology, health, and entertainment.
                        </p>
                      </div>
                      <div
                          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {posts.map((post) => (
                            <article key={post.post_id} className="flex flex-col items-start justify-between">
                              <div className="relative w-full">
                                <img
                                    src={post.image_src}
                                    alt=""
                                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                                />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>
                              </div>
                              <div className="max-w-xl">
                                <div className="mt-8 flex items-center gap-x-4 text-xs">
                                  <time dateTime={post.created_at} className="text-gray-500">
                                    {post.created_at}
                                  </time>
                                  <a
                                      href={post.topics}
                                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                  >
                                    {post.title}
                                  </a>
                                </div>
                                <div className="group relative">
                                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                    <a href={post.content}>
                                      <span className="absolute inset-0"/>
                                      {post.title}
                                    </a>
                                  </h3>
                                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.content}</p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                  <img src={post.user_id} alt=""
                                       className="h-10 w-10 rounded-full bg-gray-100"/>
                                  <div className="text-sm leading-6">
                                    <p className="font-semibold text-gray-900">
                                      <a href={post.user_id}>
                                        <span className="absolute inset-0"/>
                                        {post.user_id}
                                      </a>
                                    </p>
                                    <p className="text-gray-600">{post.user_id}</p>
                                  </div>
                                </div>
                              </div>
                            </article>
                        ))}
                      </div>
                    </div>
                  </div>

              )
              :
              (
                  <p>No posts available.</p>
              )
          }
        </div>
      </>
  )
      ;
}