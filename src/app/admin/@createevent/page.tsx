'use client'
import { useEffect, useState } from "react";
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import styles from './page.module.css'
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
    const currentDate = new Date();
    const [name, setName] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [start, setStart] = useState<Date>(currentDate);
    const [end, setEnd] = useState<Date>(currentDate);
    

    async function createEvent() {
      const postData = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
              event_id: uuidv4(),
              name: name,
              content: content,
              reg_link: url,
              event_start: start,
              event_end: end
          }),
      }

      await fetch('/api/events/createevent', postData);
  }
  
    return (
      <>
        <div className={styles.title}>Create a New Event</div>
          <hr/>
        <div className={styles.container}>
          <input
          className={styles.nameInput}
          type="text"
          placeholder="Event Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required/>
          <input
          className={styles.urlInput}
          type="url"
          placeholder="Registration URL"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}/>
          <textarea
          className={styles.contentInput}
          placeholder="Event Description"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required/>
          <hr style={{gridColumn: 'span 2'}}/>
          <div 
          className={styles.eventLabel}>
            Select Event Start Date & Time
          </div>
          <div 
          className={styles.eventLabel}>
            Select Event End Date & Time
          </div>
          <DesktopDateTimePicker 
          value={start}
          onChange={(e)=> setStart(e ? e : currentDate)}/>
          <DesktopDateTimePicker 
          value={end}
          onChange={(e)=> setEnd(e ? e : currentDate)}/>
          <button 
          className={styles.btn}
          onClick={createEvent}>
            Create Event
          </button>
        </div>
      </>
    )
  }