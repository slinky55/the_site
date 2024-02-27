"use client"

import { useState } from "react";
import { Header } from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from './page.module.css'

export default function AdminLayout({
  children,
  feedback,
  comments,
  newblog
}: {
  children: React.ReactNode;
  feedback: React.ReactNode;
  comments: React.ReactNode;
  newblog: React.ReactNode;
}) {

  const [display, setDisplay] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Header/>
      <div className={styles.layoutContainer}>
        {open ? (
          <div className={styles.layoutSidebar}>
            <div className={styles.menuBtn} onClick={()=> setOpen(!open)}>
              <FontAwesomeIcon className={styles.menuIcon} icon={faBars}/>
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(0)}>
              Feedback
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(1)}>
              Comments
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(2)}>
              New Blog Post
            </div>
          </div>
        ) : (
          <div className={styles.menuBtn} onClick={()=> setOpen(!open)}>
            <FontAwesomeIcon className={styles.menuIcon} icon={faBars}/>
          </div>
        )
        }

        <div className={styles.layoutContent}>
          {children}
          {(display == 0) && feedback}
          {(display == 1) && comments}
          {(display == 2) && newblog} 
        </div>
      </div>
    </>
  )
}