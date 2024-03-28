import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";


export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey")
    const formData = await new Response(req.body).json();
    const postId = formData.post_id;
    const userId = formData.user_id;
    const title = formData.title;
    const topics = formData.topics;
    const imageSrc = formData.image_src;
    const content = formData.content;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO posts (post_id, user_id, title, topics, image_src, content, created_at, last_modified) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            values: [postId, userId, title, topics, imageSrc, content],
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