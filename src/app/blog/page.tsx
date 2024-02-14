'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { Header } from '../components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

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

  const topics = ["Lifestyle", "Innovation", "Research", "Events", "Finance", "Technology & Gadgets", "Health"]

  return (
    <>
      <Header/>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : posts && posts.length > 0 ? (
          <>
            <div className={styles.featured}>
              <span className={styles.featuredText}>Featured Posts</span>
              <div className={styles.slideshowContainer}>
                <FontAwesomeIcon className={styles.arrowL} icon={faAngleLeft}/>
                <div className={styles.cardContainer}>
                  <img className={styles.cardImg} src="https://t4.ftcdn.net/jpg/00/53/64/49/360_F_53644926_0mvUCIxCCTvIa7BAIFuUa3xsaNA9lbeb.jpg"/>
                  <span className={styles.cardTitle}>The Benefits of Digital Health in Today's Society</span>
                  <span className={styles.cardAuthor}>John Doe</span><span className={styles.cardDate}>Feb 1, 2024</span>
                </div>
                <div className={styles.cardContainer}>
                  <img className={styles.cardImg} src="https://t4.ftcdn.net/jpg/00/53/64/49/360_F_53644926_0mvUCIxCCTvIa7BAIFuUa3xsaNA9lbeb.jpg"/>
                  <span className={styles.cardTitle}>The Benefits of Digital Health in Today's Society</span>
                  <span className={styles.cardAuthor}>John Doe</span><span className={styles.cardDate}>Feb 1, 2024</span>
                </div>
                <div className={styles.cardContainer}>
                  <img className={styles.cardImg} src="https://t4.ftcdn.net/jpg/00/53/64/49/360_F_53644926_0mvUCIxCCTvIa7BAIFuUa3xsaNA9lbeb.jpg"/>
                  <span className={styles.cardTitle}>The Benefits of Digital Health in Today's Society</span>
                  <span className={styles.cardAuthor}>John Doe</span><span className={styles.cardDate}>Feb 1, 2024</span>
                </div>
                <FontAwesomeIcon className={styles.arrowR} icon={faAngleRight}/>
              </div>
            </div>
            <p className={styles.title} key={2}>Recent Posts</p>
            <div className={styles.container}>
              <div className={styles.postsContainer}>
                {posts.map((post, id) => (
                  <Link key={id}href={`blog/${post.post_id}`}>
                    <div className={styles.postContainer} key={post.post_id}>
                      <img className={styles.postImg} src="https://t4.ftcdn.net/jpg/00/53/64/49/360_F_53644926_0mvUCIxCCTvIa7BAIFuUa3xsaNA9lbeb.jpg"/>
                      <div className={styles.postTitle} key={post.post_id}>{post.post}</div>
                      <div className={styles.postAuthor} key={post.author_id}>{post.author}</div>
                      <div className={styles.postDate} key={post.post_id}>{new Date(post.created_at).toLocaleString()}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className={styles.searchContainer}>
                <textarea className={styles.searchbar} placeholder='Search...'></textarea>
                <button className={styles.searchBtn}>Search</button>
              </div>
              <div className={styles.topicContainer}>
                <div className={styles.topicsTitle}>Topics</div>
                <hr></hr>
                {topics.map((topic) => (
                  <>
                    <div className={styles.topic}>{topic}</div>
                    <hr></hr>
                  </>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
}
