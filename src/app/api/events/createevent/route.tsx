import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
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
            query: `INSERT INTO Event (event_id, name, content, reg_link, event_start, event_end) VALUES (?, ?, ?, ?, ?, ?)`,
            values: [eventId, name, content, regLink, eventStart, eventEnd],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({events: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}