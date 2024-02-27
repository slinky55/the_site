import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function DELETE(req: NextRequest, res: NextResponse) {
    const formData = await new Response(req.body).json();
    const id = formData.event_id;
    try  {
        const result = await executeQuery({
            query: `DELETE FROM News WHERE news_id = ?`,
            values: [id],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({news: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}