"use client"

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from './page.module.css'
import { ClassNames } from "@emotion/react";

export default function AdminLayout({
  children,
  createteam,
  manageteam,
  createpartner,
  managepartner,
  createevent,
  manageevents,
  createproject,
  manageprojects,
  commentapproval,
  managecomments,
  createpost,
  manageposts,
  feedback
}: {
  children: React.ReactNode;
  createteam: React.ReactNode;
  manageteam: React.ReactNode;
  createpartner: React.ReactNode;
  managepartner: React.ReactNode;
  createevent: React.ReactNode;
  manageevents: React.ReactNode;
  createproject: React.ReactNode;
  manageprojects: React.ReactNode;
  commentapproval: React.ReactNode;
  managecomments: React.ReactNode;
  createpost: React.ReactNode;
  manageposts: React.ReactNode;
  feedback: React.ReactNode;
}) {

  const [display, setDisplay] = useState<number>(12);
  const [submenu, setSubmenu] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);

  function toggleSubmenu(num: number) {
    if(submenu == num) {
      setSubmenu(10);
    }
    else {
      setSubmenu(num);
    }
  }

  return (
    <>
      <div className={styles.layoutContainer}>
        {open ? (
          <div className={styles.layoutSidebar}>
            <div className={styles.menuBtn} onClick={()=> setOpen(!open)}>
              <FontAwesomeIcon className={styles.menuIcon} icon={faBars}/>
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => toggleSubmenu(0)}>
              Team Members
              {submenu == 0 && (
                <div className={styles.submenu}>
                  <div className={styles.submenuItem} onClick={() => setDisplay(0)}>Create Team Members</div>
                  <div className={styles.submenuItem} onClick={() => setDisplay(1)}>Manage Team Members</div>
                </div>
              )}
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => toggleSubmenu(1)}>
              Partners
              {submenu == 1 && (
                <div className={styles.submenu}>
                  <div className={styles.submenuItem} onClick={() => setDisplay(2)}>Create Partners</div>
                  <div className={styles.submenuItem} onClick={() => setDisplay(3)}>Manage Partners</div>
                </div>
              )}
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => toggleSubmenu(2)}>
              Events
              {submenu == 2 && (
                <div className={styles.submenu}>
                  <div className={styles.submenuItem} onClick={() => setDisplay(4)}>Create Event</div>
                  <div className={styles.submenuItem} onClick={() => setDisplay(5)}>Manage Events</div>
                </div>
              )}
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => toggleSubmenu(3)}>
              Projects
              {submenu == 3 && (
                <div className={styles.submenu}>
                  <div className={styles.submenuItem} onClick={() => setDisplay(6)}>Create Project</div>
                  <div className={styles.submenuItem} onClick={() => setDisplay(7)}>Manage Projects</div>
                </div>
              )}
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => toggleSubmenu(4)}>
              Blog Posts
              {submenu == 4 && (
                <div className={styles.submenu}>
                  <div className={styles.submenuItem} onClick={() => setDisplay(8)}>Create Post</div>
                  <div className={styles.submenuItem} onClick={() => setDisplay(9)}>Manage Posts</div>
                </div>
              )}
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => toggleSubmenu(5)}>
              Comments
              {submenu == 5 && (
                <div className={styles.submenu}>
                  <div className={styles.submenuItem} onClick={() => setDisplay(10)}>Comment Approval</div>
                  <div className={styles.submenuItem} onClick={() => setDisplay(11)}>Manage Comments</div>
                </div>
              )}
            </div>
            <div className={styles.layoutSidebarBtn} onClick={() => setDisplay(12)}>
              Feedback
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
          {(display == 0) && createteam}
          {(display == 1) && manageteam}
          {(display == 2) && createpartner}
          {(display == 3) && managepartner}
          {(display == 4) && createevent}
          {(display == 5) && manageevents}
          {(display == 6) && createproject}
          {(display == 7) && manageprojects}
          {(display == 8) && createpost} 
          {(display == 9) && manageposts} 
          {(display == 10) && commentapproval}
          {(display == 11) && managecomments}
          {(display == 12) && feedback} 
        </div>
      </div>
    </>
  )
}