'use client'
import { useEffect, useState, Fragment } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Dialog, Description, Transition } from '@headlessui/react';
import { Spinner } from '@/app/components/Spinner';
import { Research } from '@/app/types/research';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import { DatePicker } from '@mui/x-date-pickers';
import UpdateMessage from "@/app/components/UpdateMessage";
import DeleteMessage from "@/app/components/DeleteMessage";
import Image from 'next/image';
import { Sort } from '@/app/types/sort';
import SearchBar from '@/app/components/Searchbar';

interface Data {
  research: Research[]
}


export default function Page() {
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

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
    const [writtenOn, setWrittenOn] = useState<Date>(new Date());

    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;
    const sort: Sort = {
      fieldName: 'title',
      direction: 'DESC'
    }

    const [deleteState, setDeleteState] = useState(false);
    const [updateState, setUpdateState] = useState(false);


    useEffect(() => {
        const queryData = {
          method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              limit: limit,
              offset: 0,
              sort: sort,
              filters: []
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

    useEffect(() => {
      setLoading(false);
    }, [research])

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
            sort: sort, 
            filters: []
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

      setUpdateState(true);
      setEditing(false);

      setTimeout(()  => {
        setUpdateState(false);
      }, 3000);

      const data = await res.json();

      const updatedResearchItem = {
        ...research[index], // Keep other properties unchanged
        title: title,
        journal: journal,
        topics: topics,
        thumbnail: img,
        written_on: writtenOn,
        url: url
      };
      
      setResearch(prevResearch => {
        const updatedResearch = [...prevResearch];
        updatedResearch[index] = (updatedResearchItem as any);
        return updatedResearch;
      });
      
      // Close the modal after updating
      setModal(prevModal => {
        const newArray = [...prevModal];
        newArray[index] = false;
        return newArray;
      });
    }  

    async function deleteResearch(id: string, index: number) {
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

      setDeleteState(true);

      setTimeout(()  => {
        setDeleteState(false);
      }, 3000);

      setResearch(prevResearch => {
        const updatedResearch = [...prevResearch];
        updatedResearch.splice(index, 1); // Remove the research item at the specified index
        return updatedResearch;
      });
      

      openModal(index);
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

    const handleDataReceived = (data: Data) => {
      setResearch(data.research);
  };
  

    return (
      <>
      <div className={styles.header}>Manage Research</div>
          <hr/>
          <SearchBar params={{ limit: 100, offset: 0, topics: true, type: 'research', sort: sort }} onDataReceived={handleDataReceived}/>
      <div className={styles.container}> 
      {research ? (
        research.map((research, index) => (
          <>
            <div className={styles.subContainer}  key={research.research_id}>
              <Image className={styles.thumbnail} src={research.thumbnail} width={500} height={500} alt=""/>
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
                          Thumbnail: <Image className={styles.thumbnail} src={research.thumbnail} width={500} height={500} alt=""/>
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
                            research.topics as any,
                            research.thumbnail,
                            research.url,
                            research.written_on)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.btn}
                          onClick={() => deleteResearch(research.research_id, index)}
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
                          onClick={() => updateResearch(research.research_id, index)}
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
      <div className="w-full relative mb-15 flex justify-center">
      <div className="absolute top-0">
        <UpdateMessage update={updateState} message="Research successfully updated" />
      </div>
      <div className="absolute top-0">
        <DeleteMessage deleteMsg={deleteState} message="Research successfully deleted" />
      </div>
    </div>
      </>
    )
  }