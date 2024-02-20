'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import styles from '../page.module.css'
import { faCheckCircle, faReply, faX, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.css';

type Post = {
    post_id: number,
    author_id: number,
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

export default function Page() {
    // Get Unapproved Comments
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [loading2, setLoading2] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // And get their parent Comment
    const [parentComment, setParentComment] = useState<{[commentId: string]: string}>({});
    // And get their parent Post
    const [parentPost, setParentPost] = useState<{[commentId: string]: string}>({});
    // Modal for Comment approval
    const [modal, setModal] = useState<boolean[]>([]);

  
    useEffect(() => {
      const InquiryData = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
  
      async function getData() {
        try {
          const res2 = await fetch("/api/unapprovedcomments/getunapprovedcomments", InquiryData);

          if (!res2.ok) {
            throw new Error(`HTTP error! Status: ${res2.status}`)
          }

          const data2 = await res2.json();

          setComments(data2.comments);
        } catch (error) {
          console.error(error);
          setError('Failed to load data');
        }
      }
  
      getData();
    }, []);

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
                newObj[comments[i].comment_id] = data.posts[0].post;
                return newObj;
              })
            }
          }

          getParentPost();
        }
      }
    }, [comments]);

    useEffect(() => {
      if(Object.keys(parentComment).length > 0) {
        setLoading2(false);
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

      const res = await fetch("/api/unapprovedcomments/deleteunapprovedcomment", query2Data)

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
          author_id: comment.author_id,
          post_id: comment.post_id,
          parent_comment_id: comment.parent_comment_id,
          cmt: comment.cmt,
          author: comment.author
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
        {loading2 ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : comments && comments.length > 0 ? (
            <div className={styles.inquiriesContainer} key={3}>
              <p className={styles.title} key={4}>Comments Pending Approval</p>
              <hr/>
              {comments.map((comment, index) => (
                <>
                  <div className={styles.container} key={comment.comment_id} onClick={() => openModal(index)}>
                    <div className={styles.commentContainer}>
                      <div className={styles.commentHead}>
                        <span className={styles.commentAuthor} key={comment.author_id}>{comment.author}</span>
                        <span className={styles.commentDate} key={comment.comment_id}>{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                      <span className={styles.comment}>{comment.cmt}</span>
                    </div>
                    <div className={styles.buttonContainer}>
                      <button className={styles.checkmarkBtn} onClick={() => approveComment(comment)}>Approve <FontAwesomeIcon className={styles.checkmark} icon={faCheckCircle}/></button>
                      <button className={styles.xBtn} onClick={() => rejectComment(comment.comment_id)}>Reject <FontAwesomeIcon className={styles.x} icon={faXmarkCircle}/></button>
                    </div>
                  </div>
                  <Modal
                    toggle={() => openModal(index)} 
                    isOpen={modal[index]}>
                    <div className={styles.modalHeader}>
                      <h5 className={styles.modalTitle}>
                        Comment Details
                      </h5>
                      <button
                        aria-label="Close"
                        className={styles.closeModal}
                        type="button"
                        onClick={() => openModal(index)}
                      >
                        <FontAwesomeIcon className={styles.xModal} icon={faX}/>
                      </button>
                    </div>
                    <ModalBody>
                      {comment.comment_id && comment.comment_id in parentPost ? 
                      ( <>
                          <p><b>Blog Post</b></p>
                          <div className={styles.contextPost}>{parentPost[comment.comment_id]}</div>
                        </>
                      ) : (
                        <></>
                      )}
                      {comment.comment_id && comment.comment_id in parentComment ? 
                      (
                        <div className={styles.contextComment}><FontAwesomeIcon icon={faReply}/><span className={styles.gap}></span>{parentComment[comment.comment_id]}</div>
                      ) : (
                        <></>
                      )}
                      <hr></hr>
                      <p><b>Comment pending approval</b></p>
                      <div className={styles.modalComment}>
                        {comment.cmt}
                      </div>
                    </ModalBody>
                    <div className={styles.modalFooter}>
                      <Button
                        type="button"
                        onClick={() => approveComment(comment)}
                        className={styles.approveModal}
                      >
                        Approve<span className={styles.gap}></span><FontAwesomeIcon className={styles.checkmark} icon={faCheckCircle}/>
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => rejectComment(comment.comment_id)}
                        className={styles.rejectModal}>
                        Reject<span className={styles.gap}></span><FontAwesomeIcon className={styles.x} icon={faXmarkCircle}/>
                      </Button>
                    </div>
                  </Modal>
                </>
              ))}
            </div>
          ) : (
            <p>No more comments pending approval.</p>
          )}
        </div>
    );
  }