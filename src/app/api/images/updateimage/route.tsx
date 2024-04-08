import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const imgId = formData.img_id;
    const url = formData.url;
    const label = formData.label;
    const page = formData.page;
    
    try  {
        const result = await executeQuery({
            query: `UPDATE Images SET page = ?, label = ?, url = ? WHERE img_id = ?`,
            values: [page, label, url, imgId],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({image: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}