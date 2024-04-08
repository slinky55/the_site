import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const divId = formData.div_id;
    const content = formData.content;
    const label = formData.label;
    const page = formData.page;
    
    try  {
        const result = await executeQuery({
            query: `UPDATE Divs SET page = ?, label = ?, content = ? WHERE div_id = ?`,
            values: [page, label, content, divId],
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