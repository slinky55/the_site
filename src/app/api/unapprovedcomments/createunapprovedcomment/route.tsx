import { NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const formData = await new Response(req.body).json();
    const commentId = formData.comment_id;
    const authorId = formData.author_id;
    const postId = formData.post_id;
    const parentId = formData.parent_comment_id;
    const cmt = formData.cmt;
    const author = formData.author;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO unapproved_comments (comment_id, author_id, post_id, parent_comment_id, cmt, author, created_at, last_modified) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            values: [commentId, authorId, postId, parentId, cmt, author],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({comments: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}