'use client'
import {Fragment, useEffect, useState} from 'react';
import styles from '../@manageprojects/page.module.css';
import {Description, Dialog, Transition} from '@headlessui/react'
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

import UpdateMessage from "@/app/components/UpdateMessage";
import DeleteMessage from "@/app/components/DeleteMessage";

export default function Page() {
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    // View More Modal
    const [modal, setModal] = useState<boolean[]>([]);
    const [editing, setEditing] = useState<boolean>(false);
    // Inputs for Edits
    const [priv, setPriv] = useState<string>();


    async function getData() {
        try {
            const res = await fetch("/api/users/getall");

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data.users)) {
                throw new Error('Unexpected data format');
            }

            setUsers(data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function updateUser(priv: string, id: string) {
        try {
            await fetch("/api/users/update", {
                method: "POST",
                body: JSON.stringify({
                    privilegeLevel: priv,
                    id: id,
                })
            })
        } catch (error) {
            console.error(error)
        }

        getData();
    }

    useEffect(() => {
        getData()
    }, [])

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

    return (
      <>
        <div className={styles.header}>Manage Posts</div>
          <hr/>
      <div className={styles.container}> 
      {loading ? (<></>) : users ? (
          users.map((user, index) => (
          <>
            <div className={styles.subContainer} key={index}>
              <div className={styles.title}>
                {user.name}
              </div>
              <div className={styles.user}>
                {user.email}
              </div>
              <div className={styles.date}>
                  {user.privilegeLevel}
              </div>
              <button className={styles.btn} onClick={() => openModal(index)}>
                Manage
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
                        Manage User { user.name }
                      </Dialog.Title>
                      <Description>
                        <form>
                            <select onChange={(e) => {setPriv(e.target.value)}} defaultValue={"admin"}>
                                <option value={"admin"}>Admin</option>
                                <option value={"default"}>Default</option>
                            </select>
                            <button className={styles.btn} type={"button"} onClick={() => {updateUser(priv!, user.id)}}>Update</button>
                        </form>
                          <hr />
                          <button className={styles.btn} onClick={() => {}}>
                              Delete
                          </button>
                      </Description>
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
      </>
    )
  }