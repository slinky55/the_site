'use client'
import { useEffect, useState, Fragment } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Dialog, Description, Transition } from '@headlessui/react'
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import { Post } from '@/app/types/post';
import { Spinner } from '@/app/components/Spinner';
import Image from 'next/image';
import SearchBar from '@/app/components/Searchbar';
import { Sort } from '@/app/types/sort';

interface Data {
  posts: Post[]
}

export default function Page() {
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    // View More Modal
    const [modal, setModal] = useState<boolean[]>([]);
    // Inputs for Edits
    const [editing, setEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [topics, setTopics] = useState<string>('');
    const [img, setImg] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;
    const sort: Sort = {
      fieldName: 'created_at',
      direction: 'DESC'
    }

    useEffect(() => {
        const postData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: limit,
            offset: 0,
            filters: []
          })
        }
        async function getData() {
            try {
                const res = await fetch("/api/posts/getposts", postData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.posts)) {
                    throw new Error('Unexpected data format');
                }

                setPosts(data.posts);
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
    }, [posts])

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
              filters: []
            })
        }
        async function getData() {
            try {
                const res = await fetch("/api/posts/getposts", queryData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.posts)) {
                    throw new Error('Unexpected data format');
                }

                setPosts(prevPosts => [...prevPosts, ...data.posts]);
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

    async function updatePost(id: string) {
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: id,
            title: title,
            topics: topics,
            content: content,
            image_src: img
          })
      }

      const res = await fetch("/api/posts/updatepost", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
    }

    async function deletePost(id: string) {
      const queryData = {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: id,
          }),
      }

      const res = await fetch("/api/posts/deletepost", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

    }

    function uploadImg(files: any) {
      setImg(files[0].link.replace('dl=0', 'raw=1'));
    }

    function toggleEditing(ptitle: string, ptopics: string, pcontent: string, pimg: string) {
      setTitle(ptitle);
      setTopics(ptopics);
      setContent(pcontent);
      setImg(pimg);
      setEditing(!editing);
    }

    const handleDataReceived = (data: Data) => {
      setPosts(data.posts);
  };

    return (
      <>
        <div className={styles.header}>Manage Posts</div>
          <hr/>
          <SearchBar params={{ limit: 100, offset: 0, topics: true, type: 'posts', sort: sort }} onDataReceived={handleDataReceived}/>
      <div className={styles.container}> 
      {loading ? (<></>) : posts ? (
        posts.map((post, index) => (
          <>
            <div className={styles.subContainer} key={index}>
              <Image className={styles.thumbnail} src={post.image_src} width={500} height={500} alt=""/>
              <div className={styles.title}>
                {post.title}
              </div>
              <div className={styles.user}>
                {post.user_id}
              </div>
              <div className={styles.date}>
                  {new Date(post.created_at).toLocaleString()}
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
                          Title: {post.title}
                          Thumbnail: <Image className={styles.thumbnail} src={post.image_src} width={500} height={500} alt=""/>
                        </div>
                        ) : (
                            <></>
                        )}
                      </Dialog.Title>
                      <Description>
                        {!editing ? (
                          <div>Post Content: <div dangerouslySetInnerHTML={{ __html: post.content}}></div></div>
                          ) : (
                          <div className={styles.container}>
                            <input
                            className={styles.titleInput}
                            type="text"
                            placeholder="Post Title"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            type="text"
                            placeholder="Post Topics"
                            id="topics"
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            required/>
                            <textarea
                            className={styles.contentInput}
                            placeholder="Post Content (To be changed to quill...)"
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required/>
                            <div 
                            className={styles.galleryLabel}>
                              Upload New Picture of Member Here
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
                          onClick={() => toggleEditing(
                            post.title, 
                            post.topics, 
                            post.content, 
                            post.image_src)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.btn}
                          onClick={() => deletePost(post.post_id)}
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
                          onClick={() => updatePost(post.post_id)}
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
        <span>No existing posts.</span>
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