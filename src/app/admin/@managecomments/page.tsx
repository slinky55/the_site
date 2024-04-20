'use client'
import { useEffect, useState } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Post } from '@/app/types/post';
import { Comment } from '@/app/types/comment';
import Image from "next/image"

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
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

    useEffect(() => {
      const queryData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post?.post_id
        }),
      }

      async function getData() {
          try {
              const res = await fetch("/api/comments/getcomments", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();
              console.log(data);

              if (!Array.isArray(data.comments)) {
                  throw new Error('Unexpected data format');
              }

              setComments(data.comments);
          } catch (error) {
              console.error(error);
          } finally {
              setLoading(false);
          }
      }

      getData();
    }, [post]);

    return (
      <>
      <div className={styles.header}>Manage Comments</div>
          <hr/>
      <div className={styles.instruction}>Please begin by selecting the post whose comments you wish to review.</div>
      <div className={styles.container}> 
      {post ? (
      <div>
        {comments.map((comment, key) => (
          <div className={styles.subContainer} key={key}>
            <div className={styles.title}>
              {comment.content}
            </div>
            <div className={styles.user}>
              {comment.user_id}
            </div>
            <div className={styles.date}>
                {new Date(comment.created_at).toLocaleString()}
            </div>
            <button className={styles.btn}>
              Select
            </button>
        </div>
      ))}
      </div>
      ) 
      : posts ? (
        posts.map((post, key) => (
          <div className={styles.subContainer} key={key}>
            <Image className={styles.thumbnail} src={post.image_src} alt="filler"/>
            <div className={styles.title}>
              {post.title}
            </div>
            <div className={styles.user}>
              {post.user_id}
            </div>
            <div className={styles.date}>
                {new Date(post.created_at).toLocaleString()}
            </div>
            <button onClick={() => setPost(post)} className={styles.btn}>
              Select Post
            </button>
        </div>
      ))) : (
        <div>No existing posts.</div>
      )} 
      </div>
      </>
    )
  }