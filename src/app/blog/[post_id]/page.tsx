'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { Post } from '../../types/post'
import { Comment } from '../../types/comment'
import Image from 'next/image';

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
    const [content, setContent] = useState<{[commentId: string]: string}>({});

    const [users, setUsers] = useState<any[]>([]);

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

                
                // Fetch user data for each post
                const users = await Promise.all(data.comments.map(async (comment: { user_id: any; }) => {
                    const userRes = await fetch(`/api/users/getusers`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: comment.user_id })
                    });
                    if (!userRes.ok) {
                        throw new Error(`HTTP error! Status: ${userRes.status}`);
                    }
                    return userRes.json();
                }));

                setUsers(users);

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
            console.log(comments);
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

    useEffect(() => {
        if(users[0]) console.log(users[0]['user'][0].name);
    }, [users])


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
                post_id: postId,
                parent_comment_id: parentId,
                content: content[parentId || 'root'] 
            })
        }

        const res = await fetch('/api/unapprovedcomments/createunapprovedcomment', queryData);
        if (res.ok) {
            setContent(prevContent => {
                const newContent = {...prevContent};
                newContent[parentId || 'root'] = '';
                return newContent;
            });
        }
    }

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

        setComments(prevComments => (prevComments || []).filter(comment => comment.comment_id !== id));
      }

      function toggleReply(id: string) {
        if(id === "root") {
            setExpandReplyRoot(!expandReplyRoot);
        }
        setExpandReply(prevExpandReply => {
            const newObj = Object.keys(prevExpandReply).reduce((acc, cur) => {
                acc[cur] = cur === id ? !prevExpandReply[cur] : false; // If the clicked id is already true, set it to false. Otherwise, set all to false.
                return acc;
            }, {} as { [key: string]: boolean });
            return newObj;
        });
    }

        // Function to clear the current textarea
        const clearCurrentTextarea = (currentCommentId) => {
            setContent(prevContent => {
                const newContent = {...prevContent};
                newContent[currentCommentId] = '';
                return newContent;
            });
        };

    const renderComments = (roots: Comment[]) => (
        <>
            <div></div>
            {
                roots.map(comment => (
                    <div className={styles.commentsContainer} key={comment.comment_id}>
                        <div className={styles.commentContainer} key={comment.comment_id}>
                            <div className={styles.postHeader}>
                                {users[0] && (<p className={styles.author} key={comment.user_id}>{users[0]['user'][0].name}</p>)}
                                <p className={styles.date} key={comment.comment_id}>{new Date(comment.created_at).toLocaleString()}</p>
                            </div>
                            <p className={styles.post} key={comment.comment_id}>{comment.content}</p>
                            <div className={styles.postFooter}>
                                <p className={styles.date} key={comment.comment_id}><i>Edited on: {new Date(comment.last_modified).toLocaleString()}</i></p>
                                <span>
                  <button onClick={() => { toggleReply(comment.comment_id); clearCurrentTextarea(comment.comment_id); }}><FontAwesomeIcon className={styles.replyIcon} icon={faReply as any}/></button>
                  <button onClick={() => deleteComment(comment.comment_id)}><FontAwesomeIcon className={styles.trashIcon} icon={faTrash as any}/></button></span>
                            </div>
                        </div>
                        {expandReply[comment.comment_id] ? (
                            <>
                               <div className={styles.commentForm}>
                                    <div className={styles.commentBox}>
                                        <div className={styles.inputWrapper}>
                                            <textarea
                                                className={styles.cmtReplyInput}
                                                id={`content-${comment.comment_id}`} // Assign a unique id to each comment input field
                                                value={content[comment.comment_id] || ''} // Use the correct content
                                                onChange={(e) => setContent(prevContent => ({...prevContent, [comment.comment_id]: e.target.value}))} // Update the correct content
                                                placeholder="Comment"
                                                required
                                            ></textarea>
                                            <button onClick={() => createComment(comment.post_id, comment.comment_id)} className={styles.commentSubmit}>Comment</button>
                                        </div>
                                    </div>
                                </div>
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
                            <Image src={post.image_src} alt="" width={700} height={700}/>
                        </div>
                        <div className={styles.postContainer}>
                            <div
                                className={styles.post}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            ></div>
                        </div>
                        <div className={styles.postFooter}>
                            <p className={styles.date} key={post.post_id}><i>Created on: {new Date(post.created_at).toLocaleString()}</i></p>
                            <button onClick={deletePost}><FontAwesomeIcon className={styles.trashIcon} icon={faTrash as any}/></button>
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
                    <div className={styles.commentForm}>
                        <div className={styles.commentBox}>
                            <div className={styles.inputWrapper}>
                                <textarea
                                    className={styles.cmtInput}
                                    id="content-root" // Assign a unique id to the root comment input field
                                    value={content['root'] || ''} // Use the correct content
                                    onChange={(e) => setContent(prevContent => ({...prevContent, ['root']: e.target.value}))} // Update the correct content
                                    placeholder="Comment"
                                    required
                                ></textarea>
                                <button onClick={() => createComment(post?.post_id, null)} className={styles.commentSubmit}>Comment</button>
                            </div>
                        </div>
                    </div>
                    <div key={6}>
                        {renderComments(rootComments)}
                    </div>
                </div>

                ) : (
                    <>
                        <p className='m-3'>No comments yet. Use the comment box below to be the first to share your thoughts!</p>
                        <>
                            <div className={styles.commentForm}>
                                <div className={styles.commentBox}>
                                    <div className={styles.inputWrapper}>
                                        <textarea
                                            className={styles.cmtInput}
                                            id="content-root" // Assign a unique id to the root comment input field
                                            value={content['root'] || ''} // Use the correct content
                                            onChange={(e) => setContent(prevContent => ({...prevContent, ['root']: e.target.value}))} // Update the correct content
                                            placeholder="Comment"
                                            required
                                        ></textarea>
                                        <button onClick={() => createComment(post?.post_id, null)} className={styles.commentSubmit}>Comment</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    </>
                )}
            </div>
        </>
    );
};

export default PostPage;