'use client'
import { useEffect, useState, Fragment } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Dialog, Description, Transition } from '@headlessui/react';
import { Spinner } from '@/app/components/Spinner';
import { Research } from '@/app/types/research';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import { DatePicker } from '@mui/x-date-pickers';

export default function Page() {
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;
    const currentDate = new Date();

    const [research, setResearch] = useState<Research[]>([]);
    const [loading, setLoading] = useState(true);
    // View More Modal
    const [modal, setModal] = useState<boolean[]>([]);
    // Inputs for Edits
    const [editing, setEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [journal, setJournal] = useState<string>('');
    const [topics, setTopics] = useState<string>('');
    const [img, setImg] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [writtenOn, setWrittenOn] = useState<Date>();
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
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
                    throw new Error('Unexpected data format');
                }

                setResearch(data.research);
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
              const res = await fetch("/api/research/getresearchs", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();

              if (!Array.isArray(data.research)) {
                  throw new Error('Unexpected data format');
              }

              setResearch(prevResearch => [...prevResearch, ...data.research]);
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
        return newArray;
        })
    }

    async function updateResearch(id: string) {
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            research_id: id,
            title: title,
            journal: journal,
            topics: topics,
            thumbnail: img,
            written_on: writtenOn,
            url: url
          })
      }

      const res = await fetch("/api/research/updateresearch", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
    }

    async function deleteResearch(id: string) {
      const queryData = {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            research_id: id,
          }),
      }

      const res = await fetch("/api/research/deleteresearch", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

    }

    function uploadImg(files: any) {
      setImg(files[0].link.replace('dl=0', 'raw=1'));
    }

    function toggleEditing(rtitle: string, rjournal: string, rtopics: string, rimg: string, rurl: string, rwrittenOn: Date) {
      setTitle(rtitle);
      setJournal(rjournal);
      setUrl(rurl);
      setTopics(rtopics);
      setImg(rimg);
      setWrittenOn(rwrittenOn);
      setEditing(!editing);
      console.log(writtenOn)
      console.log(rwrittenOn)
    }

    return (
      <>
      <div className={styles.header}>Manage Research</div>
          <hr/>
      <div className={styles.container}> 
      {research ? (
        research.map((research, index) => (
          <>
            <div className={styles.subContainer}  key={research.research_id}>
              <img className={styles.thumbnail} src={research.thumbnail}/>
              <div className={styles.title}>
                {research.title}
              </div>
              <div className={styles.role}>
                {research.journal}
              </div>
              <button className={styles.btn} onClick={() => openModal(index)}>
                View More
              </button>
          </div>
          <Transition appear show={modal[index] ?? false} as={Fragment}  key={research.research_id}>
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
                          Title: {research.title}
                          Journal: {research.journal}
                          Thumbnail: <img className={styles.thumbnail} src={research.thumbnail}/>
                        </div>
                        ) : (
                            <></>
                        )}
                      </Dialog.Title>
                      <Description>
                        {!editing ? (
                          <div>
                            <div>URL: {research.url}</div>
                            <div>Topics: {research.topics}</div>
                          </div>
                          ) : (
                          <div className={styles.container}>
                            <input
                            className={styles.titleInput}
                            type="text"
                            placeholder="Research Title"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            type="text"
                            placeholder="Research Journal"
                            id="journal"
                            value={journal}
                            onChange={(e) => setJournal(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            placeholder="URL"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            placeholder="topics"
                            id="topics"
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            required/>
                            <DatePicker
                              label="Date that the article was written on"
                              
                              defaultValue={writtenOn}
                              value={writtenOn}
                              onChange={(e)=> setWrittenOn(e ? e : writtenOn)}
                             />
                            <div 
                            className={styles.galleryLabel}>
                              Upload New Thumbnail Here
                            </div>
                            <DropboxChooser
                              appKey={appKey}
                              success={(files: any) => uploadImg(files)}
                              cancel={() => console.log('Canceled')}
                              multiselect={false}
                              extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                            >
                              <button className={styles.dropboxUpload}>Upload</button>
                            </DropboxChooser>
                            <hr style={{gridColumn: 'span 2'}}/>
                          </div>
                        )}
                      </Description>
                      {!editing ? (
                      <>
                        <button
                          className={styles.btn}
                          key={research.research_id}
                          onClick={() => toggleEditing(
                            research.title, 
                            research.journal, 
                            research.topics, 
                            research.thumbnail,
                            research.url,
                            research.written_on)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.btn}
                          onClick={() => deleteResearch(research.research_id)}
                        >
                          Delete
                        </button>
                      </>
                      ) : (
                      <>
                        <button 
                          className={styles.btn}
                          key={research.research_id}
                          onClick={() => setEditing(!editing)}
                        >
                          Cancel
                        </button>
                        <button 
                          className={styles.btn}
                          key={research.research_id}
                          onClick={() => updateResearch(research.research_id)}
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
        <span>No existing research.</span>
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