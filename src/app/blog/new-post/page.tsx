'use client'
import { Header } from '@/app/components/Header';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

export default function NewPostPage() {
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

        router.push('/blog');
    }

    return (
        <>
            <Header />
            <form>
                <h2>Create a New Post</h2>
                <label htmlFor="authorName">Author's Name:</label>
                <input
                    type="text"
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                />
                <label htmlFor="postContent">Post:</label>
                <textarea
                    id="postContent"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                ></textarea>
                <button onClick={createPost}>Create Post</button>
            </form>
        </>
    )
}
