import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const formData = await new Response(req.body).json();
    const id = formData.page_name;
    try  {
        const result = await executeQuery({
            query: `SELECT * FROM Page WHERE page_name = ?`,
            values: [id],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({page: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}