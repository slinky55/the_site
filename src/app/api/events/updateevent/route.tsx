import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const eventId = formData.event_id;
    const name = formData.name;
    const content = formData.content;
    const regLink = formData.reg_link;
    const eventStart = formData.event_start;
    const eventEnd = formData.event_end;
    
    try  {
        const result = await executeQuery({
            query: `UPDATE Event SET name = ?, content = ?, reg_link = ?, event_start = TO_TIMESTAMP(?, 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'), event_end = TO_TIMESTAMP(?, 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') WHERE event_id = ?`,
            values: [name, content, regLink, eventStart, eventEnd, eventId],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({partner: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}