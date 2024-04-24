'use client'
import { useEffect, useState } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Post } from '@/app/types/post';
import { Comment } from '@/app/types/comment';
import Image from "next/image"
import { Filter } from '@/app/types/filter';
import { Sort } from '@/app/types/sort';
import SearchBar from '@/app/components/Searchbar';
import DeleteMessage from "@/app/components/DeleteMessage";

interface Data {
  posts: Post[]
}

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchContent, setSearchContent] = useState<string>('');

  const [deleteState, setDeleteState] = useState(false);
  
  const limit = 10;
  const sort: Sort = {
    fieldName: 'created_at',
    direction: 'DESC'
  }

    useEffect(() => {
      const postData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 1000,
          offset: 0,
          sort: sort,
          filters: []
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

    async function deleteComment(id: string) {
      const query2Data = {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment_id: id,
          }),
      }

      const res = await fetch("/api/comments/deletecomment", query2Data)
      console.log(res);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setPost(null);
      setDeleteState(true);

      setTimeout(()  => {
        setDeleteState(false);
      }, 3000);

      const data = await res.json();

      setComments(comments.filter(comment => comment.comment_id !== id));
    }

    const handleDataReceived = (data: Data) => {
      setPosts(data.posts);
  };

    return (
      <>
      <div className={styles.header}>Manage Comments</div>
          <hr/>
          <SearchBar params={{ limit: 100, offset: 0, topics: true, type: 'posts', sort: sort }} onDataReceived={handleDataReceived}/>
      <div className={styles.instruction}>Please begin by selecting the post whose comments you wish to review.</div>
      <div className={styles.container}> 
      {post ? (
        <>
          {posts.map((post, key) => (
            <div className={styles.subContainer} key={key}>
              <Image className={styles.thumbnail} src={post.image_src} alt="" width={500} height={500}/>
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
          ))}
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
                <button className={styles.btn} onClick={() => deleteComment(comment.comment_id)}>
                    Delete
                </button>
              </div>
            ))}
          </div>
        </>
      ) 
      : posts ? (
        posts.map((post, key) => (
          <div className={styles.subContainer} key={key}>
            <Image className={styles.thumbnail} src={post.image_src} alt="" width={500} height={500}/>
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
      <div className="w-full relative mb-15 flex justify-center">
      <div className="absolute top-0">
        <DeleteMessage deleteMsg={deleteState} message="Comment successfully deleted" />
      </div>
    </div>
      </>
    )
  }