'use client'
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Event } from '@/app/types/event';

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch("/api/events/getevents");

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.events)) {
                    throw new Error('Unexpected data format');
                }

                setEvents(data.events);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, []);
    return (
      <>
      <div className={styles.header}>Manage Events</div>
          <hr/>
      <div className={styles.container}> 
      {events ? (
        events.map((event, key) => (
          <div className={styles.subContainer} key="key">
            <div className={styles.name}>
              {event.name}
            </div>
            <div className={styles.link}>
              {event.reg_link}
            </div>
            <div className={styles.date}>
              {new Date(event.event_start).toLocaleString()}
            </div>
            <div className={styles.date}>
              {new Date(event.event_end).toLocaleString()}
            </div>
            <button className={styles.btn}>
              View More
            </button>
        </div>
      ))) : (
        <span>No existing events.</span>
      )} 
      </div>
      </>
    )
  }