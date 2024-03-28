'use client'
import { useEffect, useState } from "react";
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import styles from './page.module.css'

export default function Page() {
    return (
      <>
        <div className={styles.title}>Create a New Event</div>
          <hr/>
        <div className={styles.container}>
          <input
          className={styles.nameInput}
          type="text"
          placeholder="Event Name"/>
          <input
          className={styles.urlInput}
          type="url"
          placeholder="Registration URL"/>
          <textarea
          className={styles.contentInput}
          placeholder="Event Description"/>
          <hr style={{gridColumn: 'span 2'}}/>
          <div 
          className={styles.eventLabel}>
            Select Event Start Date & Time
          </div>
          <div 
          className={styles.eventLabel}>
            Select Event End Date & Time
          </div>
          <DesktopDateTimePicker />
          <DesktopDateTimePicker />
          <button 
          className={styles.btn}>
            Create Event
          </button>
        </div>
      </>
    )
  }