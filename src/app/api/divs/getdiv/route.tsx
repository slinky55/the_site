import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const formData = await new Response(req.body).json();
    const id = formData.div_id;
    try  {
        const result = await executeQuery({
            query: `SELECT * FROM Images WHERE div_id = ?`,
            values: [id],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({div: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}