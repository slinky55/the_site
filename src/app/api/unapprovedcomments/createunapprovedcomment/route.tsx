import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import {getServerSession} from "next-auth";
import {authConfig} from "@/app/lib/auth";

export async function POST(req: NextRequest, res: NextResponse) {
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