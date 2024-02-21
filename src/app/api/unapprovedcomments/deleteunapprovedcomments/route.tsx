import { NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';


export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    const formData = await new Response(req.body).json();
    const id = formData.comment_id;
    try  {
        const result = await executeQuery({
            query: `DELETE FROM unapproved_comments WHERE comment_id = ?`,
            values: [id],
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