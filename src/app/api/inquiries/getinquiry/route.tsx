import { NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const formData = await new Response(req.body).json();
    const id = formData.msg_id;
    try  {
        const result = await executeQuery({
            query: `SELECT * FROM inquiries WHERE msg_id = ?`,
            values: [id],
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