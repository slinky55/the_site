import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import {getServerSession} from "next-auth";
import {authConfig} from "@/app/lib/auth";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const commentId = formData.comment_id;
    const session = await getServerSession(authConfig);
    if (!session) {
        return NextResponse.json({error: "no session"}, {status: 403})
    }
    if (!session.user) {
        return NextResponse.json({error: "no session"}, {status: 403})
    }
    const userId = session.user.id;
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