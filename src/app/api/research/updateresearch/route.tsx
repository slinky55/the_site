import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const researchId = formData.research_id;
    const title = formData.title;
    const journal = formData.journal;
    const topics = formData.topics;
    const thumbnail = formData.thumbnail;
    const writtenOn = formData.written_on;
    const url = formData.url;

    
    try  {
        const result = await executeQuery({
            query: `UPDATE Research SET title = ?, journal = ?, topics = ?, thumbnail = ?, written_on = ?, url = ? WHERE research_id = ?`,
            values: [title, journal, topics, thumbnail, writtenOn, url, researchId],
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