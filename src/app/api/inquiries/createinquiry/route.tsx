import { NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const formData = await new Response(req.body).json();
    const msgId = formData.msg_id;
    const authorId = formData.author_id;
    const msg = formData.msg;
    const author = formData.author;
    const phone = formData.phone;
    const email = formData.email;
    const msgSubject = formData.msg_subject;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO inquiries (msg_id, author_id, msg, author, phone, email, msg_subject, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            values: [msgId, authorId, msg, author, phone, email, msgSubject],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({inquiries: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}