'use client'
import { useEffect, useState, Fragment } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Dialog, Description, Transition, Button } from '@headlessui/react'
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import { Partner } from '@/app/types/partner';
import { Spinner } from "@/app/components/Spinner";
import UpdateMessage from "@/app/components/UpdateMessage";
import DeleteMessage from "@/app/components/DeleteMessage";
import Image from 'next/image';

export default function Page() {
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    // View More Modal
    const [modal, setModal] = useState<boolean[]>([]);
    // Inputs for Edits
    const [editing, setEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [pf, setPf] = useState<string>('');
    const [img, setImg] = useState<string>('');

    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;

    const [deleteState, setDeleteState] = useState(false);
    const [updateState, setUpdateState] = useState(false);

    useEffect(() => {
      const partnersData = {
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
                const res = await fetch("/api/partners/getpartners", partnersData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.partners)) {
                    throw new Error('Unexpected data format');
                }

                setPartners(data.partners);
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
              const res = await fetch("/api/partners/getpartners", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();

              if (!Array.isArray(data.partners)) {
                  throw new Error('Unexpected data format');
              }

              setPartners(prevPartners => [...prevPartners, ...data.partners]);
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

    async function updatePartner(id: string, index: number) {
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            partner_id: id,
            name: name,
            logo: img,
            website_link: url,
            partnership_formed: pf,
            description: desc,
            image_src: img
          })
      }

      const res = await fetch("/api/partners/updatepartner", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setUpdateState(true);

      setTimeout(()  => {
        setUpdateState(false);
      }, 3000);

      const updatedPartnerItem = {
        ...partners[index], // Keep other properties unchanged
        name: name,
        logo: img,
        website_link: url,
        partnership_formed: pf,
        description: desc
      };
      
      setPartners(prevPartners => {
        const updatedPartners = [...prevPartners];
        updatedPartners[index] = updatedPartnerItem;
        return updatedPartners;
      });
      
      // Close the modal after updating
      setModal(prevModal => {
        const newArray = [...prevModal];
        newArray[index] = false;
        return newArray;
      });      

      const data = await res.json();
    }

    async function deletePartner(id: string, index: number) {
      const queryData = {
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            partner_id: id,
          }),
      }

      const res = await fetch("/api/partners/deletepartner", queryData)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setTimeout(()  => {
        setDeleteState(false);
      }, 3000);

      setPartners(prevPartners => {
        const updatedPartners = [...prevPartners];
        updatedPartners.splice(index, 1); // Remove the partner item at the specified index
        return updatedPartners;
      });
      

      const data = await res.json();

    }

    function uploadImg(files: any) {
      setImg(files[0].link.replace('dl=0', 'raw=1'));
    }

    function toggleEditing(pname: string, pUrl: string, pdesc: string, ppf: string, pimg: string) {
      setName(pname);
      setUrl(pUrl);
      setDesc(pdesc);
      setImg(pimg);
      setPf(ppf);
      setEditing(!editing);
    }

    return (
      <>
      <div className={styles.header}>Manage Partners</div>
          <hr/>
      <div className={styles.container}> 
      {partners ? (
        partners.map((partner, index) => (
          <>
            <div className={styles.subContainer} key={index}>
              <Image className={styles.thumbnail} src={partner.logo} width={500} height={500} alt=""/>
              <div className={styles.title}>
                {partner.name}
              </div>
              <div className={styles.lead}>
                {partner.website_link}
              </div>
              <div className={styles.lead}>
                {partner.partnership_formed}
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
                          Partner: {partner.name}
                          URL: {partner.website_link}
                          Partner Since: {partner.partnership_formed}
                          Logo: <Image className={styles.thumbnail} src={partner.logo} width={500} height={500} alt=""/>
                        </div>
                        ) : (
                            <></>
                        )}
                      </Dialog.Title>
                      <Description>
                        {!editing ? (
                          <div>Description: {partner.description}</div>
                          ) : (
                          <div className={styles.container}>
                            <input
                            className={styles.titleInput}
                            type="text"
                            placeholder="Partner Name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>
                            <input
                            className={styles.projectLeadInput}
                            type="text"
                            placeholder="Partner URL"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required/>
                            <textarea
                            className={styles.contentInput}
                            placeholder="Description of Partner"
                            id="desc"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            required/>
                            <div 
                            className={styles.galleryLabel}>
                              Upload New Logo of Partner Here
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
                            partner.name, 
                            partner.website_link, 
                            partner.description, 
                            partner.partnership_formed,
                            partner.logo)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.btn}
                          onClick={() => deletePartner(partner.partner_id, index)}
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
                          onClick={() => updatePartner(partner.partner_id, index)}
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
        <span>No existing partners.</span>
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
        <UpdateMessage update={updateState} message="Partner successfully updated" />
      </div>
      <div className="absolute top-0">
        <DeleteMessage deleteMsg={deleteState} message="Partner successfully deleted" />
      </div>
    </div>
      </>
    )
  }