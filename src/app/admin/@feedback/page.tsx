'use client'
import { useEffect, useState } from "react";
import styles from '../page.module.css'
import { Inquiry } from '../../types/inquiry'
import { Spinner } from "@/app/components/Spinner";
import { Sort } from "@/app/types/sort";
import SearchBar from "@/app/components/Searchbar";

interface Data {
  inquiries: Inquiry[]
}

export default function Page() {
    // Get Inquiries
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Expand Inquiry based on index
    const [expandInquiry, setExpandInquiry] = useState<boolean[]>([]);
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;
    const sort: Sort = {
      fieldName: 'created_at',
      direction: 'DESC'
    }

      useEffect(() => {
        const InquiryData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: limit,
            offset: 0,
            sort: sort,
            filters: []
          })
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
          } finally {
              setPagesLoaded(1);
              setLoading(false);
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
              sort: sort,
              filters: []
            })
        }
        async function getData() {
            try {
                const res = await fetch("/api/inquiries/getinquiries", queryData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.inquiries)) {
                    throw new Error('Unexpected data format');
                }

                setInquiries(prevInquiries => [...prevInquiries, ...data.inquiries]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setPagesLoaded(pagesLoaded + 1);
            }
      }

      getData();
    }

      function expand(index: number) {
        setExpandInquiry((prevArray) => {
          const newArray = [...prevArray];
          newArray[index] = !newArray[index];
          return newArray;
        })
      }

      const handleDataReceived = (data: Data) => {
        setInquiries(data.inquiries);
    };


    return (
      <div>
        <SearchBar params={{ limit: 100, offset: 0, topics: false, type: 'inquiries', sort: sort }} onDataReceived={handleDataReceived}/>
          <p className={styles.title} key={2}>Contact Us Forms</p>
          <hr/>
          {inquiries ? (
            <div className={styles.inquiriesContainer} key={1}>
              {inquiries?.map((inquiry, index) => (
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