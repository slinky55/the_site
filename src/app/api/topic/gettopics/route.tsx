import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";


export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    try  {
        const result = await executeQuery({
            query: 'SELECT * FROM Topic ORDER BY Topic DESC',
            values: [],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({topics: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}