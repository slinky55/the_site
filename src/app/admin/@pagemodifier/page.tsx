'use client'
import {v4 as uuidv4} from 'uuid';
import {Div} from '@/app/types/div';
import {useEffect, useState} from 'react';
import styles from './page.module.css';
import homestyles from '../../page.module.css';
import aboutstyles from '../../about-us/page.module.css';
import SuccessMessage from "@/app/components/SuccessMessage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCancel } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import Image from 'next/image';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

type editState = {
  [key: string]: boolean[];
};

export default function Page() {
    /* Loading Images and Divs from DB */
    const [divs, setDivs] = useState<Div[]>([]);
    const [images,setImages] = useState<any[]>([]);
    const [loadingImg, setLoadingImg] = useState(true);
    const [loadingDiv, setLoadingDiv] = useState(true);
    const [imgPagesLoaded, setImgPagesLoaded] = useState<number>(0);
    const [divPagesLoaded, setDivPagesLoaded] = useState<number>(0);
    const limit = 100;

    /* Adding Images and Divs to DB */
    const [img, setImg] = useState<string>('');
    const [imgLabel, setImgLabel] = useState<string>('');
    const [divText, setDivText] = useState<string>('');
    const [divLabel, setDivLabel] = useState<string>('');
    const [uploaded, setUploaded] = useState<Boolean>(false);
    const [uploaded2, setUploaded2] = useState<Boolean>(false);
    const [success, setSuccess] = useState(false);
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [content, setContent] = useState<string>('');
    const [openEdit, setOpenEdit] = useState<editState>(
        {
          ['home']:[false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
          ['about']:[false],
          ['blog']:[false],
          ['contact']:[false],
          ['partners']:[false],
          ['projects']:[false],
          ['researchlib']:[false]
        })

    /* Page dropdown logic */
    const [page, setPage] = useState('home');

    const handlePageChange = (e: any) => {
      setPage(e.target.value);
    };

    // Helper function to capitalize the first letter of a string
    const capitalize = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

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
    console.log(openEdit)
  }, [openEdit])

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

    function uploadImg2(files: any, index: number) {
      setContent(files[0].link.replace('dl=0', 'raw=1'));
      setUploaded2(true);
    }

    function getItem(l: string, img: boolean) {
      if(img) {
        for(let i = 0; i < images.length; i++) {
          if(images[i].label===l) {
            return images[i]
          }
        }
      }
      else {
        for(let i = 0; i < divs.length; i++) {
          if(divs[i].label===l) {
            return divs[i]
          }
        }
      }
    }

    async function updateItem(l: string, img: boolean) {
      const item = getItem(l, img);
      if(img) {
        const imgData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            img_id: item.img_id,
            url: content,
            label: item.label,
            page: page
          })
        }
        try {
          const res = await fetch("/api/images/updateimage", imgData);

          if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
          }

        } catch (error) {
            console.error(error);
        }
      }
      else {
        const divData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            div_id: item.div_id,
            content: content,
            label: item.label,
            page: page
          })
        }

        try {
          const res = await fetch("/api/divs/updatediv", divData);

          if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
          }

        } catch (error) {
            console.error(error);
        }
      }
    }

    return (
      <div className={styles.container}>
        <h1 className='ml-2 mr-2'>Current Page: {capitalize(page)}</h1>
        
        <select className='ml-2 mr-2' value={page} onChange={handlePageChange}>
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="blog">Blog</option>
          <option value="contact">Contact</option>
          <option value="partners">Partners</option>
          <option value="projects">Projects</option>
          <option value="researchlib">Research Library</option>
        </select>
        {(page === 'home') && (
        <main className='m-2'>
          
          <div className="text-center">
            <div className="font-bold mb-4">Images contained in the slideshow:</div>
            <div className='grid gap-2'>
              <Image src={getItem('Slideshow1', true)?.url} alt="" width={600} height={600} />
              {!openEdit['home'][0] && (
                <button className='ml-2' onClick={() => {
                  setOpenEdit(prevState => ({
                    ...prevState,
                    home: prevState.home.map((value, index) => index === 0 ? !value : value)
                  }));
                  
                }} ><FontAwesomeIcon icon={faEdit as any} /></button>
              )}
              {openEdit['home'][0] && (
                <div className='flex'>
                  <DropboxChooser
                    appKey={appKey}
                    success={(files: any) => uploadImg2(files, 0)}
                    cancel={() => console.log('Canceled')}
                    multiselect={false}
                    extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                  >
                  <button
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      <div className="flex items-center">
                          Upload Image
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                              className="w-5 h-5">
                              <path
                                  d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                              <path
                                  d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                          </svg>
                      </div>
                    </button>
                  </DropboxChooser>
                  <div className='flex'>
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Slideshow1', true)}>Confirm Changes</button>
                    <button className='ml-2' onClick={() => {
                      setOpenEdit(prevState => ({
                        ...prevState,
                        home: prevState.home.map((value, index) => index === 0 ? !value : value)
                      }));
                      
                      }} >
                        <FontAwesomeIcon icon={faCancel as any} />
                    </button>
                  </div>
                </div>
              )}
              <Image src={getItem('Slideshow2', true)?.url} alt="" width={600} height={600} />
              {!openEdit['home'][1] && (
                <button className='ml-2' onClick={() => {
                  setOpenEdit(prevState => ({
                    ...prevState,
                    home: prevState.home.map((value, index) => index === 1 ? !value : value)
                  }));
                  
                }} ><FontAwesomeIcon icon={faEdit as any} /></button>
              )}
              {openEdit['home'][1] && (
                <div className='flex'>
                  <DropboxChooser
                    appKey={appKey}
                    success={(files: any) => uploadImg2(files, 1)}
                    cancel={() => console.log('Canceled')}
                    multiselect={false}
                    extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                  >
                    <button
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <div className="flex items-center">
                            Upload Image
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                className="w-5 h-5">
                                <path
                                    d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                                <path
                                    d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                            </svg>
                        </div>
                      </button>
                  </DropboxChooser>
                  <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Slideshow2', true)}>Confirm Changes</button>
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 1 ? !value : value)
                    }));
                    }} >
                      <FontAwesomeIcon icon={faCancel as any} />
                  </button>
                </div>
              )}
              <Image src={getItem('Slideshow3', true)?.url} alt="" width={600} height={600} />
              {!openEdit['home'][2] && (
                <button className='ml-2' onClick={() => {
                  setOpenEdit(prevState => ({
                    ...prevState,
                    home: prevState.home.map((value, index) => index === 2 ? !value : value)
                  }));
                  
                }} ><FontAwesomeIcon icon={faEdit as any} /></button>
              )}
              {openEdit['home'][2] && (
                <div className='flex'>
                  <DropboxChooser
                    appKey={appKey}
                    success={(files: any) => uploadImg2(files, 2)}
                    cancel={() => console.log('Canceled')}
                    multiselect={false}
                    extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                  >
                      <button
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          <div className="flex items-center">
                              Upload Image
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                  className="w-5 h-5">
                                  <path
                                      d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                                  <path
                                      d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                              </svg>
                          </div>
                      </button>
                  </DropboxChooser>
                  <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Slideshow3', true)}>Confirm Changes</button>
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 2 ? !value : value)
                    }));
                    
                    }} >
                      <FontAwesomeIcon icon={faCancel as any} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={homestyles.smallDivide} style={{ height: '5px', backgroundColor: '#e40000' }}></div>

          <div className={homestyles.whoWeAre}>
            <div className={homestyles.whoWeAreSummary}>
              <center>
                <h1 className={homestyles.whoWeAreHeader} style={{ color: '#e40000', paddingTop: '20px', paddingBottom: '0px', marginBottom: '0' }}>Who We Are</h1>
                <Image src={getItem('WhoWeAre', true)?.url} style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: '20px'}} alt="" width={600} height={500}/>

                {!openEdit['home'][12] && (
                <button className='ml-2' onClick={() => {
                  setOpenEdit(prevState => ({
                    ...prevState,
                    home: prevState.home.map((value, index) => index === 12 ? !value : value)
                  }));
                  
                }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                )}
                {openEdit['home'][12] && (
                  <div className='flex'>
                    <DropboxChooser
                      appKey={appKey}
                      success={(files: any) => uploadImg2(files, 12)}
                      cancel={() => console.log('Canceled')}
                      multiselect={false}
                      extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                    >
                        <button
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <div className="flex items-center">
                                Upload Image
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                    className="w-5 h-5">
                                    <path
                                        d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                                    <path
                                        d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                                </svg>
                            </div>
                        </button>
                    </DropboxChooser>
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('WhoWeAre', true)}>Confirm Changes</button>
                    <button className='ml-2' onClick={() => {
                      setOpenEdit(prevState => ({
                        ...prevState,
                        home: prevState.home.map((value, index) => index === 12 ? !value : value)
                      }));
                      
                      }} >
                        <FontAwesomeIcon icon={faCancel as any} />
                    </button>
                  </div>
                )}

              </center>
              <p className={homestyles.whoWeAreParagraph}>
                {getItem('WhoWeAre1', false)?.content}
                {!openEdit['home'][4] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 4 ? !value : value)
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('WhoWeAre1', false)}>Confirm Changes</button>
                    <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 4 ? !value : value)
                    }));
                    }} >
                      <FontAwesomeIcon icon={faCancel as any} />
                  </button>
                  </div>
                )}
                </p>
              <p className={homestyles.whoWeAreParagraph}>
                {getItem('WhoWeAre2', false)?.content}
                {!openEdit['home'][5] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 5 ? !value : value)
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('WhoWeAre2', false)}>Confirm Changes</button>
                    <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 5 ? !value : value)
                    }));
                    }} >
                      <FontAwesomeIcon icon={faCancel as any} />
                  </button>
                  </div>
                )}
                </p>
            </div>
          </div>

          <div className={homestyles.separator}></div>

          <div className={homestyles.theSpotlightAdmin} style={{backgroundImage: `url('${getItem('bg', true)?.url}')`}}>
            <center><h2 style={{ color: '#fff', paddingTop: '40px', paddingBottom: '10px', fontSize: 'xx-large' }}>T.H.E Spotlight</h2></center>
            <div className={homestyles.spotlightContainer}>
              <div className={homestyles.spotlightItem}>
                <div className={homestyles.image}>
                  <Image src={getItem('Spotlight1', true)?.url} alt="" width={500} height={500}/>
                  {!openEdit['home'][6] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 6 ? !value : value)
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <div className='flex'>
                      <DropboxChooser
                        appKey={appKey}
                        success={(files: any) => uploadImg2(files, 6)}
                        cancel={() => console.log('Canceled')}
                        multiselect={false}
                        extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                      >
                      <button
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          <div className="flex items-center">
                              Upload Image
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                  className="w-5 h-5">
                                  <path
                                      d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                                  <path
                                      d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                              </svg>
                          </div>
                        </button>
                      </DropboxChooser>
                      <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Spotlight1', true)}>Confirm Changes</button>
                      <button className='ml-2' onClick={() => {
                        setOpenEdit(prevState => ({
                          ...prevState,
                          home: prevState.home.map((value, index) => index === 6 ? !value : value)
                        }));
                        }} >
                          <FontAwesomeIcon icon={faCancel as any} />
                      </button>
                    </div>
                  </div>
                )}
                  <div className={homestyles.content}>
                    <p>
                      {getItem('Spotlight1', false)?.content}
                      {!openEdit['home'][7] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 7 ? !value : value)
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <div>
                      <textarea
                        className="w-full h-40 border border-red-500 rounded-md p-2  text-black focus:outline-none focus:border-red-700"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Enter your content here..."
                      />
                      <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Spotlight1', false)}>Confirm Changes</button>
                      <button className='ml-2' onClick={() => {
                        setOpenEdit(prevState => ({
                          ...prevState,
                          home: prevState.home.map((value, index) => index === 7 ? !value : value)
                        }));
                        }} >
                          <FontAwesomeIcon icon={faCancel as any} />
                      </button>
                    </div>
                  </div>
                )}
                    </p>
                  </div>
                </div>
              </div>
              <div className={homestyles.spotlightItem}>
                <div className={homestyles.image}>
                  <Image src={getItem('Spotlight2', true)?.url} alt="" width={500} height={500} />
                  {!openEdit['home'][8] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 8 ? !value : value)
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <div className='flex'>
                      <DropboxChooser
                        appKey={appKey}
                        success={(files: any) => uploadImg2(files, 8)}
                        cancel={() => console.log('Canceled')}
                        multiselect={false}
                        extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                      >
                      <button
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          <div className="flex items-center">
                              Upload Image
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                  className="w-5 h-5">
                                  <path
                                      d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                                  <path
                                      d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                              </svg>
                          </div>
                        </button>
                      </DropboxChooser>
                      <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Spotlight2', true)}>Confirm Changes</button>
                      <button className='ml-2' onClick={() => {
                        setOpenEdit(prevState => ({
                          ...prevState,
                          home: prevState.home.map((value, index) => index === 8 ? !value : value)
                        }));
                        }} >
                          <FontAwesomeIcon icon={faCancel as any} />
                      </button>
                    </div>
                  </div>
                )}
                  <div className={homestyles.content}>
                    <p>
                      {getItem('Spotlight2', false)?.content}
                      {!openEdit['home'][9] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 9 ? !value : value)
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2  text-black focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Spotlight2', false)}>Confirm Changes</button>
                    <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 9 ? !value : value)
                    }));
                    }} >
                      <FontAwesomeIcon icon={faCancel as any} />
                  </button>
                  </div>
                )}
                    </p>
                  </div>
                </div>
              </div>
              <div className={homestyles.spotlightItem}>
                <div className={homestyles.image}>
                  <Image src={getItem('Spotlight3', true)?.url} alt="" width={500} height={500} />
                  {!openEdit['home'][10] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 10 ? !value : value)
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <div className='flex'>
                      <DropboxChooser
                        appKey={appKey}
                        success={(files: any) => uploadImg2(files, 10)}
                        cancel={() => console.log('Canceled')}
                        multiselect={false}
                        extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                      >
                      <button
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          <div className="flex items-center">
                              Upload Image
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                  className="w-5 h-5">
                                  <path
                                      d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                                  <path
                                      d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                              </svg>
                          </div>
                        </button>
                      </DropboxChooser>
                      <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Spotlight3', true)}>Confirm Changes</button>
                      <button className='ml-2' onClick={() => {
                        setOpenEdit(prevState => ({
                          ...prevState,
                          home: prevState.home.map((value, index) => index === 10 ? !value : value)
                        }));
                        }} >
                          <FontAwesomeIcon icon={faCancel as any} />
                      </button>
                    </div>
                  </div>
                )}
                  <div className={homestyles.content}>
                    <p>
                      {getItem('Spotlight3', false)?.content}
                      {!openEdit['home'][11] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 11 ? !value : value)
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 text-black focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('Spotlight3', false)}>Confirm Changes</button>
                    <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      home: prevState.home.map((value, index) => index === 11 ? !value : value)
                    }));
                    }} >
                      <FontAwesomeIcon icon={faCancel as any} />
                  </button>
                  </div>
                )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        )}

        {(page === 'about') && (
          <div className='m-2'>
            <div className={aboutstyles.container1}>
              <div className={aboutstyles.whoWeAre}>
                <h2 className={aboutstyles.aboutUsHeading}>Who We Are</h2>
                  <p className={aboutstyles.aboutUs}>
                    {getItem('WhoWeAre', false)?.content}
                    {!openEdit['about'][0] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      about: [!prevState.about[0]]
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('intro', false)}>Confirm Changes</button>
                  </div>
                )}
                  </p>
              </div>
            </div>
          </div>
        )}

        {(page ==='blog') && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
                {getItem('intro', false)?.content}
                {!openEdit['blog'][0] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      blog: [!prevState.blog[0]]
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('intro', false)}>Confirm Changes</button>
                  </div>
                )}
            </p>
          </div>
        )}
        {(page ==='contact') && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              {(getItem('intro', false) as Div)?.content}
              {!openEdit['contact'][0] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      contact: [!prevState.contact[0]]
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('intro', false)}>Confirm Changes</button>
                  </div>
                )}
            </p>
          </div>
        )}
        {(page ==='partners') && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Partners</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
                {getItem('intro',false)?.content}
                {!openEdit['partners'][0] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      partners: [!prevState.partners[0]]
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('intro', false)}>Confirm Changes</button>
                  </div>
                )}
            </p>
          </div>
        )}
        {(page === 'projects') && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Projects</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
                {getItem('intro',false)?.content}
                {!openEdit['projects'][0] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      projects: [!prevState.projects[0]]
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('intro', false)}>Confirm Changes</button>
                  </div>
                )}
            </p>
          </div>
        )}
        {(page === 'researchlib') && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Research Library</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              {getItem('intro',false)?.content}
              {!openEdit['researchlib'][0] ? (
                  <button className='ml-2' onClick={() => {
                    setOpenEdit(prevState => ({
                      ...prevState,
                      researchlib: [!prevState.researchlib[0]]
                    }));
                  }} ><FontAwesomeIcon icon={faEdit as any} /></button>
                ) : (
                  <div>
                    <textarea
                      className="w-full h-40 border border-red-500 rounded-md p-2 focus:outline-none focus:border-red-700"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Enter your content here..."
                    />
                    <button className='ml-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={() => updateItem('intro', false)}>Confirm Changes</button>
                  </div>
                )}
            </p>
          </div>
        )}

        <div className={styles.createContainer}>
          <div className={styles.imgCreateContainer}>
            <div className={styles.title}>
              Create Image
            </div>
            <hr className={styles.hr}/>
            <input
                className="ml-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
              <button
                          className="ml-2 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          <div className="flex items-center">
                              Upload Image
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                  className="w-5 h-5">
                                  <path
                                      d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                                  <path
                                      d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                              </svg>
                          </div>
                        </button>
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
                className=" m-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              placeholder="Text Label"
              type="text"
              id="label"
              value={divLabel}
              onChange={(e) => setDivLabel(e.target.value)}
              required
            />
            <textarea
                className="m-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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