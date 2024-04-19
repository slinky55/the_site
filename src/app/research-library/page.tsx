import React from 'react';
import styles from './page.module.css';
import Image from 'next/image';

export default function ResearchLibraryPage() {
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
              <span className={styles.whiteDisplaySubsection}>
                <Image src={"/book.png"} width="50" height="50" style={{ marginRight: '35px' }} alt="This is a book icon" />
                <div className={styles.textContainer}>
                  <span style={{ color: 'grey', width: '100%' }}><span>Article</span></span>
                  <span style={{ color: 'red', width: '100%' }}>How AI Can be used in the World of Modern Medicine</span>
                  <span style={{ width: '100%' }}>Society of AI Medicine</span>
                  <span style={{ width: '100%' }}>2016</span>
                </div>
              </span>
              <span className={styles.whiteDisplaySubsection}>
                <Image src={"/book.png"} width="50" height="50" style={{ marginRight: '35px' }} alt="This is a book icon" />
                <div className={styles.textContainer}>
                  <span style={{ color: 'grey', width: '100%' }}><span>Article</span></span>
                  <span style={{ color: 'red', width: '100%' }}>How AI Can be used in the World of Modern Medicine</span>
                  <span style={{ width: '100%' }}>Society of AI Medicine</span>
                  <span style={{ width: '100%' }}>2016</span>
                </div>
              </span>
              <span className={styles.whiteDisplaySubsection}>
                <Image src={"/book.png"} width="50" height="50" style={{ marginRight: '35px' }} alt="This is a book icon" />
                <div className={styles.textContainer}>
                  <span style={{ color: 'grey', width: '100%' }}><span>Article</span></span>
                  <span style={{ color: 'red', width: '100%' }}>How AI Can be used in the World of Modern Medicine</span>
                  <span style={{ width: '100%' }}>Society of AI Medicine</span>
                  <span style={{ width: '100%' }}>2016</span>
                </div>
              </span>
              <span className={styles.whiteDisplaySubsection}>
                <Image src={"/book.png"} width="50" height="50" style={{ marginRight: '35px' }} alt="This is a book icon" />
                <div className={styles.textContainer}>
                  <span style={{ color: 'grey', width: '100%' }}><span>Article</span></span>
                  <span style={{ color: 'red', width: '100%' }}>How AI Can be used in the World of Modern Medicine</span>
                  <span style={{ width: '100%' }}>Society of AI Medicine</span>
                  <span style={{ width: '100%' }}>2016</span>
                </div>
              </span>
              <span className={styles.whiteDisplaySubsection}>
                <Image src={"/book.png"} width="50" height="50" style={{ marginRight: '35px' }} alt="This is a book icon" />
                <div className={styles.textContainer}>
                  <span style={{ color: 'grey', width: '100%' }}><span>Article</span></span>
                  <span style={{ color: 'red', width: '100%' }}>How AI Can be used in the World of Modern Medicine</span>
                  <span style={{ width: '100%' }}>Society of AI Medicine</span>
                  <span style={{ width: '100%' }}>2016</span>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
