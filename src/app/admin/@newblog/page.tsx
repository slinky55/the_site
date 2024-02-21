'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import styles from '../page.module.css'

export default function Page() {
    const router = useRouter();
    const [authorName, setAuthorName] = useState('');
    const [postContent, setPostContent] = useState('');

    async function createPost() {
        const postData = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: uuidv4(),
                author_id: uuidv4(),
                post: postContent,
                author: authorName
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
                    className={styles.newPostAuthorInput}
                    placeholder="Author Name"
                    type="text"
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                />
                <input
                    className={styles.newPostInput}
                    placeholder="Type your post here..."
                    type="text"
                    id="postContent"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                />
                <button className={styles.newPostBtn} onClick={createPost}>Create Post</button>
            </div>
          </form>
        </>
    )
}
