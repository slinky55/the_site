import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const researchId = formData.research_id;
    const title = formData.title;
    const journal = formData.journal;
    const topics = formData.reg_link;
    const thumbnail = formData.event_start;
    const writtenOn = formData.event_end;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO Research (research_id, title, journal, topics, thumbnail, written_on, added_to_db) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            values: [researchId, title, journal, topics, thumbnail, writtenOn],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({research: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}