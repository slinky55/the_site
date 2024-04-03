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
                      <div className="mx-auto max-w-2xl lg:max-w-4xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                          Learn about the latest trends and news in the world of technology, health, and entertainment.
                        </p>
                        <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
                          {posts.map((post) => (
                              <article key={post.post_id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                                <div
                                    className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                                  <img
                                      src={post.image_src}
                                      alt=""
                                      className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                                  />
                                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>
                                </div>
                                <div>
                                  <div className="flex items-center gap-x-4 text-xs">
                                    <time dateTime={post.created_at} className="text-gray-500">
                                      {post.created_at}
                                    </time>
                                    <a
                                        href={post.topics}
                                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                    >
                                      {post.topics}
                                    </a>
                                  </div>
                                  <div className="group relative max-w-xl">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                      <a href={"www.google.come"}>
                                        <span className="absolute inset-0"/>
                                        {post.title}
                                      </a>
                                    </h3>
                                    <p className="mt-5 text-sm leading-6 text-gray-600">{post.content}</p>
                                  </div>
                                  <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                                    <div className="relative flex items-center gap-x-4">
                                      <img src={post.image_src} alt=""
                                           className="h-10 w-10 rounded-full bg-gray-50"/>
                                      <div className="text-sm leading-6">
                                        <p className="font-semibold text-gray-900">
                                          <a href={post.user_id}>
                                            <span className="absolute inset-0"/>
                                            {post.user_id}
                                          </a>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </article>
                          ))}
                        </div>
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