'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { v4 as uuidv4 } from 'uuid';

interface PostPageProps {
  params: {
    post_id: string;
  };
}

type Post = {
  post_id: string,
  author_id: string,
  post: string,
  author: string,
  created_at: Date,
  last_modified: Date
}

type Comment = {
  comment_id: string,
  author_id: string,
  post_id: string,
  parent_comment_id: string,
  cmt: string,
  author: string,
  created_at: Date,
  last_modified: Date,
}

const PostPage: React.FC<PostPageProps> = ({ params }) => {

    const router = useRouter();

    // Posts
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Comments
    const [comments, setComments] = useState<Comment[] | null>(null)
    const [loading2, setLoading2] = useState(true);
    const [error2, setError2] = useState<string | null>(null);

    // Displaying comments in nested structure
    const [rootComments, setRootComments] = useState<Comment[]>([])
    const [nestedComments, setNestedComments] = useState<{[parentId: string]: Comment[]}>({});

    // Expand reply chatbox for responding to a post
    const [expandReplyRoot, setExpandReplyRoot] = useState<boolean>(false);

    // Expand reply chatbox based on index
    const [expandReply, setExpandReply] = useState<{[commentId: string]: boolean}>({});

    // Making a comment
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const queryData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: params.post_id,
          }),
        }

        async function getPost() {
          try {
              const res = await fetch(`/api/posts/getpost`, queryData);

              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();
              setPost(data.posts[0]);
          } catch (error) {
              setError('Failed to load data');
          }
        }

        async function getComments() {
          try {
              const res = await fetch(`/api/comments/getcomments`, queryData);

              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();
              setComments(data.comments);
          } catch (error2) {
              setError2('Failed to load data');
          }
        }

        getPost();
        getComments();
    }, []);

    useEffect(() => {
        if(post) {
          setLoading(false);
        }
    }, [post]);

    useEffect(() => {
      if(comments) {
        const group: {[parentId: string]: Comment[] } = {};
        const roots: Comment[] = [];
        const init: {[commentId: string]: boolean} = {};
        comments.forEach((comment: Comment) => {
            init[comment.comment_id] = false;
            if(comment.parent_comment_id) {
              group[comment.parent_comment_id] ||= [];
              group[comment.parent_comment_id].push(comment);
            }
            else {
              roots.push(comment);
            }
        });

        setNestedComments(group);
        setRootComments(roots);
        setExpandReply(init);
        setLoading2(false);
      }
    }, [comments]);  


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

    async function createComment(postId: string | undefined, parentId: string | null) {
      if(postId == undefined) {
        setError2("Something went wrong. Creating comment with undefined postId.")
      }
      const queryData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_id: uuidv4(),
          author_id: uuidv4(),
          post_id: postId,
          parent_comment_id: parentId,
          cmt: content,
          author: authorName
        })
      }

      await fetch('/api/unapprovedcomments/createunapprovedcomment', queryData);
    }

    function toggleReply(id: string) {
      if(id == "root") {
        setExpandReplyRoot(!expandReplyRoot);
      }
      setExpandReply(prevExpandReply => {
        const newObj = { ...prevExpandReply };
        newObj[id] = !newObj[id];
        return newObj;
      });
    }

    const renderComments = (roots: Comment[]) => (
      <>
      {
        roots.map(comment => (
          <div key={comment.comment_id}>
            <div className={styles.postContainer} key={comment.comment_id}>
                <p className={styles.author} key={comment.author_id}>{comment.author}</p>
                <p className={styles.post} key={comment.comment_id}>{comment.cmt}</p>
                <p key={comment.comment_id}>Created at: {new Date(comment.created_at).toLocaleString()}</p>
                <p key={comment.comment_id}>Last Modified: {new Date(comment.last_modified).toLocaleString()}</p>
            </div>
            {expandReply[comment.comment_id] ? (
              <>
                <div>
                  <input
                    type="text"
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  />
                  <input 
                    type="text" 
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <button onClick={() => createComment(comment.post_id, comment.comment_id)}>Post</button>
                <button onClick={() => toggleReply(comment.comment_id)}>Cancel</button>
              </>
              ) : (
              <>
                <button onClick={() => toggleReply(comment.comment_id)}>Reply</button>
              </>
            )}
            {
              nestedComments[comment.comment_id] && (
                renderComments(nestedComments[comment.comment_id])
              )
            }
          </div>
        ))
      }
      </>
    )

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
      <div>
        ---------------------------
      </div>
      <div key={3}>
        {loading2 ? (
          <p>Loading...</p>
        ) : error2 ? (
          <p>Error: {error2}</p>
        ) : comments && comments.length > 0 ? (
          <div className={styles.postsContainer} key={4}>
            <p className={styles.title} key={5}>Comments</p>
            {expandReplyRoot ? (
              <>
                <div>
                  <input
                    type="text"
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  />
                  <input 
                    type="text" 
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <button onClick={() => createComment(post?.post_id, null)}>Post</button>
                <button onClick={() => toggleReply("root")}>Cancel</button>
              </>
              ) : (
              <>
                <button onClick={() => toggleReply("root")}>Reply</button>
              </>
            )}
            <div key={6}>
              {
                renderComments(rootComments)
              }
            </div>
          </div>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
};

export default PostPage;