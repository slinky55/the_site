import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";


export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const page = formData.page;
    const limit = formData.limit;
    const offset = formData.offset;
    
    try  {
        const result = await executeQuery({
            query: 'SELECT * FROM Images WHERE page = ? ORDER BY label DESC LIMIT ? OFFSET ?',
            values: [page, limit, offset],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({images: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}