import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const pageName = formData.page_name;
    const blocksOfText = formData.blocks_of_text;
    const images = formData.images;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO Page (page_name, blocks_of_text, images) VALUES (?, ?, ?)`,
            values: [pageName, blocksOfText, images],
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