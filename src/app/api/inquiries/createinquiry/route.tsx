import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const formData = await new Response(req.body).json();
    const inquiryId = formData.inquiry_id;
    const userId = formData.user_id;
    const subject = formData.subject;
    const email = formData.email;
    const content = formData.content;
    
    try  {
        const result = await executeQuery({
            query: `INSERT INTO Inquiry (inquiry_id, user_id, subject, email, content, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
            values: [inquiryId, userId, subject, email, content],
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