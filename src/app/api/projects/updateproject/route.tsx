import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const projectId = formData.project_id;
    const title = formData.title;
    const projectLead = formData.project_lead;
    const primaryImageSrc = formData.primary_image_src;
    const gallery = JSON.stringify(formData.gallery);
    const content = formData.content;

    
    try  {
        const result = await executeQuery({
            query: `UPDATE Project SET title = ?, project_lead = ?, primary_image_src = ?, gallery = ?, content = ? WHERE project_id = ?`,
            values: [title, projectLead, primaryImageSrc, gallery, content, projectId],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({project: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}