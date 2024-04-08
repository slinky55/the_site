import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const postId = formData.post_id;
    const userId = formData.user_id;
    const title = formData.title;
    const topics = formData.topics;
    const imageSrc = formData.image_src;
    const content = formData.content;
    
    try  {
        const result = await executeQuery({
            query: `UPDATE posts SET title = ?, topics = ?, image_src = ?, content = ?, last_modified = NOW() WHERE post_id = ?`,
            values: [userId, title, topics, imageSrc, content, postId],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({post: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}