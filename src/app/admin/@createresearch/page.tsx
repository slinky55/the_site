'use client'
import {useState} from "react";
import {DesktopDateTimePicker} from '@mui/x-date-pickers/DesktopDateTimePicker';
import styles from './page.module.css'
import {v4 as uuidv4} from 'uuid';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import SuccessMessage from "@/app/components/SuccessMessage";

export default function Page() {
    const currentDate = new Date();
    const [title, setTitle] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [journal, setJournal] = useState<string>('');
    const [topics, setTopics] = useState<string>('');
    const [writtenOn, setWrittenOn] = useState<Date>(currentDate);
    const [img, setImg] = useState<string>('');
    const [uploaded, setUploaded] = useState<Boolean>(false)
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [success, setSuccess] = useState(false);


    async function createResearch() {
      const postData = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
              event_id: uuidv4(),
              title: title,
              journal: journal,
              url: url,
              written_on: writtenOn,
              topics: topics,
              thumbnail: img
          }),
      }

      try {
        await fetch('/api/research/createresearch', postData);
        setSuccess(true);

        setTimeout(()  => {
          setSuccess(false);
        }, 3000);

        } catch(error) {
            console.error('Error:', error);
        }
  }

  function uploadImg(files: any) {
    setImg(files[0].link.replace('dl=0', 'raw=1'));
    setUploaded(true);
  }

    return (
      <>
        <div className={styles.title}>Create New Research</div>
          <hr/>
        <div className={styles.container}>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Research Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required/>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Research Journal"
          id="journal"
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          required/>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="url"
          placeholder="Registration URL"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}/>
          <textarea
          className={styles.contentInput}
          placeholder="Research Topics"
          id="topics"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          required/>
          <hr style={{gridColumn: 'span 2'}}/>
          <DropboxChooser
            appKey={appKey}
            success={(files: any) => uploadImg(files)}
            cancel={() => console.log('Canceled')}
            multiselect={false}
            extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
          >
            <button className={styles.dropboxUpload}>Upload Thumbnail</button>
          </DropboxChooser>
          <div
          className={styles.eventLabel}>
            Select when the research article was written.
          </div>
          <DesktopDateTimePicker
          value={writtenOn}
          onChange={(e)=> setWrittenOn(e ? e : currentDate)}/>
          <button
          className={styles.btn}
          disabled={!uploaded}
          onClick={createResearch}>
            Create Research
          </button>
          <SuccessMessage success={success} message="Research Successfully Uploaded" />
        </div>
      </>
    )
  }