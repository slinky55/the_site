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
          <>
            <div className={styles.featured}>
              <span className={styles.featuredText}>Featured Posts</span>
              <div className={styles.slideshowContainer}>
                <FontAwesomeIcon className={styles.arrowL} icon={faAngleLeft} onClick={prevPost}/>
                <div className={styles.slideshowSubContainer}>
                {posts?.slice(ssStart,ssEnd).map((post, index) => (
                  <>
                    <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className={`${styles.cardContainer} ${index === 1 ? styles.firstCard : index === 2 ? styles.secondCard : styles.thirdCard}`} 
                    key={post.post_id}>
                      <img className={styles.cardImg} src={post.image_src} key={post.post_id}/>
                      <span className={styles.cardTitle} key={post.post_id}>{post.title}</span>
                      <span className={styles.cardAuthor} key={post.post_id}><FontAwesomeIcon icon={faUser}/>{post.user_id}</span><span className={styles.cardDate}><FontAwesomeIcon icon={faCalendar}/>{new Date(post.created_at).toLocaleString()}</span>
                    </motion.div>
                  </>
                ))}
                </div>
                <FontAwesomeIcon className={styles.arrowR} icon={faAngleRight} onClick={nextPost}/>
              </div>
            </div>
            <p className={styles.title} key={2}>Recent Posts</p>
            <div className={styles.container}>
              <div className={styles.postsContainer}>
                {posts?.map((post, id) => (
                  <>
                    <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }} 
                    className={styles.postContainer} 
                    key={post.post_id}>
                      <img className={styles.postImg} src={post.image_src} key={post.post_id}/>
                      <div className={styles.postTitle} key={post.post_id}>{post.title}</div>
                      <div className={styles.postAuthor} key={post.post_id}><FontAwesomeIcon icon={faUser}/> {post.user_id}</div>
                      <div className={styles.postDate} key={post.post_id}><FontAwesomeIcon icon={faCalendar}/>{new Date(post.created_at).toLocaleString()}</div>
                      <Link key={post.post_id} href={`blog/${post.post_id}`}><div className={styles.readMore}>Read More</div></Link>
                    </motion.div>
                  </>
                ))}
              </div>
                <div className={styles.rightContainer}>
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
            </div>
          </>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
}