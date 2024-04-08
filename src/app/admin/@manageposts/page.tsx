'use client'
import { useEffect, useState } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Post } from '@/app/types/post';
import { Spinner } from '@/app/components/Spinner';
import Image from "next/image";

export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;

    useEffect(() => {
        const postData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: limit,
            offset: 0,
          })
        }
        async function getData() {
            try {
                const res = await fetch("/api/posts/getposts", postData);

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
                setPagesLoaded(1);
            }
        }

        getData();
    }, []);

    async function loadMore() {
        setLoading(true);
        const queryData = {
          method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              limit: limit,
              offset: (pagesLoaded * limit) - 1,
            })
        }
        async function getData() {
            try {
                const res = await fetch("/api/posts/getposts", queryData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.posts)) {
                    throw new Error('Unexpected data format');
                }

                setPosts(prevPosts => [...prevPosts, ...data.posts]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setPagesLoaded(pagesLoaded + 1);
            }
      }

      getData();
    }
    return (
      <>
      <div className={styles.header}>Manage Posts</div>
          <hr/>
      <div className={styles.container}> 
      {posts ? (
        posts.map((post, key) => (
          <div className={styles.subContainer} key={key}>
            <Image className={styles.thumbnail} src={post.image_src} alt=""/>
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
      <div
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
      >
        {!loading ? (
          <button onClick={loadMore}>Load more items...</button>
        ) : (
          <Spinner />
        )}
      </div>
      </>
    )
  }