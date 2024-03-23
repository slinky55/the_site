'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import { useEdgeStore } from '../../lib/edgestore';

import 'react-quill/dist/quill.snow.css';
import styles from '../page.module.css'


export default function Page() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [postContent, setPostContent] = useState('')
    const { edgestore } = useEdgeStore()
    const [file, setFile] = useState<File>()
    const [img, setImg] = useState<string>('')
    const [uploaded, setUploaded] = useState<Boolean>(false)

    useEffect(()=> {
        uploadImg()
    }, [file])

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

    const topics = ["Lifestyle", "Innovation", "Research", "Events", "Finance", "Technology & Gadgets", "Health"]
      

    async function createPost() {
        const postData = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: uuidv4(),
                user_id: '3ab70c34-984f-457e-9a0d-0387bb0f2771',
                title: title,
                topics: "",
                image_src: img,
                content: postContent
            }),
        }

        await fetch('/api/posts/createpost', postData);
    }

    async function uploadImg() {
        if (file) {
            const res = await edgestore.publicFiles.upload({
            file,
            onProgressChange: (progress) => {
                // you can use this to show a progress bar
            },
            });
            // you can run some server action or api here
            // to add the necessary data to your database
            setImg(res.url);
            setUploaded(true);
        }
    }

    return (
        <>
        
          <div>
            <div className={styles.title}>Create a New Post</div>
            <hr/>
            <div className={styles.newPostContainer}>
                <input
                    className={styles.newPostTitleInput}
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
                            }
                        }
                    }
                    placeholder="Write your blog content here!"  
                />
                <div>
                    <input
                        type="file"
                        onChange={(e) => {
                        setFile(e.target.files?.[0]);
                        }}
                    />
                    </div>
                <button 
                    className={styles.newPostBtn} 
                    onClick={createPost}
                    disabled={!uploaded}
                >
                    Create Post
                </button>
            </div>
          </div>
        </>
    )
}
