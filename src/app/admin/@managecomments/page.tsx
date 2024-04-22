'use client'
import { useEffect, useState } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Post } from '@/app/types/post';
import { Comment } from '@/app/types/comment';
import Image from "next/image"
import { Filter } from '@/app/types/filter';

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchContent, setSearchContent] = useState<string>('');
  
  const limit = 10;

    useEffect(() => {
      const postData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 1000,
          offset: 0,
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

      const data = await res.json();

    }

    async function search() {
      setLoading(true);
      var newFilters: Filter[] = [];
      
      if(searchContent !== '') {
          const filter = {
              fieldName: 'title',
              operator: 'CONTAINS',
              fieldValue: searchContent
          }
          newFilters.push(filter);
      }

      if(newFilters.length > 0) {
          const postData = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  limit: limit,
                  offset: 0,
                  filters: newFilters
              })
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
              }
          }

          getData();
        }
        else {
          setLoading(false);
        }
    }

    return (
      <>
      <div className={styles.header}>Manage Comments</div>
          <hr/>
          <div className='m-6'>
                <div className="search__input border-[1px] border-solid border-red-500 flex flex-row items-center gap-5 p-1 rounded-[8px]">
                    <label 
                        className='pl-2'
                        htmlFor="inputId">
                        <svg fill="#FF0000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488.4 488.4">
                            <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
                            s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
                            S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
                            S381.9,104.65,381.9,203.25z"/>
                        </svg>
                    </label>
                    <input
                        id="inputId"
                        value={searchContent}
                        onChange={(e) => setSearchContent(e.target.value)}
                        placeholder="Search for a blog post"
                        className=" focus:ring-0 bg-[transparent] outline-none border-none w-full py-3 pr-3 rounded-md focus:outline-none" 
                        required />
                    <button 
                      className="m-2 py-2 px-4 rounded bg-red-500 text-white hover:bg-red-700"
                      onClick={() => search()}
                      disabled={loading}>
                        Search
                    </button>
                </div>
            </div>
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
      </>
    )
  }