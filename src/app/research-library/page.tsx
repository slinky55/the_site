import React from 'react'
import styles from './page.module.css';

export default function ResearchLibraryPage() {
  return (
    <>
      <div id={styles.functionalBody}>
        <div style={{width: "100vw", height: "20vh", display: "flex", color: "white", backgroundColor: "red", justifyContent: "center", alignItems: "center"}}>
          <input id={styles.inputSearch}>
          </input>
        </div>

        <div style={{display: "flex"}}>
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

          <div id={styles.horizontalSection}>

          </div>
        </div>

      </div>
    </>
  )
}