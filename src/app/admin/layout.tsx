"use client"

import { useState } from "react";
import { Header } from "../components/Header";
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

  return (
    <>
      <Header/>
      <div className={styles.layoutContainer}>
        <div className={styles.layoutSidebar}>
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