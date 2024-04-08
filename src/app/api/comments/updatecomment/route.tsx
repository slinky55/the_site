import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const commentId = formData.comment_id;
    const userId = formData.user_id;
    const postId = formData.post_id;
    const parentId = formData.parent_comment_id;
    const content = formData.content;
    
    try  {
        const result = await executeQuery({
            query: `UPDATE comments SET user_id = ?, post_id = ?, parent_comment_id = ?, content = ?, last_modified = NOW() WHERE comment_id = ?`,
            values: [userId, postId, parentId, content, commentId],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({comment: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}