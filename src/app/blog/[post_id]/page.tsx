'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';

interface PostPageProps {
  params: {
    post_id: string;
  };
}

type Post = {
  post_id: number,
  author_id: number,
  post: string,
  author: string,
  created_at: Date,
  last_modified: Date
}

const PostPage: React.FC<PostPageProps> = ({ params }) => {

    const router = useRouter();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const postData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: params.post_id,
          }),
        }

        async function getData() {
        try {
            const res = await fetch(`/api/posts/getpost`, postData);

            if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setPost(data.posts[0]);
        } catch (error) {
            console.error(error);
            setError('Failed to load data');
        }
        }

        getData();
    }, []);

    useEffect(() => {
        if(post) {
          console.log(post)
          setLoading(false);
        }
      }, [post]);


    async function deletePost() {
      const postData = {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: params.post_id,
          }),
      }

      await fetch(`/api/posts/deletepost`, postData);

      router.push('/blog')
    }

  return (
<>
  <Header />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : post ? (
          <div className={styles.postsContainer} key={1}>
            <p className={styles.title} key={2}>Blog</p>
            <div className={styles.postContainer} key={post.post_id}>
                <p className={styles.author} key={post.author_id}>{post.author}</p>
                <p className={styles.post} key={post.post_id}>{post.post}</p>
                <p key={post.post_id}>Created at: {new Date(post.created_at).toLocaleString()}</p>
                <p key={post.post_id}>Last Modified: {new Date(post.last_modified).toLocaleString()}</p>
            </div>
            <button onClick={deletePost}>Delete Post</button>
          </div>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
};

export default PostPage;