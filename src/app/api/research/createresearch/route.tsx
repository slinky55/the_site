import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
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
            query: `INSERT INTO Research (research_id, title, journal, topics, thumbnail, written_on, url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            values: [researchId, title, journal, topics, thumbnail, writtenOn, url],
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