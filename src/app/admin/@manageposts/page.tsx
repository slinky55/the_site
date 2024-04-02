'use client'
import { useEffect, useState } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Post } from '@/app/types/post';

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch("/api/posts/getposts");

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.posts)) {
                    throw new Error('Unexpected data format');
                }

                setPosts(data.posts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, []);
    return (
      <>
      <div className={styles.header}>Manage Posts</div>
          <hr/>
      <div className={styles.container}> 
      {posts ? (
        posts.map((post) => (
          <div className={styles.subContainer}>
            <img className={styles.thumbnail} src={post.image_src}/>
            <div className={styles.title}>
              {post.title}
            </div>
            <div className={styles.user}>
              {post.user_id}
            </div>
            <div className={styles.date}>
                {new Date(post.created_at).toLocaleString()}
            </div>
            <button className={styles.btn}>
              View More
            </button>
        </div>
      ))) : (
        <span>No existing posts.</span>
      )} 
      </div>
      </>
    )
  }