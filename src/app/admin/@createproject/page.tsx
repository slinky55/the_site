'use client'
import {useState} from "react";
import {v4 as uuidv4} from 'uuid';
import styles from './page.module.css';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import SuccessMessage from "@/app/components/SuccessMessage";

export default function Page() {
    const [img, setImg] = useState<string>('')
    const [uploaded, setUploaded] = useState<Boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [projectLead, setProjectLead] = useState<string>('')
    const [gallery, setGallery] = useState<string[]>([])
    const [content, setContent] = useState<string>('')
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [success, setSuccess] = useState(false);
    const [imgName, setImgName] = useState<string>('');
    const [galleryNames, setGalleryNames] = useState<string[]>([]);

    async function createProject() {
      const postData = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
              project_id: uuidv4(),
              title: title,
              project_lead: projectLead,
              primary_image_src: img,
              gallery: gallery,
              content: content
          }),
      }

      try {
        await fetch('/api/projects/createproject', postData);
        setSuccess(true);
        setImg('');
        setUploaded(false);
        setTitle('');
        setProjectLead('');
        setGallery([]);
        setContent('');

        setTimeout(()  => {
          setSuccess(false);
        }, 3000);

        } catch(error) {
            console.error('Error:', error);
        }
  }

    function uploadImg(files: any) {
      setImg(files[0].link.replace('dl=0', 'raw=1'));
      setImgName(files[0].name); // Save the name of the file
      setUploaded(true);
    }

    function uploadImgs(files: any) {
      const newGalleryNames: string[] = [];
      for(let i = 0; i < files.length; i++) {
        const updatedLink = files[i].link.replace('dl=0', 'raw=1');
        setGallery(prevGallery => [...prevGallery, updatedLink]);
        newGalleryNames.push(files[i].name); // Save the names of the files
      }
      setGalleryNames(newGalleryNames);
    }


    return (
      <>
        <div className={styles.title}>Create a New Project</div>
          <hr/>
        <div className={styles.container}>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Project Name"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required/>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Project Leader"
          id="projectLead"
          value={projectLead}
          onChange={(e) => setProjectLead(e.target.value)}
          required/>
          <textarea
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          placeholder="Project Description"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required/>
          <div
          className={styles.galleryLabel}>
            Upload project thumbnail
          </div>
          <DropboxChooser
            appKey={appKey}
            success={(files: any) => uploadImg(files)}
            cancel={() => console.log('Canceled')}
            multiselect={false}
            extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
          >
            <button                           className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >Upload Thumbnail</button>
          </DropboxChooser>
          <div>Thumbnail: {imgName}</div>
          <hr style={{gridColumn: 'span 2'}}/>
          <div
          className={styles.galleryLabel}>
            Upload images to project gallery
          </div>
          <DropboxChooser
              appKey={appKey}
              success={(files: any) => uploadImgs(files)}
              cancel={() => console.log('Canceled')}
              multiselect={true}
              extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
          >
              <button                           className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >Upload to Gallery</button>
          </DropboxChooser>
          <div>Gallery: {galleryNames.join(', ')}</div>
          <div></div>
          <hr style={{gridColumn: 'span 2'}}/>
          <button
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled={!uploaded}
          onClick={createProject}>
            Create Project
          </button>
        </div>
        <center><SuccessMessage success={success} message="Project Successfully Uploaded" /></center>
      </>
    )
  }