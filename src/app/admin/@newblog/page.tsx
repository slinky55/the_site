'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import { useEdgeStore } from '../../lib/edgestore';

import 'react-quill/dist/quill.snow.css';
import styles from '../page.module.css'


export default function Page() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const { edgestore } = useEdgeStore();
    const [file, setFile] = useState<File>();
    const [img, setImg] = useState<string>('')

    async function createPost() {
        const postData = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: uuidv4(),
                user_id: uuidv4(),
                title: title,
                topics: "",
                image_src: img,
                content: postContent
            }),
        }

        await fetch('/api/posts/createpost', postData);
    }

    return (
        <>
        
          <form>
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
                />
                <div>
                    <input
                        type="file"
                        onChange={(e) => {
                        setFile(e.target.files?.[0]);
                        }}
                    />
                    <button
                        onClick={async () => {
                        if (file) {
                            const res = await edgestore.publicFiles.upload({
                            file,
                            onProgressChange: (progress) => {
                                // you can use this to show a progress bar
                            },
                            });
                            // you can run some server action or api here
                            // to add the necessary data to your database
                            console.log(res);
                            setImg(res.url);
                            console.log(img);
                        }
                        }}
                    >
                        Upload
                    </button>
                    </div>
                <button className={styles.newPostBtn} onClick={createPost}>Create Post</button>
            </div>
          </form>
        </>
    )
}
