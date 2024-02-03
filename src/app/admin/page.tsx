'use client'
import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styles from './page.module.css'

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
    // And get their parent Comments
    const [parentComments, setParentComments] = useState<Map<string, Comment> | null>(null);
    // And get their parent Posts
    const [parentPosts, setParentPosts] = useState<Map<string, Post> | null>(null);

  
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
          if(comments[i].parent_comment_id != null) {
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
            
            async function getParentComments() {
              const res = await fetch("/api/comments/getcomment", queryData1);
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
      
              const data = await res.json();
              
              // Add to a map a pairing of key value 'comment_id' to mapped parent comment'
              if(comments) {
                setParentComments(map => new Map(map?.set(comments[i].comment_id, data.comment)))
              }
  
            }

            async function getParentPost() {
              const res = await fetch("/api/posts/getpost", queryData2);
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
      
              const data = await res.json();
              
              // Add to a map a pairing of key value 'comment_id' to mapped parent comment'
              if(comments) {
                setParentPosts(map => new Map(map?.set(comments[i].comment_id, data.posts)))
              }
            }

            getParentComments();
            getParentPost();
          }
        }
      }
    }, [comments]);

    useEffect(() => {
      if(parentComments && parentComments.size > 0) {
        setLoading2(false);
      }
    }, [parentComments]);

    function expand(index: number) {
      setExpandInquiry((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = !newArray[index];
        return newArray;
      })
    }

    function approveComment(id: string) {
      // Create the same comment in the comments table.

      // Delete the comment in the unapproved comments table
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
                <div className={styles.inquiryContainer} key={comment.comment_id}>
                  <div className={styles.authorContainer}>
                    <span className={styles.author} key={comment.author_id}>{comment.author}</span>
                    <span className={styles.date} key={comment.comment_id}>{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <span className={styles.msg}>
                    {comment.cmt}
                  </span>
                  <span className={styles.msg}>
                    {comment.comment_id && parentComments && parentComments.size > 0 ? 
                    (
                      <span>In response to Comment: {parentComments.get(comment.comment_id)[0].cmt}</span>
                    ) : (
                      <></>
                    )}
                  </span>
                  <span className={styles.msg}>{parentPosts && parentPosts.size > 0 ? 
                    (
                      <span>In response to Post: {parentPosts.get(comment.comment_id)[0].post}</span>
                    ) : (
                      <></>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No more comments pending approval.</p>
          )}
        </div>
    </>
  )
}
