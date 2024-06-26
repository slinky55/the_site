'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from "react";
import { faCheckCircle, faReply, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { Dialog, Description, Transition, Button } from '@headlessui/react'
import styles from '../page.module.css'
import { Comment } from '../../types/comment'
import { Spinner } from "@/app/components/Spinner";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export default function Page() {
    // Get Unapproved Comments
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // And get their parent Comment
    const [parentComment, setParentComment] = useState<{[commentId: string]: string}>({});
    // And get their parent Post
    const [parentPost, setParentPost] = useState<{[commentId: string]: string}>({});
    // Modal for Comment approval
    const [modal, setModal] = useState<boolean[]>([]);
    // Pagination
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;

  
    useEffect(() => {
      const cmtData = {
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
          const res2 = await fetch("/api/unapprovedcomments/getunapprovedcomments", cmtData);

          if (!res2.ok) {
            throw new Error(`HTTP error! Status: ${res2.status}`)
          }

          const data2 = await res2.json();

          setComments(data2.comments);
        } catch (error) {
          console.error(error);
          setError('Failed to load data');
        } finally {
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
                const res = await fetch("/api/unapprovedcomments/getunapprovedcomments", queryData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.comments)) {
                    throw new Error('Unexpected data format');
                }

                setComments(prevComments => [...prevComments, ...data.comments]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setPagesLoaded(pagesLoaded + 1);
            }
      }

      getData();
    }

    useEffect(() => {
      if(comments) {
        // Load parent comment and post for each comment
        for(let i = 0; i < comments.length; i++) {
          // Get parent comment from comments table
          let queryData1 = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              comment_id: comments[i].parent_comment_id,
            }),
          }

          let queryData2 = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post_id: comments[i].post_id,
            }),
          }

          if(comments[i].parent_comment_id != null) {
            
            async function getParentComments() {
              const res = await fetch("/api/comments/getcomment", queryData1);
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
      
              const data = await res.json();
              
              // Add to a map a pairing of key value 'comment_id' to mapped parent comment'
              if(comments) {
                setParentComment(prev => {
                  const newObj = { ...prev };
                  newObj[comments[i].comment_id] = data.comment[0].cmt;
                  return newObj;
                });
         
              }
  
            }

            getParentComments();
          }

          async function getParentPost() {
            const res = await fetch("/api/posts/getpost", queryData2);
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
    
            const data = await res.json();
            
            // Add to a map a pairing of key value 'comment_id' to mapped parent comment'
            if(comments) {
              setParentPost(prev => {
                const newObj = { ...prev };
                newObj[comments[i].comment_id] = data.posts[0].content;
                return newObj;
              })
            }
          }

          getParentPost();
        }
      }
      setLoading(false);
    }, [comments]);

    useEffect(() => {
      if(Object.keys(parentComment).length > 0) {
        setLoading(false);
      }
    }, [parentComment]);

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

      const res = await fetch("/api/unapprovedcomments/deleteunapprovedcomments", query2Data)
      console.log(res);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

    }

    async function approveComment(comment: Comment) {
      // Create the same comment in the comments table.
      const queryData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_id: comment.comment_id,
          user_id: comment.user_id,
          post_id: comment.post_id,
          parent_comment_id: comment.parent_comment_id,
          content: comment.content
        }),
      }

      const res = await fetch("/api/comments/createcomment", queryData);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      // Delete the comment in the unapproved comments table
      deleteComment(comment.comment_id);
    }

    async function rejectComment(id: string) {
      // Delete the comment in the unapproved comments table
      deleteComment(id);
    }

    function openModal(index: number) {
      setModal((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = !newArray[index];
        return newArray;
        })
    }


    return (
        <div>
        {comments ? (
            <div className={styles.inquiriesContainer} key={3}>
              <p className={styles.title} key={4}>Comments Pending Approval</p>
              <hr/>
              {comments.map((comment, index) => (
                <>
                  <div className={styles.container} key={comment.comment_id} onClick={() => openModal(index)}>
                    <div className={styles.commentContainer}>
                      <div className={styles.commentHead}>
                        <span className={styles.commentAuthor} key={comment.user_id}>{comment.user_id}</span>
                        <span className={styles.commentDate} key={comment.comment_id}>{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                      <span className={styles.comment}>{comment.content}</span>
                    </div>
                  </div>
                  <Transition appear show={modal[index] ?? false} as={Fragment}>
                    <Dialog
                      as="div" className="relative z-10"
                      onClose={() => openModal(index)} 
                      open={modal[index] ?? false}>
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0 bg-black/25" />
                      </Transition.Child>
                      <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                  as="h3"
                                  className="text-lg font-medium leading-6 text-gray-900"
                                >
                                  Comment Details
                                </Dialog.Title>
                                <Description>
                                  {comment.comment_id && comment.comment_id in parentPost ? 
                                  ( <>
                                      <p><b>Blog Post</b></p>
                                      <div className={styles.contextPost}
                                      dangerouslySetInnerHTML={{ __html: parentPost[comment.comment_id] }}></div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {comment.comment_id && comment.comment_id in parentComment ? 
                                  (
                                    <div className={styles.contextComment}><FontAwesomeIcon icon={faReply as IconProp}/><span className={styles.gap}></span>{parentComment[comment.comment_id]}</div>
                                  ) : (
                                    <></>
                                  )}
                                  <hr></hr>
                                  <p><b>Comment pending approval</b></p>
                                  <div className={styles.modalComment}>
                                    {comment.content}
                                  </div>
                                </Description>
                                <div className={styles.modalFooter}>
                                  <Button
                                    type="button"
                                    onClick={() => approveComment(comment)}
                                    className={styles.approveModal}
                                  >
                                    Approve<span className={styles.gap}></span><FontAwesomeIcon className={styles.checkmark} icon={faCheckCircle as IconProp}/>
                                  </Button>
                                  <Button 
                                    type="button"
                                    onClick={() => rejectComment(comment.comment_id)}
                                    className={styles.rejectModal}>
                                    Reject<span className={styles.gap}></span><FontAwesomeIcon className={styles.x} icon={faXmarkCircle as IconProp}/>
                                  </Button>
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                    </Dialog>
                  </Transition>
                </>
              ))}
            </div>
          ) : (
            <p>No more comments pending approval.</p>
          )}
          <div
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
      >
        {!loading ? (
          <button onClick={loadMore}>Load more items...</button>
        ) : (
          <Spinner />
        )}
      </div>
        </div>
    );
  }