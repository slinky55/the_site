'use client'
import { useEffect, useState, Fragment } from 'react';
import styles from './page.module.css';
import { Dialog, Description, Transition, } from '@headlessui/react'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { Event } from '@/app/types/event';
import { Spinner } from "@/app/components/Spinner";

export default function Page() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

     // View More Modal
     const [modal, setModal] = useState<boolean[]>([]);
     // Inputs for Edits
     const [editing, setEditing] = useState<boolean>(false);
     const [name, setName] = useState<string>('');
     const [url, setUrl] = useState<string>('');
     const [content, setContent] = useState<string>('');
     const [start, setStart] = useState<Date>(new Date());
     const [end, setEnd] = useState<Date>(new Date());

    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;

    const [deleteState, setDeleteState] = useState(false);
    const [updateState, setUpdateState] = useState(false);

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

    function openModal(index: number) {
      setModal((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = !newArray[index];
        if (!newArray[index]) {
          setEditing(false);
        }
        return newArray;
        })
    }

    async function updateResearch(id: string, index: number) {
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: id,
            name: name,
            reg_link: url,
            content: content,
            event_start: start,
            event_end: end
          })
      }

      const res = await fetch("/api/event/updateevent", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setUpdateState(true);

      setTimeout(()  => {
        setUpdateState(false);
      }, 3000);

      const data = await res.json();

      const updatedEventItem = {
        ...events[index], // Keep other properties unchanged
        event_id: id,
        name: name,
        reg_link: url,
        content: content,
        event_start: start,
        event_end: end
      };
      
      setEvents(prevEvent => {
        const updatedEvent = [...prevEvent];
        updatedEvent[index] = updatedEventItem;
        return updatedEvent;
      });
      
      // Close the modal after updating
      setModal(prevModal => {
        const newArray = [...prevModal];
        newArray[index] = false;
        return newArray;
      });
    }  

    async function deleteEvent(id: string, index: number) {
      const queryData = {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: id,
          }),
      }

      const res = await fetch("/api/event/deleteevent", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setDeleteState(true);

      setTimeout(()  => {
        setDeleteState(false);
      }, 3000);

      setEvents(prevEvent => {
        const updatedEvent = [...prevEvent];
        updatedEvent.splice(index, 1); // Remove the research item at the specified index
        return updatedEvent;
      });
      

      const data = await res.json();

    }

    function toggleEditing(ename: string, eurl: string, econtent: string, estart: Date, eend: Date) {
      setName(ename);
      setUrl(eurl);
      setContent(econtent);
      setStart(estart);
      setEnd(eend);
      setEditing(!editing);
      console.log(estart, eend);
    }

    return (
      <>
      <div className={styles.header}>Manage Events</div>
          <hr/>
      <div className={styles.container}> 
      {events ? (
        events.map((event, index) => (
          <>
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
            <button className={styles.btn} onClick={() => openModal(index)}>
              View More
            </button>
        </div>
        <Transition appear show={modal[index] ?? false} as={Fragment}  key={event.event_id}>
          <Dialog
            as="div" className="relative z-10"
            onClose={() => openModal(index)} 
            open={modal[index] ?? false}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {!editing ? (
                          <div>
                          Name: {event.name}
                        </div>
                        ) : (
                            <></>
                        )}
                      </Dialog.Title>
                      <Description>
                        {!editing ? (
                          <div>
                            <div>Registration Link: {event.reg_link}</div>
                            <div>Description: {event.content}</div>
                          </div>
                          ) : (
                          <div className={styles.container}>
                            <input
                            className={styles.titleInput}
                            type="text"
                            placeholder="Event Name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            placeholder="Registration URL"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            placeholder="Event Description"
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required/>
                            <DesktopDateTimePicker
                              label="Date and time that the event starts at"
                              
                              defaultValue={start}
                              value={start}
                              onChange={(e)=> setStart(e ? e : start)}
                             />
                             <DesktopDateTimePicker
                              label="Date and time that the event ends at"
                              
                              defaultValue={end}
                              value={end}
                              onChange={(e)=> setEnd(e ? e : end)}
                             />
                            <hr style={{gridColumn: 'span 2'}}/>
                          </div>
                        )}
                      </Description>
                      {!editing ? (
                      <>
                        <button
                          className={styles.btn}
                          key={event.event_id}
                          onClick={() => toggleEditing(
                            event.name, 
                            event.reg_link, 
                            event.content, 
                            event.event_start,
                            event.event_end)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.btn}
                          onClick={() => deleteEvent(event.event_id, index)}
                        >
                          Delete
                        </button>
                      </>
                      ) : (
                      <>
                        <button 
                          className={styles.btn}
                          key={event.event_id}
                          onClick={() => setEditing(!editing)}
                        >
                          Cancel
                        </button>
                        <button 
                          className={styles.btn}
                          key={event.event_id}
                          onClick={() => updateResearch(event.event_id, index)}
                        >
                          Update
                        </button>
                      </>
                      )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
          </Dialog>
        </Transition>
        </>
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