import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const formData = await new Response(req.body).json();
    const user_id = formData.id;
    console.log(`Fetching user with id: ${user_id}`);
    try  {
        const result = await executeQuery({
            query: `SELECT name, image FROM users WHERE id = ?`,
            values: [user_id],
        })
        console.log(`Query result: ${JSON.stringify(result)}`);

        if (res) {
            return NextResponse.json({user: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}