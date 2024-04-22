'use client'
import {useState} from "react";
import {DesktopDateTimePicker} from '@mui/x-date-pickers/DesktopDateTimePicker';
import styles from './page.module.css'
import {v4 as uuidv4} from 'uuid';
import SuccessMessage from "@/app/components/SuccessMessage";

export default function Page() {
    const currentDate = new Date();
    const [name, setName] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [start, setStart] = useState<Date>(currentDate);
    const [end, setEnd] = useState<Date>(currentDate);

    const [success, setSuccess] = useState(false);


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

      try {
        await fetch('/api/events/createevent', postData);
        setSuccess(true);

        setTimeout(()  => {
          setSuccess(false);
        }, 3000);

        } catch(error) {
            console.error('Error:', error);
        }
  }

    return (
      <>
        <div className={styles.title}>Create a New Event</div>
          <hr/>
        <div className={styles.container}>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Event Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required/>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="url"
          placeholder="Registration URL"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}/>
          <textarea
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
          <SuccessMessage success={success} message="Event Successfully Created" />
        </div>
      </>
    )
  }