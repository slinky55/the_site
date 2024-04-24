'use client'
import {Fragment, useEffect, useState} from 'react';
import styles from './page.module.css';
import {Description, Dialog, Transition} from '@headlessui/react'
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import {Project} from '@/app/types/project';
import {Spinner} from "@/app/components/Spinner";
import UpdateMessage from "@/app/components/UpdateMessage";
import DeleteMessage from "@/app/components/DeleteMessage";
import Image from 'next/image';
import { Sort } from '@/app/types/sort';
import SearchBar from '@/app/components/Searchbar';

interface Data {
  projects: Project[]
}

export default function Page() {
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;
    // View More Modal
    const [modal, setModal] = useState<boolean[]>([]);
    // Inputs for Edits
    const [editing, setEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [lead, setLead] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [gallery, setGallery] = useState<string>('');
    const [img, setImg] = useState<string>('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;
    const sort: Sort = {
      fieldName: 'title',
      direction: 'DESC'
    }

    const [deleteState, setDeleteState] = useState(false);
    const [updateState, setUpdateState] = useState(false);

    useEffect(() => {
        async function getData() {
          const projectData = {
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
            try {
                const res = await fetch("/api/projects/getprojects", projectData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.projects)) {
                    throw new Error('Unexpected data format');
                }

                setProjects(data.projects);
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
            sort: sort,
            filters: []
          })
      }
      async function getData() {
          try {
              const res = await fetch("/api/projects/getprojects", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();

              if (!Array.isArray(data.projects)) {
                  throw new Error('Unexpected data format');
              }

              setProjects(prevProjects => [...prevProjects, ...data.projects]);
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

  async function updateProject(id: string, index: number) {
    const queryData = {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: id,
          title: title,
          project_lead: lead,
          gallery: gallery,
          primary_image_src: img,
          content: content,
        })
    }

    const res = await fetch("/api/projects/updateproject", queryData)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    setUpdateState(true);
    setEditing(false);


      setTimeout(()  => {
        setUpdateState(false);
      }, 3000);

      const updatedProjectItem = {
        ...projects[index], // Keep other properties unchanged
        title: title,
        project_lead: lead,
        gallery: gallery,
        primary_image_src: img,
        content: content,
      };

      // Update project item in the projects array
      setProjects(prevProjects => {
        const updatedProjects = [...prevProjects];
        updatedProjects[index] = updatedProjectItem;
        return updatedProjects;
      });

      // Close the modal after updating
      setModal(prevModal => {
        const newArray = [...prevModal];
        newArray[index] = false;
        return newArray;
      });

    const data = await res.json();
  }

  async function deleteProject(id: string, index: number) {
    const queryData = {
      method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: id,
        }),
    }

    const res = await fetch("/api/projects/deleteproject", queryData)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    setDeleteState(true);

    setTimeout(()  => {
      setDeleteState(false);
    }, 3000);

    // Remove the project item at the specified index from the projects array
    setProjects(prevProjects => {
      const updatedProjects = [...prevProjects];
      updatedProjects.splice(index, 1);
      return updatedProjects;
    });

    openModal(index);
    const data = await res.json();

  }

  function uploadImg(files: any) {
    setImg(files[0].link.replace('dl=0', 'raw=1'));
  }

  function uploadImgs(files: any) {
    // Parse the string representation of the array into an actual array
    const galleryArray = JSON.parse(gallery);

    // Iterate over the files
    for(let i = 0; i < files.length; i++) {
      // Perform string manipulation to update the link
      const updatedLink = files[i].link.replace('dl=0', 'raw=1');
      // Push the updated link to the gallery array
      galleryArray.push(updatedLink);
    }

    // Convert the updated gallery array back to a string
    let updatedGalleryString = JSON.stringify(galleryArray);
    updatedGalleryString = updatedGalleryString.replace(/\\"/g, '"');
    // Set the updated gallery string using setGallery
    setGallery(updatedGalleryString);
  }

  function toggleEditing(ptitle: string, plead: string, pcontent: string, pimg: string, pgallery: string) {
    setTitle(ptitle);
    setLead(plead);
    setGallery(pgallery);
    setImg(pimg);
    setContent(pcontent);
    setEditing(!editing);
  }

  const handleDataReceived = (data: Data) => {
    setProjects(data.projects);
  };

    return (
      <>
      <div className={styles.header}>Manage Projects</div>
          <hr/>
        <SearchBar params={{ limit: 100, offset: 0, topics: false, type: 'projects', sort: sort }} onDataReceived={handleDataReceived}/>
      <div className={styles.container}> 
      {projects ? (
        projects.map((project, index) => (
          <>
            <div className={styles.subContainer}>
              <Image className={styles.thumbnail} src={project.primary_image_src} width={100} height={100} alt=""/>
              <div className={styles.title}>
                {project.title}
              </div>
              <div className={styles.lead}>
                {project.project_lead}
              </div>
              <button className={styles.btn} onClick={() => openModal(index)}>
                View More
              </button>
            </div>
            <Transition appear show={modal[index] ?? false} as={Fragment}>
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
                          Title: {project.title}
                          Project Leader: {project.project_lead}
                          Thumbnail: <Image className={styles.thumbnail} src={project.primary_image_src} width={500} height={500} alt=""/>
                        </div>
                        ) : (
                            <></>
                        )}
                      </Dialog.Title>
                      <Description>
                        {!editing ? (
                          <div>Description: {project.content}</div>
                          ) : (
                          <div className={styles.container}>
                            <input
                            className={styles.titleInput}
                            type="text"
                            placeholder="Member Name"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            type="text"
                            placeholder="Member Role"
                            id="lead"
                            value={lead}
                            onChange={(e) => setLead(e.target.value)}
                            required/>
                            <textarea
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            placeholder="Description of Member"
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required/>
                            <div
                            className={styles.galleryLabel}>
                              Upload New Thumbnail for Project Here
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
                            <DropboxChooser
                                appKey={appKey}
                                success={(files: any) => uploadImgs(files)}
                                cancel={() => console.log('Canceled')}
                                multiselect={true}
                                extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                            >
                                <button className={styles.dropboxUpload}>Upload to Gallery</button>
                            </DropboxChooser>
                            <hr style={{gridColumn: 'span 2'}}/>
                          </div>
                        )}
                      </Description>
                      {!editing ? (
                      <>
                        <button
                          className={styles.btn}
                          onClick={() => toggleEditing(
                            project.title,
                            project.project_lead,
                            project.content,
                            project.primary_image_src,
                            project.gallery)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.btn}
                          onClick={() => deleteProject(project.project_id, index)}
                        >
                          Delete
                        </button>
                      </>
                      ) : (
                      <>
                        <button
                          className={styles.btn}
                          onClick={() => setEditing(!editing)}
                        >
                          Cancel
                        </button>
                        <button
                          className={styles.btn}
                          onClick={() => updateProject(project.project_id, index)}
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
        <span>No existing projects.</span>
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
        <UpdateMessage update={updateState} message="Project successfully updated" />
      </div>
      <div className="absolute top-0">
        <DeleteMessage deleteMsg={deleteState} message="Project successfully deleted" />
      </div>
    </div>
      </>
    )
  }