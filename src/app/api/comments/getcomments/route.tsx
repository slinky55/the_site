import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";


export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const id = formData.post_id;
    const limit = formData.limit;
    const offset = formData.offset;
    try  {
        const result = await executeQuery({
            query: 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            values: [id, limit, offset],
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