'use client'
import { useEffect, useState } from "react";
import styles from '../page.module.css'

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

export default function Page() {
    // Get Inquiries
    const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Expand Inquiry based on index
    const [expandInquiry, setExpandInquiry] = useState<boolean[]>([]);

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

  
            setInquiries(data.inquiries);
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

      function expand(index: number) {
        setExpandInquiry((prevArray) => {
          const newArray = [...prevArray];
          newArray[index] = !newArray[index];
          return newArray;
        })
      }


    return (
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
    );
  }