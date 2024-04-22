'use client'
import styles from './page.module.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Research } from '@/app/types/research';

export default function ResearchLibraryPage() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    const queryData = {
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
        const res = await fetch("/api/research/getresearchs", queryData);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        if (!Array.isArray(data.research)) {
          console.log("Data is ", data);
          throw new Error('Unexpected data format');
        }

        setResearch(data.research);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  return (
    <div className={styles.container}>
      <div id="functionalBody">
        <div id={styles.redBoxArea}>
          <input id={styles.inputSearch} />
        </div>

        <div style={{ display: 'flex' }}>
          <div id={styles.verticalSection}>
            <span className={styles.subsection}>Sort by date ↓</span>
            <span className={styles.subsection}><hr className={styles.hrStyle}></hr></span>
            <span className={styles.subsection}>Topics</span>
            <span className={styles.subsection}><hr className={styles.hrStyle}></hr></span>
            <span className={styles.subsection}>AI</span>
            <span className={styles.subsection}><hr className={styles.hrStyle}></hr></span>
            <span className={styles.subsection}>Health</span>
            <span className={styles.subsection}><hr className={styles.hrStyle}></hr></span>
            <span className={styles.subsection}>Medicine</span>
            <span className={styles.subsection}><hr className={styles.hrStyle}></hr></span>
            <span className={styles.subsection}>Research</span>
            <span className={styles.subsection}><hr className={styles.hrStyle}></hr></span>
            <span className={styles.subsection}>Hospital</span>
            <span className={styles.subsection}><hr className={styles.hrStyle}></hr></span>
            <span className={styles.subsection}>New Discoveries</span>
          </div>
        <div id={styles.horizontalSection} className={styles.horizontalSection}>
          <div id={styles.whiteDisplayArea}>
            {research.map((researchItem, index) => (
              <div key={researchItem.research_id} className={styles.whiteDisplaySubsection}>
                <Image src={"/book.png"} width="50" height="50" style={{ marginRight: '35px' }} alt="This is a book icon" />
                <div className={styles.textContainer}>
                  <span style={{ color: 'grey', width: '100%' }}><span>Article</span></span>
                  <span style={{ color: 'red', width: '100%' }}>{researchItem.title}</span>
                  <span style={{ width: '100%' }}>{researchItem.journal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
