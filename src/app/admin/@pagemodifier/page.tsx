'use client'
import { v4 as uuidv4 } from 'uuid';
import { Div } from '@/app/types/div';
import { useState, useEffect } from 'react';
import { Spinner } from '@/app/components/Spinner';
import styles from './page.module.css';
import SuccessMessage from "@/app/components/SuccessMessage";
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import Image from 'next/image';


export default function Page() {
    /* Loading Images and Divs from DB */
    const [divs, setDivs] = useState<Div[]>([]);
    const [images,setImages] = useState<any[]>([]);
    const [loadingImg, setLoadingImg] = useState(true);
    const [loadingDiv, setLoadingDiv] = useState(true);
    const [imgPagesLoaded, setImgPagesLoaded] = useState<number>(0);
    const [divPagesLoaded, setDivPagesLoaded] = useState<number>(0);
    const limit = 10;

    /* Adding Images and Divs to DB */
    const [img, setImg] = useState<string>('');
    const [imgLabel, setImgLabel] = useState<string>('');
    const [divText, setDivText] = useState<string>('');
    const [divLabel, setDivLabel] = useState<string>('');
    const [uploaded, setUploaded] = useState<Boolean>(false);
    const [success, setSuccess] = useState(false);
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    /* Page dropdown logic */
    const [page, setPage] = useState('home');

    const handlePageChange = (e: any) => {
      setPage(e.target.value);
    };

    // Helper function to capitalize the first letter of a string
    const capitalize = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    

    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
    
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
    
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
    
      ['clean']                                         // remove formatting button
    ];

    useEffect(() => {
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: page,
            limit: limit,
            offset: 0,
          })
      }
      async function getImgData() {
          try {
              const res = await fetch("/api/images/getimages", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();

              if (!Array.isArray(data.images)) {
                  throw new Error('Unexpected data format');
              }

              setImages(data.images);
          } catch (error) {
              console.error(error);
          } finally {
              setLoadingImg(false);
              setImgPagesLoaded(1);
          }
      }
      async function getDivData() {
        try {
            const res = await fetch("/api/divs/getdivs", queryData);

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data.divs)) {
                throw new Error('Unexpected data format');
            }

            setDivs(data.divs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDiv(false);
            setDivPagesLoaded(1);
        }
    }

      getImgData();
      getDivData();
  }, [page]);

  useEffect(() => {
    console.log(divs);
  }, [divs])

    async function loadMoreImg() {
      setLoadingImg(true);
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: page,
            limit: limit,
            offset: (imgPagesLoaded * limit) - 1,
          })
      }
      async function getData() {
          try {
              const res = await fetch("/api/images/getimages", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();

              if (!Array.isArray(data.images)) {
                  throw new Error('Unexpected data format');
              }

              setImages(prevImages => [...prevImages || [], ...data.images]);
          } catch (error) {
              console.error(error);
          } finally {
              setLoadingImg(false);
              setImgPagesLoaded(imgPagesLoaded + 1);
          }
      }

      getData();
    }

    async function loadMoreDiv() {
      setLoadingDiv(true);
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: page,
            limit: limit,
            offset: (divPagesLoaded * limit) - 1,
          })
      }
      async function getData() {
          try {
              const res = await fetch("/api/divs/getdivs", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();

              if (!Array.isArray(data.divs)) {
                  throw new Error('Unexpected data format');
              }

              setDivs(prevDivs => [...prevDivs, ...data.divs]);
          } catch (error) {
              console.error(error);
          } finally {
              setLoadingDiv(false);
              setDivPagesLoaded(divPagesLoaded + 1);
          }
      }

      getData();
    }

    async function createImg() {
      const postData = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
              img_id: uuidv4(),
              url: img,
              label: imgLabel,
              page: page
          }),
      }

      try {
          await fetch('/api/images/createimage', postData);
          setSuccess(true);
  
          setTimeout(()  => {
            setSuccess(false);
          }, 3000);
          
          } catch(error) {
              console.error('Error:', error);
          }
    }

    async function createDiv() {
      const postData = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
              div_id: uuidv4(),
              content: divText,
              label: divLabel,
              page: page
          }),
      }

      try {
          await fetch('/api/divs/creatediv', postData);
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
      <div className={styles.container}>
        <h1>Current Page: {capitalize(page)}</h1>
        <select value={page} onChange={handlePageChange}>
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="blog">Blog</option>
          <option value="contact">Contact</option>
          {/* <option value="newsevents">News & Events</option> */}
          <option value="partners">Partners</option>
          <option value="projects">Projects</option>
          <option value="researchlib">Research Library</option>
        </select>
        <div className={styles.manageContainer}>
          <div className={styles.imgContainer}>
            <div className={styles.title}>
              Manage Existing Images
            </div>
            <hr className={styles.hr}/>
            {
              images ? (
                images.map((img) => (
                  <>
                    <div>
                      <Image className={styles.thumbnail} src={img.url} alt="" width={800} height={800}/>
                      <div className={styles.labelName}>{img.label}</div>
                    </div>
                  </>
                ))
              ) : (
                <div>No images to load</div>
              )
            }
            <div
              className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
            >
              {!loadingImg ? (
                <button onClick={loadMoreImg}>Load more images...</button>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
          <div className={styles.divContainer}>
            <div className={styles.title}>
              Manage Existing Textboxes
            </div>
            <hr className={styles.hr}/>
            {
              divs ? (
                divs.map((div) => (
                  <>
                    <div>
                      <div className={styles.divContent}>{div.content}</div>
                      <div className={styles.labelName}>{div.label}</div>
                    </div>
                  </>
                ))
              ) : (
                <div>No images to load</div>
              )
            }
            <div
            className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
            >
              {!loadingDiv ? (
                <button onClick={loadMoreDiv}>Load more textboxes...</button>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </div>
        <div className={styles.createContainer}>
          <div className={styles.imgCreateContainer}>
            <div className={styles.title}>
              Create Image
            </div>
            <hr className={styles.hr}/>
            <input
              className={styles.newLabel}
              placeholder="Image Label"
              type="text"
              id="label"
              value={imgLabel}
              onChange={(e) => setImgLabel(e.target.value)}
              required
            />
            <DropboxChooser
              appKey={appKey}
              success={(files: any) => uploadImg(files)}
              cancel={() => console.log('Canceled')}
              multiselect={false}
              extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
            >
              <button className={styles.dropboxUpload}>Upload Image</button>
            </DropboxChooser>
            <button 
              className={styles.btn} 
              onClick={createImg}
              disabled={!uploaded}
            >
              Create Image
            </button>
            <SuccessMessage success={success} message="Image Successfully Added to the DB" />
          </div>
          <div className={styles.divCreateContainer}>
            <div className={styles.title}>
              Create Textbox
            </div>
            <hr className={styles.hr}/>
            <input
              className={styles.newLabel}
              placeholder="Text Label"
              type="text"
              id="label"
              value={divLabel}
              onChange={(e) => setDivLabel(e.target.value)}
              required
            />
            <textarea
              className={styles.newDivContent}
              placeholder="Write text content here."
              id="label"
              value={divText}
              onChange={(e) => setDivText(e.target.value)}
              required
            />
            <button 
              className={styles.btn} 
              onClick={createDiv}
            >
              Create Textbox
            </button>
            <SuccessMessage success={success} message="Textbox Successfully Added to the DB" />
          </div>
        </div>
      </div>
    );
  }