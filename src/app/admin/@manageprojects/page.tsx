'use client'
import { useEffect, useState, Fragment } from 'react';
import styles from './page.module.css';
import { Dialog, Description, Transition, Button } from '@headlessui/react'
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import { Project } from '@/app/types/project';
import { Spinner } from "@/app/components/Spinner";

import Image from "next/image";

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
      return newArray;
      })
  }

  async function updateProject(id: string) {
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

    const data = await res.json();
  }

  async function deleteProject(id: string) {
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

    return (
      <>
      <div className={styles.header}>Manage Projects</div>
          <hr/>
      <div className={styles.container}> 
      {projects ? (
        projects.map((project, index) => (
          <>
            <div className={styles.subContainer}>
              <img className={styles.thumbnail} src={project.primary_image_src}/>
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
                          Thumbnail: <img className={styles.thumbnail} src={project.primary_image_src}/>
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
                            className={styles.contentInput}
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
                          onClick={() => deleteProject(project.project_id)}
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
                          onClick={() => updateProject(project.project_id)}
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
      </>
    )
  }