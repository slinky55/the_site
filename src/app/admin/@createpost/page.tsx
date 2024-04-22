'use client'
import React, {useState} from 'react'
import {v4 as uuidv4} from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../page.module.css';
// @ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import SuccessMessage from "@/app/components/SuccessMessage";
import Quill from 'quill';
import ImageResize from 'quill-image-resize';

Quill.register('modules/imageResize', ImageResize);



export default function Page() {
    const [title, setTitle] = useState('')
    const [postContent, setPostContent] = useState('')
    const [img, setImg] = useState<string>('')
    const [uploaded, setUploaded] = useState<Boolean>(false)
    const appKey = process.env.NEXT_PUBLIC_DROPBOX_KEY;

    const [success, setSuccess] = useState(false);


    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
      ];

    const topics = ["Lifestyle", "Innovation", "Research", "Events", "Finance", "Technology & Gadgets", "Health", "AI", "Science"]
      
    async function createPost() {
        const postData = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: uuidv4(),
                user_id: 'd9f78e32-919a-474e-b7b7-d20449275d24',
                title: title,
                topics: "{}",
                image_src: img,
                content: postContent
            }),
        }

        try {
            await fetch('/api/posts/createpost', postData);
            setSuccess(true);

            setTimeout(()  => {
              setSuccess(false);
            }, 3000);

            } catch(error) {
                console.error('Error:', error);
            }
      }

    function uploadImg(files: any) {
        setImg(files[0].link.replace('dl=0', 'raw=1'));
        setUploaded(true);
    }

    return (
        <>

          <div>
            <div className={styles.title}>Create a New Post</div>
            <hr/>
            <div className={styles.newPostContainer}>
                <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                    placeholder="Title"
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <ReactQuill
                    theme="snow"
                    className={styles.newPostContentInput}
                    id="postContent"
                    value={postContent}
                    onChange={setPostContent}
                    modules={{
                        toolbar: {
                            container: toolbarOptions
                        },
                        imageResize: {} // Add this line
                    }}
                    placeholder="Write your blog content here!"
                />
                <DropboxChooser
                    appKey={appKey}
                    success={(files: any) => uploadImg(files)}
                    cancel={() => console.log('Canceled')}
                    multiselect={false}
                    extensions={['.jpeg', '.jpg', '.png', 'svg', 'webp', 'wbmp']}
                >
                    <button className={styles.dropboxUpload}>Upload Post Thumbnail</button>
                </DropboxChooser>
                <button
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={createPost}
                    disabled={!uploaded}
                >
                    Create Post
                </button>
                <SuccessMessage success={success} message="Blog Post Successfully Uploaded" />
            </div>
          </div>
        </>
    )
}