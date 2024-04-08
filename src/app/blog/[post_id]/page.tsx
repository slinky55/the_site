'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faReply, faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Post } from '../../types/post'
import { Comment } from '../../types/comment'
import Image from "next/image";

interface PostPageProps {
  params: {
    post_id: string;
  };
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
    }, [params.post_id]);

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
          user_id: '3ab70c34-984f-457e-9a0d-0387bb0f2771',
          post_id: postId,
          parent_comment_id: parentId,
          content: content
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
      <div></div>
      {
        roots.map(comment => (
          <div className={styles.commentsContainer} key={comment.comment_id}>
            <div className={styles.commentContainer} key={comment.comment_id}>
              <div className={styles.postHeader}>
                <p className={styles.author} key={comment.user_id}>{comment.user_id}</p>
                <p className={styles.date} key={comment.comment_id}>{new Date(comment.created_at).toLocaleString()}</p>
              </div>
              <p className={styles.post} key={comment.comment_id}>{comment.content}</p>
              <div className={styles.postFooter}>
                <p className={styles.date} key={comment.comment_id}><i>Edited on: {new Date(comment.last_modified).toLocaleString()}</i></p>
                <span>
                  <button onClick={() => toggleReply(comment.comment_id)}><FontAwesomeIcon className={styles.replyIcon} icon={faReply}/></button>
                  <button><FontAwesomeIcon className={styles.trashIcon} icon={faTrash}/></button></span>
              </div>
            </div>
            {expandReply[comment.comment_id] ? (
              <>
                <div className={styles.commentForm}>
                  <input
                    className={styles.cmtInput}
                    type="text"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <button onClick={() => createComment(comment.post_id, comment.comment_id)}><FontAwesomeIcon className={styles.checkIcon} icon={faCheck}/></button>
                <button onClick={() => toggleReply(comment.comment_id)}><FontAwesomeIcon className={styles.trashIcon} icon={faCancel}/></button>
              </>
              ) : (
              <>
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
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : post ? (
          <div className={styles.container} key={1}>
            <div className={styles.postHeader} key={2}>
              <p className={styles.title} key={3}>{post.title}</p>
              <p className={styles.date} key={post.post_id}>{new Date(post.created_at).toLocaleString()}</p>
            </div>
            <div className={styles.authorTile} key={post.user_id}>
                <Image src={post.image_src} alt=""/>
                <p className={styles.author} key={post.user_id}>{post.user_id}</p>
            </div>
            <div className={styles.postContainer}>
              <div
                className={styles.post}
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
            </div>
            <div className={styles.postFooter}>
                <p className={styles.date} key={post.post_id}><i>Edited on: {new Date(post.last_modified).toLocaleString()}</i></p>
                <button onClick={deletePost}><FontAwesomeIcon className={styles.trashIcon} icon={faTrash}/></button>
            </div>
          </div>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
      <hr></hr>
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
                <div className={styles.commentForm}>
                  <input
                    className={styles.cmtInput}
                    type="text"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Comment"
                    required
                  />
                </div>
                <button onClick={() => createComment(post?.post_id, null)}><FontAwesomeIcon className={styles.checkIcon} icon={faCheck}/></button>
                <button onClick={() => toggleReply("root")}><FontAwesomeIcon className={styles.trashIcon} icon={faCancel}/></button>
              </>
              ) : (
              <>
                <button className={styles.postReply} onClick={() => toggleReply("root")}>New Comment</button>
              </>
            )}
            <div key={6}>
              {
                renderComments(rootComments)
              }
            </div>
          </div>
        ) : (
          <>
          <p>No comments yet. Click the {"}Reply{"} button to be the first to share your thoughts!</p>
          {expandReplyRoot ? (
              <>
                <div className={styles.commentForm}>
                  <input
                    className={styles.cmtInput}
                    type="text"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Comment"
                    required
                  />
                </div>
                <button onClick={() => createComment(post?.post_id, null)}><FontAwesomeIcon className={styles.checkIcon} icon={faCheck}/></button>
                <button onClick={() => toggleReply("root")}><FontAwesomeIcon className={styles.trashIcon} icon={faCancel}/></button>
              </>
              ) : (
              <>
                <button className={styles.postReply} onClick={() => toggleReply("root")}>New Comment</button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PostPage;