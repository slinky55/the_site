import { NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const formData = await new Response(req.body).json();
    const commentId = formData.comment_id;
    const userId = formData.user_id;
    const postId = formData.post_id;
    const parentId = formData.parent_comment_id;
    const content = formData.content;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO unapproved_comments (comment_id, user_id, post_id, parent_comment_id, content, created_at, last_modified) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            values: [commentId, userId, postId, parentId, content],
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