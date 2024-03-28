'use client'
import { useEffect, useState } from "react";
import styles from './page.module.css'

export default function Page() {
    return (
      <>
        <div className={styles.title}>Create a New Project</div>
          <hr/>
        <div className={styles.container}>
          <input
          className={styles.titleInput}
          type="text"
          placeholder="Project Name"/>
          <input
          className={styles.projectLeadInput}
          type="text"
          placeholder="Project Leader"/>
          <textarea
          className={styles.contentInput}
          placeholder="Project Description"/>
          <div 
          className={styles.galleryLabel}>
            Upload project thumbnail
          </div>
          <hr style={{gridColumn: 'span 2'}}/>
          <div 
          className={styles.galleryLabel}>
            Upload images to project gallery
          </div>
          <div></div>
          <hr style={{gridColumn: 'span 2'}}/>
          <button 
          className={styles.btn}>
            Create Project
          </button>
        </div>
      </>
    )
  }