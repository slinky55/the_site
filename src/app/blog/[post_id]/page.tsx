'use client'
import React, {useEffect, useState} from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faReply, faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Post } from '../../types/post'
import { Comment } from '../../types/comment'
import Image from 'next/image';
import {getSession} from "next-auth/react";

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

    /* note: function unused at the moment because 
       post deletion will be done in the admin panel */
    async function deletePost() {
        const session = await getSession();

        const postData = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: params.post_id,
            }),
        }

        const res = await fetch(`/api/posts/deletepost`, postData);
        if (res.status === 403) {
            return;
        }

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
                user_id: 'd9f78e32-919a-474e-b7b7-d20449275d24',
                post_id: postId,
                parent_comment_id: parentId,
                content: content
            })
        }

        await fetch('/api/unapprovedcomments/createunapprovedcomment', queryData);
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
                  <button onClick={() => deleteComment(comment.comment_id)}><FontAwesomeIcon className={styles.trashIcon} icon={faTrash}/></button></span>
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
                    <div className="px-6 lg:contents" key={1}>
                        <div className="mx-auto max-w-2xl pb-24 pt-16 sm:pb-32 sm:pt-20 lg:ml-8 lg:mr-0 lg:w-full lg:max-w-lg lg:flex-none lg:pt-32 xl:w-1/2" key={2}>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-red-600 sm:text-4xl" key={3}>{post.title}</h1>
                            <p className="text-base font-semibold leading-7 text-gray-600" key={post.post_id}>
                                {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className={styles.authorTile} key={post.user_id}>
                            <Image src={post.image_src} alt="" width={500} height={500}/>
                        </div>
                        <div className="mt-10 max-w-xl text-base leading-7 text-gray-700 lg:max-w-none">
                            <div
                                className="mt-16 text-1xl font-bold tracking-tight text-gray-900"
                                dangerouslySetInnerHTML={{__html: post.content}}
                            ></div>
                        </div>
                        <div className={styles.postFooter}>
                            <p className={styles.date} key={post.post_id}><i>Edited on: {new Date(post.last_modified).toLocaleString()}</i></p>
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
                        <p>No comments yet. Click the {"Reply"} button to be the first to share your thoughts!</p>
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