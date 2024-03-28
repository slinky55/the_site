"use client"

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from './page.module.css'

export default function AdminLayout({
  children,
  events,
  projects,
  feedback,
  comments,
  newblog
}: {
  children: React.ReactNode;
  events: React.ReactNode;
  projects: React.ReactNode;
  feedback: React.ReactNode;
  comments: React.ReactNode;
  newblog: React.ReactNode;
}) {

  const [display, setDisplay] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className={styles.layoutContainer}>
        {open ? (
          <div className={styles.layoutSidebar}>
            <div className={styles.menuBtn} onClick={()=> setOpen(!open)}>
              <FontAwesomeIcon className={styles.menuIcon} icon={faBars}/>
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(0)}>
              Events
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(1)}>
              Projects
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(2)}>
              Feedback
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(3)}>
              Comments
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(4)}>
              New Blog Post
            </div>
          </div>
        ) : (
          <div className={`${open && styles.layoutSidebar} ${!open && styles.minimized}`}>
            <div className={styles.menuBtn} onClick={()=> setOpen(!open)}>
              <FontAwesomeIcon className={styles.menuIcon} icon={faBars}/>
            </div>
          </div>
        )
        }

        <div className={styles.layoutContent}>
          {children}
          {(display == 0) && events}
          {(display == 1) && projects}
          {(display == 2) && feedback}
          {(display == 3) && comments}
          {/* {(display == 4) && newblog}  */}
        </div>
      </div>
    </>
  )
}