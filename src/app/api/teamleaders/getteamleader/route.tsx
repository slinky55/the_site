import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const formData = await new Response(req.body).json();
    const id = formData.leader_id;
    try  {
        const result = await executeQuery({
            query: `SELECT * FROM TeamLeader WHERE leader_id = ?`,
            values: [id],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({leaders: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}