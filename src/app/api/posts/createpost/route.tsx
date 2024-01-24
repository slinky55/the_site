import { NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const formData = await new Response(req.body).json();
    const postId = formData.post_id;
    const authorId = formData.author_id;
    const post = formData.post;
    const author = formData.author;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO posts (post_id, author_id, post, author, created_at, last_modified) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            values: [postId, authorId, post, author],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({posts: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}