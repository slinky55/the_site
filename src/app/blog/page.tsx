'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { Header } from '../components/Header'

type Post = {
  post_id: number,
  author_id: number,
  post: string,
  author: string,
  created_at: Date,
  last_modified: Date
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
    <Header />
      <Link href="blog/new-post">Create Post</Link>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : posts && posts.length > 0 ? (
          <div className={styles.postsContainer} key={1}>
            <p className={styles.title} key={2}>Blog</p>
            {posts.map(post => (
              <Link href={`blog/${post.post_id}`}>
                <div className={styles.postContainer} key={post.post_id}>
                  <p className={styles.author} key={post.author_id}>{post.author}</p>
                  <p className={styles.post} key={post.post_id}>{post.post}</p>
                  <p key={post.post_id}>Created at: {new Date(post.created_at).toLocaleString()}</p>
                  <p key={post.post_id}>Last Modified: {new Date(post.last_modified).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
}
