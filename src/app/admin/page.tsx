'use client'
import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styles from './page.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'

type Inquiry = {
    msg_id: string,
    author_id: string,
    msg: string,
    author: string,
    phone: string,
    email: string,
    msg_subject: string,
    created_at: Date,
  }

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

export default function AdminPage() {
    // Get Inquiries
    const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Expand Inquiry based on index
    const [expandInquiry, setExpandInquiry] = useState<boolean[]>([]);
    // Get Unapproved Comments
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [loading2, setLoading2] = useState(true);
    const [error2, setError2] = useState<string | null>(null);
    // And get their parent Comment
    const [parentComment, setParentComment] = useState<{[commentId: string]: string}>({});
    // And get their parent Post
    const [parentPost, setParentPost] = useState<{[commentId: string]: string}>({});

  
    useEffect(() => {
      const InquiryData = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
  
      async function getData() {
        try {
          const res = await fetch("/api/inquiries/getinquiries", InquiryData);
  
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
  
          const data = await res.json();

          const res2 = await fetch("/api/unapprovedcomments/getunapprovedcomments", InquiryData);

          if (!res2.ok) {
            throw new Error(`HTTP error! Status: ${res2.status}`)
          }

          const data2 = await res2.json();

          setInquiries(data.inquiries);
          setComments(data2.comments);
        } catch (error) {
          console.error(error);
          setError('Failed to load data');
        }
      }
  
      getData();
    }, []);
  
    useEffect(() => {
      if(inquiries) {
        setLoading(false);
      }
    }, [inquiries]);

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

    function expand(index: number) {
      setExpandInquiry((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = !newArray[index];
        return newArray;
      })
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

  return (
    <>
        <Header/>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : inquiries && inquiries.length > 0 ? (
            <div className={styles.inquiriesContainer} key={1}>
              <p className={styles.title} key={2}>Contact Us Forms</p>
              <hr/>
              {inquiries.map((inquiry, index) => (
                <div className={styles.inquiryContainer} key={inquiry.msg_id}>
                  <div className={styles.authorContainer} onClick={() => expand(index)}>
                    <span className={styles.author} key={inquiry.author_id}>{inquiry.author}</span>
                    {expandInquiry[index] ? (
                      <>
                        <span className={styles.email} key={inquiry.msg_id}>{inquiry.email}</span>
                        <span className={styles.phone} key={inquiry.msg_id}>{inquiry.phone}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.subj1} key={inquiry.msg_id}>Subject: {inquiry.msg_subject}</span>
                      </>
                    )}
                    <span className={styles.date} key={inquiry.msg_id}>{new Date(inquiry.created_at).toLocaleString()}</span>
                  </div>
                  {expandInquiry[index] ? (
                    <>
                      <span className={styles.subjContainer}><span className={styles.subjTitle}>Subject:</span><span className={styles.subj} key={inquiry.msg_id}>{inquiry.msg_subject}</span></span>
                      <span className={styles.msg} key={inquiry.msg_id}>{inquiry.msg}</span>
                      <hr className={styles.inquiryDivider}/>
                    </>
                  ) : (
                    <>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No inquiries found.</p>
          )}
        </div>
        <div>
        {loading2 ? (
            <p>Loading...</p>
          ) : error2 ? (
            <p>Error: {error}</p>
          ) : comments && comments.length > 0 ? (
            <div className={styles.inquiriesContainer} key={3}>
              <p className={styles.title} key={4}>Comments Pending Approval</p>
              <hr/>
              {comments.map((comment, index) => (
                <>
                  <div className={styles.container} key={comment.comment_id}>
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
                  {/* <span className={styles.msg}>
                    {comment.comment_id && comment.comment_id in parentComment ? 
                    (
                      <span>In response to Comment: {parentComment[comment.comment_id]}</span>
                    ) : (
                      <></>
                    )}
                  </span>
                  <span className={styles.msg}>
                    {comment.comment_id && comment.comment_id in parentPost ? 
                    (
                      <span>In response to Post: {parentPost[comment.comment_id]}</span>
                    ) : (
                      <></>
                    )}
                  </span> */}
                </>
              ))}
            </div>
          ) : (
            <p>No more comments pending approval.</p>
          )}
        </div>
    </>
  )
}
