'use client'
import { useEffect, useState, Fragment } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Dialog, Description, Transition, Button } from '@headlessui/react'
import { useInView } from 'react-intersection-observer';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import { Spinner } from '@/app/components/Spinner';

export default function Page() {
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [teamLeaders, setTeamLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // View More Modal
    const [modal, setModal] = useState<boolean[]>([]);
    // Inputs for Edits
    const [editing, setEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [about, setAbout] = useState<string>('');
    const [img, setImg] = useState<string>('');

    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const { ref, inView } = useInView();
    const limit = 20;


    useEffect(() => {
        const queryData = {
          method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              limit: limit,
              offset: (pagesLoaded * limit),
            })
        }
        async function getData() {
            try {
                const res = await fetch("/api/teamleaders/getteamleaders", queryData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.leaders)) {
                    throw new Error('Unexpected data format');
                }

                setTeamLeaders(data.leaders);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setPagesLoaded(pagesLoaded + 1);
            }
        }

        getData();
    }, [inView]);

    function openModal(index: number) {
      setModal((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = !newArray[index];
        return newArray;
        })
    }

    async function updateMember(id: string) {
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leader_id: id,
            leader_name: name,
            team_role: role,
            about_me: about,
            image_src: img
          })
      }

      const res = await fetch("/api/teamleaders/updateteamleader", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
    }

    async function deleteMember(id: string) {
      const queryData = {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leader_id: id,
          }),
      }

      const res = await fetch("/api/teamleaders/deleteteamleaders", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

    }

    function uploadImg(files: any) {
      setImg(files[0].link.replace('dl=0', 'raw=1'));
    }

    function toggleEditing(tname: string, trole: string, tabout: string, timg: string) {
      setName(tname);
      setRole(trole);
      setAbout(tabout);
      setImg(timg);
      setEditing(!editing);
    }

    return (
      <>
      <div className={styles.header}>Manage Team Members</div>
          <hr/>
      <div className={styles.container}> 
      {teamLeaders ? (
        teamLeaders.map((teamLeader, index) => (
          <>
            <div className={styles.subContainer}>
              <img className={styles.thumbnail} src={teamLeader.image_src}/>
              <div className={styles.title}>
                {teamLeader.leader_name}
              </div>
              <div className={styles.role}>
                {teamLeader.team_role}
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
                          Team Member: {teamLeader.leader_name}
                          Role: {teamLeader.team_role}
                          Thumbnail: <img className={styles.thumbnail} src={teamLeader.image_src}/>
                        </div>
                        ) : (
                            <></>
                        )}
                      </Dialog.Title>
                      <Description>
                        {!editing ? (
                          <div>Description: {teamLeader.about_me}</div>
                          ) : (
                          <div className={styles.container}>
                            <input
                            className={styles.titleInput}
                            type="text"
                            placeholder="Member Name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            type="text"
                            placeholder="Member Role"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required/>
                            <textarea
                            className={styles.contentInput}
                            placeholder="Description of Member"
                            id="about"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
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
                            teamLeader.leader_name, 
                            teamLeader.team_role, 
                            teamLeader.about_me, 
                            teamLeader.image_src)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.btn}
                          onClick={() => deleteMember(teamLeader.leader_id)}
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
                          onClick={() => updateMember(teamLeader.leader_id)}
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
        <span>No existing team members.</span>
      )} 
      </div>
      <div
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
        ref={ref}
      >
        <Spinner />
      </div>
      </>
    )
  }