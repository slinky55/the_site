import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const projectId = formData.project_id;
    const title = formData.title;
    const projectLead = formData.project_lead;
    const primaryImageSrc = formData.primary_image_src;
    const gallery = formData.gallery;
    const content = formData.content;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO Event (project_id, title, project_lead, primary_image_src, gallery, content) VALUES (?, ?, ?, ?, ?, ?)`,
            values: [projectId, title, projectLead, primaryImageSrc, gallery, content],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({projects: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}