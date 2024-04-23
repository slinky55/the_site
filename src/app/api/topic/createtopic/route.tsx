import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const topicId = formData.topic_id;
    const topic = formData.topic;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO Topic(topic_id, topic) VALUES (?, ?)`,
            values: [topicId, topic],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({topic: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}