'use client'
import { useEffect, useState, Fragment } from 'react';
import styles from './page.module.css';
import { Dialog, Description, Transition, } from '@headlessui/react'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import { Event } from '@/app/types/event';
import { Spinner } from "@/app/components/Spinner";

export default function Page() {
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

     // View More Modal
     const [modal, setModal] = useState<boolean[]>([]);
     // Inputs for Edits
     const [editing, setEditing] = useState<boolean>(false);
     const [name, setName] = useState<string>('');
     const [role, setRole] = useState<string>('');
     const [about, setAbout] = useState<string>('');
     const [img, setImg] = useState<string>('');

    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;

    useEffect(() => {
      const eventData = {
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
                const res = await fetch("/api/events/getevents", eventData);

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
                setPagesLoaded(1);
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
          })
      }
      async function getData() {
          try {
              const res = await fetch("/api/events/getevents", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();

              if (!Array.isArray(data.events)) {
                  throw new Error('Unexpected data format');
              }

              setEvents(prevEvents => [...prevEvents, ...data.events]);
          } catch (error) {
              console.error(error);
          } finally {
              setLoading(false);
              setPagesLoaded(pagesLoaded + 1);
          }
    }

    getData();
  }

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
      <div
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
      >
        {!loading ? (
          <button onClick={loadMore}>Load more items...</button>
        ) : (
          <Spinner />
        )}
      </div>
      </>
    )
  }