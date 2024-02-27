import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const newsId = formData.news_id;
    const title = formData.title;
    const imageSrc = formData.image_src;
    const content = formData.content;
    const outsideSite = formData.outside_site;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO News (news_id, title, image_src, content, outside_site, created_at, last_modified) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            values: [newsId, title, imageSrc, content, outsideSite],
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