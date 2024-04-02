'use client'
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import styles from '../@createevent/page.module.css';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';

export default function Page() {

    const [img, setImg] = useState<string>('')
    const [uploaded, setUploaded] = useState<Boolean>(false)
    const [name, setName] = useState<string>('')
    const [role, setRole] = useState<string>('')
    const [about, setAbout] = useState<string>('')
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    async function createTeam() {
      const postData = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
              leader_id: uuidv4(),
              leader_name: name,
              team_role: role,
              about_me: about,
              image_src: img,
          }),
      }

      await fetch('/api/teamleaders/createteamleaders', postData);
  }

    function uploadImg(files: any) {
      setImg(files[0].link.replace('dl=0', 'raw=1'));
      setUploaded(true);
    }

    return (
        <>
        <div className={styles.title}>Create a New Team Member</div>
          <hr/>
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
            Upload Picture of Member
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
          <button 
          className={styles.btn}
          disabled={!uploaded}
          onClick={createTeam}>
            Create Member
          </button>
        </div>
      </>
    )
}
