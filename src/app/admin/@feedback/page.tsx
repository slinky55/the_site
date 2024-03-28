'use client'
import { useEffect, useState } from "react";
import styles from '../page.module.css'
import { Inquiry } from '../../types/inquiry'

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
                <div className={styles.inquiryContainer} key={inquiry.inquiry_id}>
                  <div className={styles.authorContainer} onClick={() => expand(index)}>
                    <span className={styles.author} key={inquiry.inquiry_id}>{inquiry.first_name} {inquiry.last_name}</span>
                    {expandInquiry[index] ? (
                      <>
                        <span className={styles.email} key={inquiry.inquiry_id}>{inquiry.email}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.subj1} key={inquiry.inquiry_id}>Subject: {inquiry.subj}</span>
                      </>
                    )}
                    <span className={styles.date} key={inquiry.inquiry_id}>{new Date(inquiry.created_at).toLocaleString()}</span>
                  </div>
                  {expandInquiry[index] ? (
                    <>
                      <span className={styles.subjContainer}><span className={styles.subjTitle}>Subject:</span><span className={styles.subj} key={inquiry.inquiry_id}>{inquiry.subj}</span></span>
                      <span className={styles.msg} key={inquiry.inquiry_id}>{inquiry.content}</span>
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