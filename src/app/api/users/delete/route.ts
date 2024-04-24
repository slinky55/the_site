import {NextRequest, NextResponse} from "next/server";
import executeQuery from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    try  {
        const data = await req.json()
        console.log(data)
        const result = await executeQuery({
            query: `DELETE FROM users WHERE "users"."id" = ?`,
            values: [data.id],
        })

        if (res) {
            return NextResponse.json({message: "user deleted"}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}