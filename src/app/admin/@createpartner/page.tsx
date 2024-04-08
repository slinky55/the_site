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
    const [link, setLink] = useState<string>('')
    const [about, setAbout] = useState<string>('')
    const [partnershipFormed, setPartnershipFormed] = useState<string>('')
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    async function createPartner() {
      const postData = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
              partner_id: uuidv4(),
              name: name,
              logo: img,
              website_link: link,
              description: about,
              partnership_formed: partnershipFormed,
          }),
      }

      await fetch('/api/partners/createpartner', postData);
  }

    function uploadImg(files: any) {
      setImg(files[0].link.replace('dl=0', 'raw=1'));
      setUploaded(true);
    }

    return (
        <>
        <div className={styles.title}>Create a New Partner</div>
          <hr/>
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
          placeholder="Link to Partner's Website"
          id="role"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required/>
          <textarea
          className={styles.contentInput}
          placeholder="Description of Partner"
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          required/>
          <input
          className={styles.projectLeadInput}
          style={{gridColumn: 'span 2'}}
          type="text"
          placeholder="Date Partnership was Formed. Please enter only the year in 'yyyy' form (i.e. 2017)"
          id="partnershipFormed"
          value={partnershipFormed}
          onChange={(e) => setPartnershipFormed(e.target.value)}
          required/>
          <div 
          className={styles.galleryLabel}>
            Upload Partner{"'"}s Logo
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
          onClick={createPartner}>
            Create Partner
          </button>
        </div>
      </>
    )
}
