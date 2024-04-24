import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import {getServerSession} from "next-auth";
import {authConfig} from "@/app/lib/auth";

export async function DELETE(req: NextRequest, res: NextResponse) {
    const formData = await new Response(req.body).json();
    const id = formData.comment_id;
    try  {
        const comment = await executeQuery({
            query: `SELECT * FROM comments WHERE comment_id = ?`,
            values: [id],
        }) as any[];

        const session = await getServerSession(authConfig);
        if (!session) {
            return NextResponse.json({error: "no session"}, {status: 403})
        }
        if (!session.user) {
            return NextResponse.json({error: "no session"}, {status: 403})
        }

        if (session.user.id != comment[0].user_id) {
            return NextResponse.json({error: "invalid user"}, {status: 403})
        }

        const result = await executeQuery({
            query: `DELETE FROM comments WHERE comment_id = ?`,
            values: [id],
        })

        if (res) {
            return NextResponse.json({comments: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}