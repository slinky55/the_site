'use client'
import {useState} from "react";
import {v4 as uuidv4} from 'uuid';
import styles from '../@createevent/page.module.css';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import SuccessMessage from "@/app/components/SuccessMessage";

export default function Page() {

    const [img, setImg] = useState<string>('')
    const [uploaded, setUploaded] = useState<Boolean>(false)
    const [name, setName] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [about, setAbout] = useState<string>('')
    const [partnershipFormed, setPartnershipFormed] = useState<string>('')
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [success, setSuccess] = useState(false);
    const [imgName, setImgName] = useState<string>('')

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

      try {
        await fetch('/api/partners/createpartner', postData);
        setSuccess(true);

        setTimeout(()  => {
          setSuccess(false);
          setName('');
          setImg('');
          setLink('');
          setAbout('');
          setPartnershipFormed('');
        }, 3000);

        } catch(error) {
            console.error('Error:', error);
        }
  }

    function uploadImg(files: any) {
      setImg(files[0].link.replace('dl=0', 'raw=1'));
      setImgName(files[0].name); // Set the image name
      setUploaded(true);
    }

    return (
        <>
        <div className={styles.title}>Create a New Partner</div>
          <hr/>
        <div className={styles.container}>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Partner Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required/>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Link to Partner's Website"
          id="role"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required/>
          <textarea
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          placeholder="Description of Partner"
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          required/>
          <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Date Partnership was Formed. Please enter only the year in 'yyyy' form (i.e. 2017)"
          id="partnershipFormed"
          value={partnershipFormed}
          onChange={(e) => setPartnershipFormed(e.target.value)}
          required/>
          <DropboxChooser
            appKey={appKey}
            success={(files: any) => uploadImg(files)}
            cancel={() => console.log('Canceled')}
            multiselect={false}
            extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
          >
              <button
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                  <div className="flex items-center">
                  Upload Logo
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                       className="w-5 h-5">
                      <path
                          d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z"/>
                      <path
                          d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/>
                  </svg>
                  </div>
              </button>
          </DropboxChooser>
          <div>
            Uploaded image: {imgName}
          </div>
            <hr style={{gridColumn: 'span 2'}}/>
            <button
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"

                disabled={!uploaded}
                onClick={createPartner}>
                Create Partner
            </button>
            <SuccessMessage success={success} message="Partner Successfully Added"/>
        </div>
        </>
    )
}