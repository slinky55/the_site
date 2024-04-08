import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const partnerId = formData.partner_id;
    const name = formData.name;
    const logo = formData.logo;
    const websiteLink = formData.website_link;
    const description = formData.description;
    const partnershipFormed = formData.partnership_formed;
    
    try  {
        const result = await executeQuery({
            query: `UPDATE Partner SET name = ?, logo = ?, website_link = ?, description = ?, partnership_formed = ? WHERE partner_id = ?`,
            values: [name, logo, websiteLink, description, partnershipFormed, partnerId],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({partner: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}