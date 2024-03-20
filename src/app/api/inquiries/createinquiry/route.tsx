import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const formData = await new Response(req.body).json();
    const inquiryId = formData.inquiry_id;
    const firstName = formData.first_name;
    const lastName = formData.last_name;
    const subj = formData.subj;
    const email = formData.email;
    const content = formData.content;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO Inquiry (inquiry_id, first_name, last_name, subj, email, content, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            values: [inquiryId, firstName, lastName, subj, email, content],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({inquiries: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}